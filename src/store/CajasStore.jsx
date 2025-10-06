import { create } from "zustand";
import {
  MostrarCajaXSucursal,

  EditarCaja,
  EliminarCaja,
} from "../supabase/crudCaja";
import { supabase } from "../supabase/supabase.config";
const tabla = "caja";
export const useCajasStore = create((set) => ({
  stateCaja: false,
  setStateCaja: (p) => set({ stateCaja: p }),
  accion: "",
  setAccion: (p) => set({ accion: p }),
  cajaSelectItem: [],
  setCajaSelectItem: (p) => {
    set({ cajaSelectItem: p });
  },

  dataCaja: null,
  mostrarCajaXSucursal: async (p) => {
    const response = await MostrarCajaXSucursal(p);
    set({ cajaSelectItem: response[0] });
    set({ dataCaja: response });
    return response;
  },

  insertarCaja: async (p) => {
    const { error, data } = await supabase
      .from(tabla)
      .insert(p)
      .select()
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
  editarCaja: async (p) => {
    await EditarCaja(p);
  },
  eliminarCaja: async (p) => {
    await EliminarCaja(p);
  },
}));
