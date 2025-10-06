import { create } from "zustand";
import { supabase } from "../supabase/supabase.config";

export const useReportesStore = create((set, get) => ({
  totalventas: 0,
  totalventasAnterior: 0,
  porcentajeCambio: 0,
  totalCantidadDetalleVentas:0,
  totalGanancias:0,
  resetearventas: () =>
    set({
      idventa: 0,
    }),
  mostrarVentasDashboard: async (p) => {
    const { data } = await supabase.rpc("dashboartotalventasconfechas", p);
    // Calcular el total general en el frontend
    const totalGeneral = data.reduce(
      (sum, venta) => sum + Number(venta.total_ventas),
      0
    );
    set({ totalventas: totalGeneral });
    get().setCalcularPorcentajeCambio();
    return data;
  },
  mostrarCantidadDetalleVentasDashboard: async (p) => {
    const { data } = await supabase.rpc(
      "dashboardsumarcantidaddetalleventa",
      p
    );
set({totalCantidadDetalleVentas:data})
    return data;
  },
  mostrarVentasDashboardPeriodoAnterior: async (p) => {
    const { data, error } = await supabase.rpc(
      "dashboardsumarventasporempresaperiodoanterior",
      p
    );
    set({ totalventasAnterior: data });
    get().setCalcularPorcentajeCambio();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
  mostrarGananciasDetalleVenta: async (p) => {
    const { data, error } = await supabase.rpc(
      "dashboardsumargananciadetalleventa",
      p
    ); 
    if (error) {
      throw new Error(error.message);
    }
    set({totalGanancias:data})
    return data;
  },
  setCalcularPorcentajeCambio: () => {
    const { totalventas, totalventasAnterior } = get();

    const result =
      totalventasAnterior > 0
        ? ((totalventas - totalventasAnterior) / totalventasAnterior) * 100
        : 0;
    set({ porcentajeCambio: parseFloat(result.toFixed(2)) }); // Limita a 2 decimales y convierte a número
  },
}));
