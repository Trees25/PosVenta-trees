import { useQuery } from "@tanstack/react-query";

import { useAlmacenesStore } from "../store/AlmacenesStore";
import { useCierreCajaStore } from "../store/CierreCajaStore";
import { useSucursalesStore } from "../store/SucursalesStore";

export const useMostrarAlmacenesXSucursalQuery = () => {
  const { sucursalesItemSelect } = useSucursalesStore();
  const { dataSucursales } = useSucursalesStore();
  const { dataCierreCaja } = useCierreCajaStore();
  const { mostrarAlmacenesXSucursal } = useAlmacenesStore();
  return useQuery({
    queryKey: [
      "mostrar almacen por sucursal",
      { id_sucursal: dataCierreCaja?.caja?.id_sucursal },
    ],
    queryFn: () =>
      mostrarAlmacenesXSucursal({
        id_sucursal: dataCierreCaja?.caja?.id_sucursal,
      }),
    enabled: !!dataCierreCaja,
  });
};
export const useMostrarAlmacenesXSucursalInventarioQuery = () => {
  const { sucursalesItemSelect } = useSucursalesStore();
  
  const { mostrarAlmacenesXSucursal } = useAlmacenesStore();
  return useQuery({
    queryKey: [
      "mostrar almacen por sucursal",
      { id_sucursal: sucursalesItemSelect?.id },
    ],
    queryFn: () =>
      mostrarAlmacenesXSucursal({
        id_sucursal: sucursalesItemSelect.id,
      }),
    enabled: !!sucursalesItemSelect,
  });
};
