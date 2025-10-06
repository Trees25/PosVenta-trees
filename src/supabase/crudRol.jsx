import { supabase } from "../index";
const tabla = "roles";
export async function MostrarRolesXnombre(p) {
  const { data } = await supabase
    .from(tabla)
    .select()
    .eq("nombre", p.nombre).maybeSingle();
  return data;
}
export async function MostrarRoles() {
  const { data } = await supabase.from(tabla).select().neq("nombre","superadmin")
  return data
}