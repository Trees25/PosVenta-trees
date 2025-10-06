import { create } from "zustand";

export const useDashboardStore = create((set, get) => ({
  fechaInicio: null,
  fechaFin: null,
  setRangoFechas: (inicio, fin) => set({ fechaInicio: inicio, fechaFin: fin }),
  limpiarFechas: () => set({ fechaInicio: null, fechaFin: null }),
  setFechasAnteriores: () => {
    const { fechaInicio, fechaFin } = get(); // Obtiene las fechas actuales del estado
    if (!fechaInicio || !fechaFin) {
      console.warn("Fechas no definidas, no se puede calcular el rango anterior.");
      return { fechaAnteriorInicio: null, fechaAnteriorFin: null };
    }

    const inicioActual = new Date(fechaInicio);
    const finActual = new Date(fechaFin);

    const rangoDias = Math.ceil((finActual - inicioActual) / (1000 * 60 * 60 * 24));

    const fechaAnteriorInicio = new Date(inicioActual);
    fechaAnteriorInicio.setDate(fechaAnteriorInicio.getDate() - rangoDias);

    const fechaAnteriorFin = new Date(finActual);
    fechaAnteriorFin.setDate(fechaAnteriorFin.getDate() - rangoDias);

    return {
      fechaAnteriorInicio: fechaAnteriorInicio.toISOString().split("T")[0],
      fechaAnteriorFin: fechaAnteriorFin.toISOString().split("T")[0],
    };
  },
}));
