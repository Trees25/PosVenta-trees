// supabase/functions/mercadopago-webhooks/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

// Carga las variables de entorno si estás en desarrollo local
if (Deno.env.get('SUPABASE_LOCAL_DEVELOPMENT')) {
  config({ export: true, path: '.env.local' });
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN')!;
// **NUEVO: Clave secreta para verificar la firma del webhook de Mercado Pago**
const MP_WEBHOOK_SECRET = Deno.env.get('MP_WEBHOOK_SECRET')!;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // **PASO CLAVE DE SEGURIDAD: Leer el cuerpo como texto para verificar la firma**
  const rawBody = await req.text();
  let body;
  try {
    body = JSON.parse(rawBody);
  } catch (parseError) {
    console.error("Error al parsear el cuerpo del webhook:", parseError);
    return new Response("Invalid JSON payload", { status: 400 });
  }

  console.log("Webhook recibido de Mercado Pago:", body);

  // **PASO DE SEGURIDAD: Verificación de la firma del webhook**
  const signature = req.headers.get('x-signature'); // O 'x-topic-id' + 'x-webhook-id' dependiendo de tu config MP
  const webhookId = req.headers.get('x-webhook-id'); // Necesario para la verificación de firma de MP
  
  if (!signature || !webhookId || !MP_WEBHOOK_SECRET) {
    console.warn("Faltan headers de firma o secreto de webhook. Saltando verificación de firma.");
    // En producción, esto debería ser un error 403. Para desarrollo, se puede ser más flexible.
    // return new Response("Missing signature headers or secret", { status: 403 });
  } else {
    try {
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(MP_WEBHOOK_SECRET),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign', 'verify']
        );
        
        // El formato de la firma suele ser `ts={timestamp},v1={signature}`
        const parts = signature.split(',').reduce((acc, part) => {
            const [key, value] = part.split('=');
            acc[key] = value;
            return acc;
        }, {});
        const receivedTimestamp = parts.ts;
        const receivedSignature = parts.v1;

        // Concatenar timestamp, webhook ID y cuerpo del mensaje
        const signedPayload = `id:${webhookId};ts:${receivedTimestamp};${rawBody}`;
        const signatureBuffer = await crypto.subtle.sign(
            'HMAC',
            key,
            encoder.encode(signedPayload)
        );
        const calculatedSignature = Array.from(new Uint8Array(signatureBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        if (calculatedSignature !== receivedSignature) {
            console.error("Firma de webhook inválida. Acceso denegado.");
            return new Response("Invalid webhook signature", { status: 403 });
        }
        // Opcional: Verificar que el timestamp no sea demasiado viejo (protección contra ataques de retransmisión)
        const now = Math.floor(Date.now() / 1000);
        if (Math.abs(now - parseInt(receivedTimestamp)) > 300) { // 5 minutos de diferencia máxima
            console.warn("Webhook timestamp demasiado viejo. Posible ataque de retransmisión.");
            return new Response("Stale webhook event", { status: 403 });
        }
        console.log("Firma de webhook verificada correctamente.");

    } catch (signatureError) {
        console.error("Error al verificar la firma del webhook:", signatureError);
        return new Response("Signature verification failed", { status: 403 });
    }
  }
  // FIN SEGURIDAD

  const topic = body.topic || body.type; // 'payment' o 'preapproval'
  // Usamos data.id porque en muchos webhooks de MP, el ID real viene dentro de 'data'
  const resourceId = body.data?.id || body.id; 

  if (!topic || !resourceId) {
    console.warn("Webhook invalido: falta topic o resourceId", body);
    return new Response("Invalid webhook payload", { status: 400 });
  }

  try {
    let paymentStatus = 'desconocido';
    let usuarioId = null;
    let mpDetails = null;
    let newLinkPagoMp = null; // Para guardar un nuevo link si es necesario

    // --- Obtener detalles del recurso desde Mercado Pago API ---
    let apiUrl = '';
    if (topic === 'payment') {
      apiUrl = `https://api.mercadopago.com/v1/payments/${resourceId}`;
    } else if (topic === 'preapproval') {
      apiUrl = `https://api.mercadopago.com/preapproval/${resourceId}`;
    } else {
      console.warn(`Webhook topic no soportado: ${topic}`);
      // Responde 200 OK para que MP no reintente con topics no manejados
      return new Response("Unknown topic, skipping", { status: 200 }); 
    }

    const mpResponse = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!mpResponse.ok) {
      const errorText = await mpResponse.text();
      console.error(`Error al obtener detalles de MP para ${topic} ${resourceId}: ${mpResponse.status} - ${errorText}`);
      return new Response("Failed to fetch MP details", { status: 500 });
    }
    mpDetails = await mpResponse.json();
    console.log(`Detalles de MP para ${topic} ${resourceId}:`, mpDetails);

    // --- Mapear estado de MP a tu estado interno y obtener usuario_id ---
    // Prioridad: external_reference, luego metadata (si aplica)
    usuarioId = mpDetails.external_reference;
    if (!usuarioId && mpDetails.metadata?.usuario_id) {
        usuarioId = mpDetails.metadata.usuario_id;
    }

    if (topic === 'payment') {
      const paymentDate = new Date(mpDetails.date_approved || mpDetails.date_created); // Usar la fecha de MP

      if (mpDetails.status === 'approved') {
        paymentStatus = 'al_dia';
        // newLinkPagoMp = null; // Si se paga, el link anterior podría ya no ser relevante si es de un pago único
      } else if (mpDetails.status === 'pending') {
        paymentStatus = 'pendiente';
      } else { // 'rejected', 'cancelled', 'refunded', etc.
        paymentStatus = 'vencido';
      }
    } else if (topic === 'preapproval') {
      const preapprovalDate = new Date(mpDetails.date_approved || mpDetails.date_created);

      if (mpDetails.status === 'authorized' || mpDetails.status === 'active') {
        paymentStatus = 'al_dia';
        newLinkPagoMp = mpDetails.auto_recurring?.free_trial?.link || mpDetails.init_point; // URL de la preaprobación si la necesitas
      } else if (mpDetails.status === 'pending') {
        paymentStatus = 'pendiente';
      } else { // 'cancelled', 'paused', 'finished', 'revoked'
        paymentStatus = 'vencido';
      }
    }

    if (!usuarioId) {
      console.error("No se pudo obtener usuario_id del webhook o detalles de MP. Saltando actualización DB.");
      return new Response("Missing usuario_id in MP details", { status: 400 });
    }
    
    // Validar que el usuario_id sea un UUID válido antes de usarlo
    if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(usuarioId)) {
        console.error(`usuario_id '${usuarioId}' no es un UUID válido. No se puede procesar.`);
        return new Response("Invalid usuario_id format", { status: 400 });
    }

    // --- Determinar nueva fecha de vencimiento ---
    // Consulta la suscripción actual para basar el próximo vencimiento
    const { data: currentSubscription, error: fetchCurrentSubError } = await supabaseAdmin
      .from('clientes_suscripciones')
      .select('fecha_proximo_vencimiento')
      .eq('usuario_id', usuarioId)
      .single();

    let nextDueDate = new Date(); // Valor por defecto
    if (paymentStatus === 'al_dia') {
      if (currentSubscription?.fecha_proximo_vencimiento) {
        // Si ya hay una fecha de vencimiento, extendemos desde ahí
        nextDueDate = new Date(currentSubscription.fecha_proximo_vencimiento);
      } else {
        // Si es la primera vez que se pone al día, un mes desde ahora
        nextDueDate = new Date();
      }
      nextDueDate.setMonth(nextDueDate.getMonth() + 1); // Añadir un mes
    } else {
        // Si no está al día, la fecha de vencimiento podría no cambiar o ser la última conocida
        if (currentSubscription?.fecha_proximo_vencimiento) {
            nextDueDate = new Date(currentSubscription.fecha_proximo_vencimiento);
        } else {
            // Si no hay fecha de vencimiento previa y no está al día, dejarlo como ahora o null
            nextDueDate = null; // O ajusta según tu lógica para vencidos/pendientes sin vencimiento claro
        }
    }


    const updateData = {
      estado_pago: paymentStatus,
      fecha_ultimo_pago: new Date().toISOString(), // Considera usar mpDetails.date_approved
      fecha_proximo_vencimiento: nextDueDate ? nextDueDate.toISOString() : null, // Acepta null
      dias_atraso: (paymentStatus === 'al_dia' ? 0 : mpDetails.days_of_delay || 0), // Reiniciar o usar el de MP
      suscripcion_mp_id: mpDetails.id, // ID del pago o preaprobación
      link_pago_mp: newLinkPagoMp || mpDetails.init_point || null, // Usar el nuevo link si se generó, o el init_point de MP
      updated_at: new Date().toISOString(),
    };
    
    // Si la fecha de vencimiento calculada es anterior a la fecha actual y el estado no es 'al_dia',
    // podría significar que sigue vencido. Ajustar `dias_atraso`
    if (nextDueDate && new Date(nextDueDate) < new Date() && paymentStatus !== 'al_dia') {
        const diffTime = Math.abs(new Date().getTime() - new Date(nextDueDate).getTime());
        updateData.dias_atraso = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }


    // --- Actualizar o insertar el estado en la tabla `clientes_suscripciones` ---
    const { data: existingSubscription, error: fetchError } = await supabaseAdmin
      .from('clientes_suscripciones')
      .select('id')
      .eq('usuario_id', usuarioId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 es "no rows found"
      console.error('Error al buscar suscripción existente:', fetchError.message);
      return new Response("Database error", { status: 500 });
    }

    if (existingSubscription) {
      const { error: updateError } = await supabaseAdmin
        .from('clientes_suscripciones')
        .update(updateData)
        .eq('usuario_id', usuarioId);

      if (updateError) {
        console.error('Error al actualizar suscripción:', updateError.message);
        return new Response("Database update error", { status: 500 });
      }
      console.log(`Suscripción actualizada para usuario ${usuarioId}. Estado: ${paymentStatus}`);
    } else {
      const { error: insertError } = await supabaseAdmin
        .from('clientes_suscripciones')
        .insert({
          ...updateData,
          usuario_id: usuarioId, // Asegúrate de insertar el usuario_id
          created_at: new Date().toISOString(), // También inicializa created_at
        });

      if (insertError) {
        console.error('Error al insertar suscripción:', insertError.message);
        return new Response("Database insert error", { status: 500 });
      }
      console.log(`Nueva suscripción insertada para usuario ${usuarioId}. Estado: ${paymentStatus}`);
    }

    return new Response("Webhook processed", { status: 200 });

  } catch (error) {
    console.error("Error al procesar webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});