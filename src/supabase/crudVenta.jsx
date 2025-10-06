import Swal from "sweetalert2";
import { supabase } from "../index";
const tabla = "ventas";
export async function InsertarVentas(p) {
  const { error, data } = await supabase
    .from(tabla)
    .insert(p)
    .select()
    .maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}


export async function EliminarVentasIncompletas(p) {
  const { error } = await supabase
    .from(tabla)
    .delete()
    .eq("estado", "pendiente")
    .eq("id_usuario", p.id_usuario)
    .eq("id_cierre_caja", p.id_cierre_caja);
  if (error) {
    throw new Error(error.message);
  }
}
export async function EliminarVenta(p) {
  const { error } = await supabase
    .from(tabla)
    .delete()
    .eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
}

export async function MostrarVentasXsucursal(p) {
  const { data } = await supabase
    .from(tabla)
    .select()
    .eq("id_sucursal", p.id_sucursal)
    .eq("estado", "nueva")
    .maybeSingle();

  return data;
}
export async function ConfirmarVenta(p) {
  const { data, error } = await supabase
    .from(tabla)
    .update(p)
    .eq("id", p.id)
    .select();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
