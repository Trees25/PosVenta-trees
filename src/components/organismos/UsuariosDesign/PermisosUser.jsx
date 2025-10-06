import styled from "styled-components";
import { SelectList } from "../../ui/lists/SelectList";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useModulosStore } from "../../../store/ModulosStore";
import { Check } from "../../ui/toggles/Check";
import { useRolesStore } from "../../../store/RolesStore";
import { usePermisosStore } from "../../../store/PermisosStore";
import { useEffect } from "react";
import { useAsignacionCajaSucursalStore } from "../../../store/AsignacionCajaSucursalStore";
import { BarLoader } from "react-spinners";
import { useUsuariosStore } from "../../../store/UsuariosStore";
export const PermisosUser = () => {
  const {
    mostrarPermisos,
    toggleModule,
    selectedModules,
    setSelectedModules,
    mostrarPermisosDefault,
    actualizarPermisos,
    datapermisos,
  } = usePermisosStore();
  const { accion, selectItem: selectItemAsignaciones } =
    useAsignacionCajaSucursalStore();
  const { mostrarModulos } = useModulosStore();
  const { mostrarRoles, rolesItemSelect, setRolesItemSelect,dataroles } = useRolesStore();
  const { itemSelect } = useUsuariosStore();

  const { data: datamodulos, isLoading: isLoadingModulos } = useQuery({
    queryKey: ["mostrar modulos"],
    queryFn: mostrarModulos,
  });

  const { data: dataPermisosDefault, isLoading: isLoadingPermisosDefault } =
    useQuery({
      queryKey: ["mostrar permisos default"],
      queryFn: mostrarPermisosDefault,
    });
  const { isLoading: isLoadingPermisosUser } = useQuery({
    queryKey: [
      "mostrar permisos por usuario",
      { id_usuario: itemSelect?.id_usuario },
    ],
    queryFn: () => mostrarPermisos({ id_usuario: itemSelect?.id_usuario }),
    enabled: !!itemSelect,
  });
  const mutation = useMutation({
    mutationKey: ["actualizar permisos"],
    mutationFn: () => actualizarPermisos(),
  });
  useEffect(() => {
    if (accion === "Nuevo") {
      const permisosPorRol =
        dataPermisosDefault
          ?.filter((permiso) => permiso.id_rol === rolesItemSelect?.id)
          .map((permiso) => permiso.id_modulo) || [];
      setSelectedModules(permisosPorRol);
    }else{
       setRolesItemSelect({
          id: itemSelect.id_rol,
          nombre: itemSelect.rol,
       });
    }
  }, []);
  useEffect(() => {
    if (accion !== "Nuevo" && datapermisos) {
      const permisosUsuario = datapermisos.map((p) => p.idmodulo);
      setSelectedModules(permisosUsuario);
    }
  }, [accion, datapermisos]);
  const isLoading =
    isLoadingModulos ||
   
    isLoadingPermisosDefault ||
    isLoadingPermisosUser;
  if (isLoading) return <BarLoader />;
  return (
    <Container>
      <Title>permisos</Title>
      <label>Tipo: </label>
      <SelectList
        data={dataroles}
        displayField="nombre"
        onSelect={setRolesItemSelect}
        itemSelect={rolesItemSelect}
      />
      <List>
        {datamodulos?.map((module, index) => {
          const isChecked = itemSelect
            ? datapermisos?.some(
                (p) => String(p.idmodulo) === String(module.id)
              )
            : selectedModules.includes(module.id);
          return (
            <ListItem key={module.id}>
              <Check
                checked={isChecked}
                onChange={() => toggleModule(module.id)}
              />
              <Label>{module.nombre} </Label>
            </ListItem>
          );
        })}
      </List>
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1.5rem;
`;
const Title = styled.span`
  font-size: 1.5rem;
  text-align: center;
`;
const List = styled.ul`
  list-style: none;
  padding: 0;
`;
const ListItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
`;
const Label = styled.span`
  font-size: 1rem;
  color: #555;
  margin-left: 15px;
`;
