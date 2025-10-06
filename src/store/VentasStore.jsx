import { create } from "zustand";
import {
  InsertarVentas,
  EliminarVentasIncompletas,
  MostrarVentasXsucursal,
  useClientesProveedoresStore,
  ConfirmarVenta,
  EliminarVenta,
  supabase,
} from "../index";
import { toast } from "sonner";
const initialState = {
  items: [],
  total: 0,
  statePantallaCobro: false,
  tipocobro: "",
  stateMetodosPago: false,
  idventa: 0,
};
export const useVentasStore = create((set, get) => ({
  ...initialState,
  porcentajeCambio: 0,
  dataventas: [],
  resetState: () => {
    const { selectCliPro } = useClientesProveedoresStore.getState();
    selectCliPro([]);
    set(initialState);
  },
  setStatePantallaCobro: (p) =>
    set((state) => {
      if (p.data.length === 0) {
        toast.warning("Agrega productos, no seas puerco");
        return {
          state,
        };
      } else {
        return {
          statePantallaCobro: !state.statePantallaCobro,
          tipocobro: p.tipocobro,
        };
      }
    }),
  setStateMetodosPago: () =>
    set((state) => ({ stateMetodosPago: !state.stateMetodosPago })),
  insertarVentas: async (p) => {
    const result = await InsertarVentas(p);
    set({ idventa: result?.id });
    return result;
  },
  eliminarventasIncompletas: async (p) => {
    await EliminarVentasIncompletas(p);
  },
  eliminarVenta: async (p) => {
    const { resetState } = get();
    await EliminarVenta(p);
    resetState();
  },
  mostrarventasxsucursal: async (p) => {
    const response = await MostrarVentasXsucursal(p);
    set({ dataventas: response });
    set({ idventa: response?.id ? response?.id : 0 });
    return response;
  },

  confirmarVenta: async (p) => {
    const { error, data } = await supabase
      .rpc("confirmar_venta", p)
      .select()
      .maybeSingle();
    if (error) {
      throw new Error(error.message);
    }

    return data;
  },
}));
