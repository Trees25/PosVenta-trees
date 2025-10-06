import Swal from "sweetalert2";
import { supabase } from "../index";
const tabla = "sucursales";
export async function MostrarSucursales(p) {
  const { data, error } = await supabase
    .from(tabla)
    .select()
    .eq("id_empresa", p.id_empresa);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
export async function MostrarSucursalesAsignadasXuser(p) {
  const { data } = await supabase.rpc("mostrarsucursalesasignadas", {
    _id_usuario: p.id_usuario,
  });
  return data;
}
export async function MostrarCajasXSucursal(p) {
  const { data } = await supabase
    .from(tabla)
    .select(`*, caja(*)`)
    .eq("id_empresa", p.id_empresa);
  return data;
}
export async function InsertarSucursal(p) {
  const { error } = await supabase.from(tabla).insert(p);
  if (error) {
    throw new Error(error.message);
  }
}
export async function EditarSucursal(p) {
  const { error } = await supabase.from(tabla).update(p).eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
}
export async function EliminarSucursal(p) {
  const { error } = await supabase.from(tabla).delete().eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
}
