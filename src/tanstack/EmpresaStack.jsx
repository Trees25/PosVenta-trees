import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEmpresaStore } from "..";
import { toast } from "sonner";
import { useGlobalStore } from "../store/GlobalStore";

export const useUpdateEmpresaMutation = ( ) => {
  const queyClient = useQueryClient();
  const { dataempresa, editarEmpresa } = useEmpresaStore();
  const {file} = useGlobalStore()
  return useMutation({
    mutationKey: ["editar empresa"],
    mutationFn: async (data) => {
 
    const p = {
        id: dataempresa?.id,
        nombre: data.nombre,
        direccion_fiscal: data.direccion,
        impuesto: data.impuesto,
        valor_impuesto: parseFloat(data.valor_impuesto),
      };
      await editarEmpresa(p,dataempresa?.logo,file);
    },
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      toast.success("Datos guardados");
      queyClient.invalidateQueries(["mostrar empresa"]);
    },
  });
};
export const useUpdateEmpresaTicketMutation = () => {
  const {file} = useGlobalStore()
    const queyClient = useQueryClient();
    const { dataempresa, editarEmpresa } = useEmpresaStore();
    return useMutation({
      mutationKey: ["editar empresa"],
      mutationFn: async (data) => {
        const p = {
          id: dataempresa?.id,
          nombre: data?.nombre,
          id_fiscal: data?.id_fiscal,
          direccion_fiscal: data?.direccion_fiscal,
          nombre_moneda: data?.nombre_moneda,
          pie_pagina_ticket: data?.pie_pagina_ticket,
        };
    
        await editarEmpresa(p,dataempresa?.logo,file);
      },
      onError: (error) => toast.error(error.message),
      onSuccess: () => {
        toast.success("Datos guardados");
        queyClient.invalidateQueries(["mostrar empresa"]);
      },
    });
  };
