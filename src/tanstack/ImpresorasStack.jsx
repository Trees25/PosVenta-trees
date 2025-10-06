import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAsignacionCajaSucursalStore } from "../store/AsignacionCajaSucursalStore"
import { useImpresorasStore } from "../store/ImpresorasStore"
import { toast } from "sonner"

export const useMostrasrImpresorasPorCajaQuery =()=>{
    const  {mostrarImpresoraXCaja}= useImpresorasStore()
    const {sucursalesItemSelectAsignadas} = useAsignacionCajaSucursalStore()
    return useQuery({
        queryKey: ['mostrar impresora por caja',{
            id_caja:sucursalesItemSelectAsignadas?.id_caja
        }],
        queryFn: async () => mostrarImpresoraXCaja({
            id_caja:sucursalesItemSelectAsignadas?.id_caja
        }),
        enabled:!!sucursalesItemSelectAsignadas,
        refetchOnWindowFocus: false,

    })
}
export const useEditarImpresorasMutation = () => {
    const { dataImpresorasPorCaja, statePrintDirecto, editarImpresoras } =
      useImpresorasStore();
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationKey: ["editar impresoras"],
      mutationFn: async () => {
        const p = {
          id: dataImpresorasPorCaja?.id,
          state: statePrintDirecto,
        };
        await editarImpresoras(p);
      },
      onError: (error) => {
        toast.error("Error al editar impresoras: " + error.message);
      },
      onSuccess: () => {
        toast.success("Datos guardados");
        queryClient.invalidateQueries(["mostrar impresora por caja"]);
      },
    });
  };