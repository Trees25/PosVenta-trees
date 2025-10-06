import { create } from "zustand";
import { supabase } from "../supabase/supabase.config";

export const useReportStore = create((set) => ({
  reportStockPorAlmacenSucursal: async (p) => {
    const { data } = await supabase.rpc("report_stock_por_almacen_sucursal", p);
    return data;
  },
  reportStockBajoMinimo: async (p) => {
    const { data } = await supabase.rpc("report_stock_bajo_minimo", p);
    return data;
  },
  reportVentasPorSucursal: async (p) => {
    const { data } = await supabase.rpc("report_ventas_por_sucursal", p);
    return data;
  },
}));
