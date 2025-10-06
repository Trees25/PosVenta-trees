import { Spinner1 } from "../components/moleculas/Spinner1";
import { CrudTemplate } from "../components/templates/CrudTemplate";
import { useEditarSerializacionDefaultMutation, useMostrarSerializacionesQuery } from "../tanstack/SerializacionStack";

import { useGlobalStore } from "../store/GlobalStore";
import { TablaSerializaciones } from "../components/organismos/tablas/TablaSerializaciones";
import { RegistrarSerializacion } from "../components/organismos/formularios/RegistrarSerializacion";
export const SerializacionComprobantes = () => {
  const { data, isLoading, error } = useMostrarSerializacionesQuery();
 const {mutate,isPending} = useEditarSerializacionDefaultMutation()

  if (isLoading) {
    return <Spinner1 />;
  }
  if (error) {
    return <span>error...{error.message} </span>;
  }
  return (
    <CrudTemplate
      data={data} FormularioRegistro={RegistrarSerializacion}
      title="Comprobantes"
      Tabla={<TablaSerializaciones data={data}/>}
     
    />
  );
};
