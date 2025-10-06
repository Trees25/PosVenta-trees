import { supabase } from "./supabase.config";
const tabla = "movimientos_stock";
export async function MostrarMovStock(p) {
  const { data, error } = await supabase
    .from(tabla)
    .select(
      `
      *,
      almacen!inner(
        *,
        sucursales!inner(
          *
        )
      )
    `
    )
    .eq("almacen.sucursales.id_empresa", p.id_empresa)
    .eq("id_producto", p.id_producto);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function InsertarMovStock(p) {
  const { error } = await supabase.from(tabla).insert(p);
  if (error) {
    throw new Error(error.message);
  }
}
