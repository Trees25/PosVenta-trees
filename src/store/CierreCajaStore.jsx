import { create } from "zustand";
import {
  MostrarCierreCajaAperturada,
  AperturarCierreCaja,
  CerrarTurnoCaja,
} from "../supabase/crudCierresCaja";
import { supabase } from "../supabase/supabase.config";
const tabla = "cierrecaja";
export const useCierreCajaStore = create((set) => ({
  stateConteoCaja: false,
  setStateConteoCaja: (p) => set({ stateConteoCaja: p }),

  stateIngresoSalida: false,
  setStateIngresoSalida: (p) => set({ stateIngresoSalida: p }),

  stateCierreCaja: false,
  setStateCierraCaja: (p) => set({ stateCierreCaja: p }),
  tipoRegistro: "",
  setTipoRegistro: (p) => set({ tipoRegistro: p }),
  dataCierreCaja: null,
  mostrarCierreCaja: async (p) => {
    const response = await MostrarCierreCajaAperturada(p);
    set({ dataCierreCaja: response });
    return response;
  },
  aperturarcaja: async (p) => {
    const response = await AperturarCierreCaja(p);
    set({ dataCierreCaja: response });
    return response;
  },
  cerrarTurnoCaja: async (p) => {
    await CerrarTurnoCaja(p);
  },
  mostrarCierreCajaPorEmpresa: async (p) => {
    const { data, error } = await supabase.rpc(
      "mostrarcajasabiertasporempresa",
      p
    );

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
  mostrarCierreCajaPorUsuario: async (p) => {
    const { data, error } = await supabase
      .from(tabla)
      .select(`*, caja(*,sucursales(*))`)
      .eq("id_usuario", p.id_usuario)
      .eq("estado", 0)
      .maybeSingle();
    if (error) {
      throw new Error(error.message);
    }
    set({ dataCierreCaja: data });
    return data;
  },
  cierreCajaItemSelect: null,
  setCierreCajaItemSelect: (p) => {
    set({ cierreCajaItemSelect: p });
  },
}));
