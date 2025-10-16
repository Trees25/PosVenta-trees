// supabase/functions/generate-debt-payment-link/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

// Carga las variables de entorno si estás en desarrollo local
if (Deno.env.get('SUPABASE_LOCAL_DEVELOPMENT')) {
  config({ export: true, path: '.env.local' });
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!; // Se usa para el cliente autenticado por el usuario
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!; // Se usa para actualizar la DB (seguridad RLS)
const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN')!;
const MP_NOTIFICATION_URL = Deno.env.get('MP_NOTIFICATION_URL')!; // URL donde Mercado Pago enviará los webhooks (tu función mercadopago-webhooks)

// Cliente Supabase con rol de servicio para actualizaciones seguras
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

serve(async (req) => {
  if (req.method !== "POST") {
    console.log("Método no permitido:", req.method);
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 1. Autenticación del usuario
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    console.log("Error: Authorization header missing");
    return new Response(JSON.stringify({ error: "Authorization header missing" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log("Error: Bearer token missing");
    return new Response(JSON.stringify({ error: "Bearer token missing" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); // Cliente con el token del usuario
  supabase.auth.setSession({ access_token: token, refresh_token: '' });

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error al obtener usuario autenticado:", userError?.message || "Usuario no encontrado.");
    return new Response(JSON.stringify({ error: "Unauthorized: Invalid token or user" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const usuarioId = user.id;
  console.log("Usuario autenticado:", usuarioId);

  try {
    // 2. Obtener la información de la suscripción/deuda actual del usuario
    const { data: subscription, error: subError } = await supabaseAdmin // Usamos supabaseAdmin para ignorar RLS en esta lectura si es necesario, o supabase normal si RLS lo permite
      .from('clientes_suscripciones')
      .select('id, estado_pago, dias_atraso, fecha_proximo_vencimiento')
      .eq('usuario_id', usuarioId)
      .single();

    if (subError && subError.code !== 'PGRST116') {
      console.error('Error al buscar suscripción existente:', subError.message);
      return new Response(JSON.stringify({ error: "Database error fetching subscription" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!subscription || subscription.estado_pago === 'al_dia') {
      console.log("Usuario al día o sin suscripción, no se necesita generar link de pago por deuda.");
      return new Response(JSON.stringify({
        message: "No current debt or subscription found for payment link generation.",
        link_pago_mp: null,
        estado_pago: subscription?.estado_pago || 'al_dia'
      }), {
        status: 200, // OK porque la consulta se realizó con éxito
        headers: { "Content-Type": "application/json" },
      });
    }

    // Calcular el monto de la deuda. Esto es un ejemplo.
    // Deberías reemplazar esta lógica con cómo calculas la deuda real de tu sistema.
    // Por ejemplo, podrías tener una tabla de 'deudas_pendientes' o un monto fijo por suscripción.
    let montoDeuda = 0;
    let descripcionDeuda = "Pago de suscripción mensual";

    // Lógica de ejemplo para el monto (ADAPTAR A TU NEGOCIO)
    if (subscription.estado_pago === 'pendiente' || subscription.estado_pago === 'vencido') {
      // Supongamos un costo mensual fijo de 100
      const costoMensual = 100;
      montoDeuda = costoMensual; // Si es mensual, paga un mes. Podrías sumar más si son varios meses.
      descripcionDeuda = `Pago de suscripción - ${subscription.estado_pago}`;
      if (subscription.dias_atraso > 0) {
          descripcionDeuda += ` (Atraso: ${subscription.dias_atraso} días)`;
          // Podrías añadir recargos aquí si es necesario
      }
    } else {
        // En teoría, este caso no debería ocurrir si ya hemos filtrado arriba
        console.warn("Estado de suscripción inesperado para generar link de deuda:", subscription.estado_pago);
        return new Response(JSON.stringify({ error: "Unexpected subscription status for debt link" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    if (montoDeuda <= 0) {
        console.warn("Monto de deuda es 0 o negativo, no se puede generar link de pago.");
        return new Response(JSON.stringify({ error: "Debt amount is zero or negative" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }


    // 3. Crear una preferencia de pago en Mercado Pago
    console.log("Creando preferencia de pago en Mercado Pago para usuario:", usuarioId, "Monto:", montoDeuda);
    const mpPreferenceResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: [
          {
            title: descripcionDeuda,
            description: `Regularización de tu suscripción en el sistema POS.`,
            quantity: 1,
            currency_id: 'ARS', // O la moneda que uses
            unit_price: montoDeuda,
          },
        ],
        external_reference: usuarioId, // MUY IMPORTANTE: vincula este pago con tu usuario_id
        notification_url: MP_NOTIFICATION_URL, // La URL de tu webhook de Mercado Pago
        // Puedes añadir más configuraciones como back_urls, auto_return, etc.
        // Por ejemplo, para redirigir al usuario después del pago:
        back_urls: {
            success: "https://tudominio.com/pago-exitoso", // Reemplaza con tus URLs
            pending: "https://tudominio.com/pago-pendiente",
            failure: "https://tudominio.com/pago-fallido",
        },
        auto_return: "approved", // Redirige automáticamente al usuario si el pago es aprobado
      }),
    });

    if (!mpPreferenceResponse.ok) {
      const errorText = await mpPreferenceResponse.text();
      console.error("Error al crear preferencia de pago en Mercado Pago:", mpPreferenceResponse.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to create Mercado Pago preference", details: errorText }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const mpPreference = await mpPreferenceResponse.json();
    const linkPagoMp = mpPreference.init_point; // Este es el link al checkout de MP
    console.log("Link de pago generado por Mercado Pago:", linkPagoMp);

    // 4. Actualizar el link_pago_mp en la base de datos de Supabase
    const { error: updateError } = await supabaseAdmin
      .from('clientes_suscripciones')
      .update({
        link_pago_mp: linkPagoMp,
        updated_at: new Date().toISOString(),
      })
      .eq('usuario_id', usuarioId);

    if (updateError) {
      console.error('Error al actualizar link_pago_mp en la DB:', updateError.message);
      return new Response(JSON.stringify({ error: "Database update error for link_pago_mp" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    console.log("Link de pago actualizado en la base de datos para usuario:", usuarioId);

    // 5. Devolver el link de pago al frontend
    return new Response(JSON.stringify({ link_pago_mp: linkPagoMp }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error general en generate-debt-payment-link:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});