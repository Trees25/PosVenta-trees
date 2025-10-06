import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCierreCajaStore } from "../store/CierreCajaStore";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useVentasStore } from "../store/VentasStore";
import { toast } from "sonner";
export const useEliminarVentasIncompletasMutate = () => {
  const queryClient = useQueryClient();
  const { eliminarventasIncompletas } = useVentasStore();
  const { datausuarios } = useUsuariosStore();
  const { dataCierreCaja } = useCierreCajaStore();
  return useMutation({
    mutationKey: ["eliminar ventas incompletas"],
    mutationFn: async () => {
      await eliminarventasIncompletas({
        id_usuario: datausuarios?.id,
        id_cierre_caja: dataCierreCaja?.id,
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mostrar detalle venta"]);
    },
  });
};
