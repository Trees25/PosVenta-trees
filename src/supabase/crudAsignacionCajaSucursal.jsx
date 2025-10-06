import { supabase } from "../supabase/supabase.config";
const tabla = "asignacion_sucursal";
export async function MostrarSucursalCajaAsignada(p) {
  const { data } = await supabase
    .from(tabla)
    .select(`*, sucursales(*), caja(*)`)
    .eq("id_usuario", p.id_usuario)
    .maybeSingle();
    return data;
}
export async function InsertarAsignacionCajaSucursal(p) {
  const { error } = await supabase.from(tabla).insert(p);
  if (error) {
    throw new Error(error.message);
  }
}

export async function MostrarUsuariosAsignados(p) {
  const { data } = await supabase.rpc("mostrarusuariosasignados",p)
  return data
}
export async function BuscarUsuariosAsignados(p) {
  const { data } = await supabase.rpc("buscarusuariosasignados",p)
  return data
}