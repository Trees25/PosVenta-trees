import { create } from "zustand";
import {
  InsertarDetalleVentas,
  MostrarDetalleVenta,
  EliminarDetalleVentas,
  Mostrartop5productosmasvendidosxcantidad,
  Mostrartop10productosmasvendidosxmonto,
  EditarCantidadDetalleVenta,
} from "../index";
function calcularTotal(items) {
  return items.reduce(
    (total, item) => total + item.precio_venta * item.cantidad,
    0
  );
}
export const useDetalleVentasStore = create((set, get) => ({
  datadetalleventa: [],
  parametros: {},
  total: 0,
  mostrardetalleventa: async (p) => {
    const response = await MostrarDetalleVenta(p);
    set({ datadetalleventa: response });
    set({ total: calcularTotal(response) });
    return response;
  },
  insertarDetalleVentas: async (p) => {
    await InsertarDetalleVentas(p);
  },
  eliminardetalleventa: async (p) => {
    await EliminarDetalleVentas(p);
  },
  mostrartop5productosmasvendidosxcantidad: async (p) => {
    const response = Mostrartop5productosmasvendidosxcantidad(p);
    return response;
  },
  mostrartop10productosmasvendidosxmonto: async (p) => {
    const response = Mostrartop10productosmasvendidosxmonto(p);
    return response;
  },
  editarCantidadDetalleVenta: async (p) => {
    await EditarCantidadDetalleVenta(p);
  },
}));
