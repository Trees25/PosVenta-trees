import { useQuery } from "@tanstack/react-query";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useSucursalesStore } from "../store/SucursalesStore";

export const useMostrarSucursalesQuery = () => {
  const { dataempresa } = useEmpresaStore();
  const { mostrarSucursales } =
    useSucursalesStore();
  return useQuery({
    queryKey: ["mostrar sucursales", { id_empresa: dataempresa?.id }],
    queryFn: () =>
      mostrarSucursales({
        id_empresa: dataempresa?.id,
      }),
    enabled: !!dataempresa,
  });
};
// export const useInsertarMovStockMutation = () => {
//   const { itemSelect, setStateClose } = useGlobalStore();
//   const queryClient = useQueryClient();
//   const { insertarProductos, productosItemSelect } = useProductosStore();
//   const { categoriaItemSelect } = useCategoriasStore();
//   const { tipo, insertarMovStock, setTipo } = useMovStockStore();
//     const { mostrarStockXAlmacenYProducto, editarStock } = useStockStore();
//   const { mostrarAlmacenesXSucursal, setAlmacenSelectItem, almacenSelectItem } =
//     useAlmacenesStore();
//       const fechaActual = useFormattedDate();
//   return useMutation({
//     mutationKey: ["insertar movimiento stock"],
//     mutationFn: async (data) => {
//       const pMovimientoStock = {
//         id_almacen: almacenSelectItem?.id,
//         id_producto: productosItemSelect?.id,
//         tipo_movimiento: tipo,
//         cantidad: parseFloat(data.cantidad),
//         fecha: fechaActual,
//         detalle: data.detalle ? data.detalle : "registro de inventario manual",
//         origen: "inventario",
//       };
//       const pStock = {
//         _id: dataStock?.id,
//         cantidad: parseFloat(data.cantidad),
//       };
//       await insertarMovStock(pMovimientoStock);
//       await editarStock(pStock, tipo);
//     },
//     onError: (error) => {
//       toast.error("Error: " + error.message);
//     },
//     onSuccess: () => {
//       toast.success("Registro guardado correctamente");
//       queryClient.invalidateQueries(["buscar productos"]);
//     },
//   });
// };
