// supabase/functions/get-payment-status/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

serve(async (req) => {
  if (req.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Authorization header missing" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return new Response(JSON.stringify({ error: "Bearer token missing" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  // No es necesario setSession para getUser con el token directo, getUser lo maneja.
  // Pero si quieres que el cliente 'supabase' use ese contexto para RLS en futuras llamadas,
  // entonces setSession es útil. Por ahora, lo mantenemos.
  supabase.auth.setSession({ access_token: token, refresh_token: '' }); // Un pequeño ajuste para setSession


  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error al obtener usuario autenticado:", userError?.message || "Usuario no encontrado.");
    return new Response(JSON.stringify({ error: "Unauthorized: Invalid token or user" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const usuarioId = user.id;

  try {
    const { data: subscriptionData, error } = await supabase
      .from('clientes_suscripciones')
      .select('estado_pago, dias_atraso, link_pago_mp, fecha_proximo_vencimiento, suscripcion_mp_id') // <--- Columnas específicas
      .eq('usuario_id', usuarioId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 es "no rows found"
      console.error('Error fetching payment status:', error.message);
      return new Response(JSON.stringify({ error: "Database error fetching subscription" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Objeto base para el estado de pago
    let finalStatus = {
      estado_pago: 'al_dia',
      dias_atraso: 0,
      link_pago_mp: null,
      fecha_proximo_vencimiento: null,
      suscripcion_mp_id: null,
    };

    if (subscriptionData) {
      finalStatus = { ...subscriptionData }; // Copiar los datos de la DB

      // **MEJORA: Calcular dias_atraso dinámicamente si la suscripción está vencida/pendiente**
      if (finalStatus.estado_pago !== 'al_dia' && finalStatus.fecha_proximo_vencimiento) {
        const now = new Date();
        const nextDueDate = new Date(finalStatus.fecha_proximo_vencimiento);

        if (now > nextDueDate) {
          const diffTime = Math.abs(now.getTime() - nextDueDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          finalStatus.dias_atraso = diffDays;
        } else {
          finalStatus.dias_atraso = 0; // Si no ha vencido aún, no hay atraso
        }
      } else if (finalStatus.estado_pago === 'al_dia') {
        finalStatus.dias_atraso = 0; // Si está al día, resetear atraso
      }
    }

    return new Response(JSON.stringify(finalStatus), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in get-payment-status function:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});