import Swal from "sweetalert2";
import { supabase } from "../index";
const tabla = "detalle_venta";
export async function InsertarDetalleVentas(p) {
  const { error } = await supabase.rpc("insertardetalleventa", p);
  if (error) {
    throw new Error(error.message);
  }
}
export async function EditarCantidadDetalleVenta(p) {
  const { error } = await supabase.rpc("editarcantidaddv", p);
  if (error) {
    throw new Error(error.message);
  }
}
export async function MostrarDetalleVenta(p) {
  const { data, error } = await supabase
    .from(tabla)
    .select(`*, ventas(*),productos(*)`)
    .eq("id_venta", p.id_venta);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function EliminarDetalleVentas(p) {
  const { error } = await supabase.from(tabla).delete().eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
}
export async function Mostrartop5productosmasvendidosxcantidad(p) {
  const { data } = await supabase.rpc(
    "mostrartop5productosmasvendidosxcantidad",
    p
  );
  return data;
}
export async function Mostrartop10productosmasvendidosxmonto(p) {
  const { data } = await supabase.rpc(
    "mostrartop10productosmasvendidosxmonto",
    p
  );
  return data;
}
