import { create } from "zustand";
import { supabase } from "../supabase/supabase.config";
const tabla = "serializacion_comprobantes";
export const useSerializacionStore = create((set) => ({
  dataComprobantes: null,
  itemComprobanteSelect: null,
  setItemComprobanteSelect: (p) => {
    set({ itemComprobanteSelect: p });
  },
  mostrarSerializaciones: async (p) => {
    const { data, error } = await supabase
      .from(tabla)
      .select(`*,tipo_comprobantes(*)`)
      .eq("sucursal_id", p.id_sucursal)
      .order("id", { ascending: true });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  mostrarSerializacionesVentas: async (p) => {
    const { data, error } = await supabase
      .from(tabla)
      .select(`*,tipo_comprobantes!inner(*)`)
      .eq("sucursal_id", p.id_sucursal)
      .filter("tipo_comprobantes.destino", "eq", "ventas")
      .order("id", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }
    set({ dataComprobantes: data });
    set({ itemComprobanteSelect: data[0] });

    return data;
  },
  editarSerializacionDefault: async (p) => {
    const { error } = await supabase.rpc("setdefaultserializacion", p);
    if (error) {
      throw new Error(error.message);
    }
  },
  editarSerializacion: async (p) => {
    const { error } = await supabase.from(tabla).update(p).eq("id", p.id);
    if (error) {
      throw new Error(error.message);
    }
  },
}));
