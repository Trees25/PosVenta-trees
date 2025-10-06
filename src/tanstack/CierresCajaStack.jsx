import { useQuery } from "@tanstack/react-query";
import { useCierreCajaStore } from "../store/CierreCajaStore";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useUsuariosStore } from "../store/UsuariosStore";

export const useMostrarCierreCajaPorEmpresaQuery = () => {
  const { mostrarCierreCajaPorEmpresa } = useCierreCajaStore();

  const { dataempresa } = useEmpresaStore();
  return useQuery({
    queryKey: [
      "mostrar cierre caja por empresa",
      {
        _id_empresa: dataempresa?.id,
      },
    ],
    queryFn: () =>
      mostrarCierreCajaPorEmpresa({
        _id_empresa: dataempresa?.id,
      }),
    enabled: !!dataempresa,
  });
};
export const useMostrarAperturasCajaPorUsuarioQuery = () => {
  const { mostrarCierreCajaPorUsuario } = useCierreCajaStore();

  const { datausuarios } = useUsuariosStore();
  return useQuery({
    queryKey: [
      "mostrar caja aperturada por usuario",
      {
        id_usuario: datausuarios?.id,
      },
    ],
    queryFn: () =>
      mostrarCierreCajaPorUsuario({
        id_usuario: datausuarios?.id,
      }),
    enabled: !!datausuarios,
  });
};
