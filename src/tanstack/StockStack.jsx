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
export const useMostrarStockXAlmacenesYProductoQuery = () => {
  const { mostrarStockXAlmacenesYProducto } = useStockStore();
  const { almacenSelectItem } = useAlmacenesStore();
  const { productosItemSelect } = useProductosStore();
  return useQuery({
    queryKey: [
      "mostrar Stock XAlmacenes YProducto",
      {
        id_producto: productosItemSelect?.id,
        id_almacen: almacenSelectItem?.id,
      },
    ],
    queryFn: () =>
      mostrarStockXAlmacenesYProducto({
        id_producto: productosItemSelect?.id,
        id_almacen: almacenSelectItem?.id,
      }),
    enabled: !!almacenSelectItem,
    refetchOnWindowFocus: false,
  });
};
export const useMostrarStockXAlmacenYProductoQuery = () => {
  const { mostrarStockXAlmacenYProducto } = useStockStore();
  const { dataempresa } = useEmpresaStore();
  const { mostrarAlmacenesXSucursal, setAlmacenSelectItem, almacenSelectItem } =
    useAlmacenesStore();
  const { dataSucursales } = useSucursalesStore();
  const { productosItemSelect } = useProductosStore();
  return useQuery({
    queryKey: [
      "mostrar StockXAlmacenYProducto",
      {
        id_almacen: almacenSelectItem?.id,
        id_producto: productosItemSelect?.id,
      },
    ],
    queryFn: () =>
      mostrarStockXAlmacenYProducto({
        id_almacen: almacenSelectItem?.id,
        id_producto: productosItemSelect?.id,
      }),
    enabled: !!dataSucursales,
  });
};
export const useMostrarStockPorProductoQuery = () => {
  const { mostrarStockPorProducto } = useStockStore();
  const { productosItemSelect } = useProductosStore();
  return useQuery({
    queryKey: [
      "mostrar stock por producto",
      {
        id_producto: productosItemSelect?.id,
      },
    ],
    queryFn: () =>
      mostrarStockPorProducto({
        id_producto: productosItemSelect?.id,
      }),
    enabled: !!productosItemSelect,
  });
};
export const useInsertarStockMutation = () => {
  const { itemSelect, setStateClose } = useGlobalStore();
  const queryClient = useQueryClient();
  const { insertarProductos, productosItemSelect } = useProductosStore();
  const { categoriaItemSelect } = useCategoriasStore();
  const { tipo, insertarMovStock, setTipo } = useMovStockStore();
  const { mostrarStockXAlmacenYProducto, editarStock, insertarStock } =
    useStockStore();
  const { mostrarAlmacenesXSucursal, setAlmacenSelectItem, almacenSelectItem } =
    useAlmacenesStore();
  const fechaActual = useFormattedDate();
  return useMutation({
    mutationKey: ["insertar movimiento stock"],
    mutationFn: async (data) => {
      const pStock = {
        id_almacen: almacenSelectItem?.id,
        id_producto: productosItemSelect?.id,
        stock: parseFloat(data.stock),
        stock_minimo: parseFloat(data.stock_minimo),
        ubicacion: data.ubicacion,
      };

      await insertarStock(pStock);
    },
    onError: (error) => {
      toast.error("Error: " + error.message);
    },
    onSuccess: () => {
      toast.success("Registro guardado correctamente");
      queryClient.invalidateQueries(["buscar productos"]);
    },
  });
};
