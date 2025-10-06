import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useSucursalesStore } from "../store/SucursalesStore";
import { useImpresorasStore } from "../store/ImpresorasStore";
import { toast } from "sonner";
import { useAsignacionCajaSucursalStore } from "../store/AsignacionCajaSucursalStore";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useProductosStore } from "../store/ProductosStore";
import { ConvertirMinusculas } from "../utils/Conversiones";
import { useCategoriasStore } from "../store/CategoriasStore";
import { useMovStockStore } from "../store/MovStockStore";
import { useAlmacenesStore } from "../store/AlmacenesStore";
import { useFormattedDate } from "../hooks/useFormattedDate";
import { useStockStore } from "../store/StockStore";
import { useGlobalStore } from "../store/GlobalStore";

// export const useBuscarProductosQuery = () => {
//   const { buscador, buscarProductos } = useProductosStore();
//   const { dataempresa } = useEmpresaStore();

//   return useQuery({
//     queryKey: ["buscar productos", buscador],
//     queryFn: () =>
//       buscarProductos({
//         id_empresa: dataempresa?.id,
//         buscador: buscador,
//       }),
//     enabled: !!dataempresa,
//   });
// };
export const useInsertarMovStockMutation = () => {
  const queryClient = useQueryClient();
  const {  productosItemSelect,resetProductosItemSelect } = useProductosStore();
 const { itemSelect ,setStateClose} = useGlobalStore();
  const { tipo, insertarMovStock } = useMovStockStore();
  const {  editarStock,dataStockXAlmacenYProducto:dataStock } = useStockStore();
  const { almacenSelectItem } =
    useAlmacenesStore();
   
  const { editarPreciosProductos } = useProductosStore();
  const fechaActual = useFormattedDate();
  console.log("dataStock",dataStock)
  return useMutation({
    mutationKey: ["insertar movimiento stock"],
    mutationFn: async (data) => {
      const pMovimientoStock = {
        id_almacen: almacenSelectItem?.id,
        id_producto: productosItemSelect?.id,
        tipo_movimiento: tipo,
        cantidad: parseFloat(data.cantidad),
        fecha: fechaActual,
        detalle: "registro de inventario manual",
        origen: "inventario",
      };
      const pStock = {
        _id: dataStock?.id,
        cantidad: parseFloat(data.cantidad),
      };
      const pProductos = {
        id: productosItemSelect?.id,
        precio_compra: parseFloat(
          (productosItemSelect?.precio_compra + data.precio_compra) / 2
        ),
        precio_venta: parseFloat(
          (productosItemSelect?.precio_venta + data.precio_venta) / 2
        ),
      };
      console.log("pMovimientoStock",pMovimientoStock)
      console.log("pStock",pStock)
      console.log("pProductos",pProductos)
      console.log("tipo",tipo)
      
      await insertarMovStock(pMovimientoStock);
       await editarStock(pStock, tipo);
       await editarPreciosProductos(pProductos);
    },
    onError: (error) => {
      toast.error("Error:" + error.message);
    },
    onSuccess: () => {
      toast.success("Registro guardado correctamente");
      queryClient.invalidateQueries(["buscar productos"]);
      setStateClose(false)
      resetProductosItemSelect()
    },
  });
};
