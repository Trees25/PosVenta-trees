import { useQuery } from "@tanstack/react-query";
import { ConfiguracionesTemplate, Spinner1, useUsuariosStore } from "../index";
import {useModulosStore} from "../store/ModulosStore"
import { usePermisosStore } from "../store/PermisosStore";
import { useAsignacionCajaSucursalStore } from "../store/AsignacionCajaSucursalStore";
export function Configuraciones() {
  const {datausuarios} = useUsuariosStore()
  const { mostrarPermisosConfiguracion } = usePermisosStore();
  const {  isLoading, error } = useQuery({
    queryKey: ["mostrar permisos configuracion"],
    queryFn: ()=>mostrarPermisosConfiguracion({id_usuario:datausuarios?.id}),
  });
  if (isLoading) {
    return <Spinner1/>;
  }
  if(error){
    return(<span>error...</span>)
  }
  return ( <ConfiguracionesTemplate />);
}
