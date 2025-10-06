import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useThemeStore, useUsuariosStore } from "..";
import { toast } from "sonner";
import { Dark, Light } from "../styles/themes";
export const useEditarPerfilMutation = () => {
  const queryClient = useQueryClient();
  const { editarUsuarios, datausuarios } = useUsuariosStore();

  return useMutation({
    mutationKey: ["editar perfil"],
    mutationFn: async (data) => {
      const p = {
        id: datausuarios?.id,
        nombres: data.nombres,
        nro_doc: data.nro_doc,
        telefono: data.telefono,
      };
      await editarUsuarios(p);
    },
    onError: (error) => {
      toast.error("Error al editar mi perfil: " + error.message);
    },
    onSuccess: () => {
      toast.success("Datos guardados");
      queryClient.invalidateQueries(["mostrar usuarios"]);
    },
  });
};
export const useEditarUserTheme = () => {
  const queryClient = useQueryClient();
  const { editarUsuarios, datausuarios } = useUsuariosStore();

  return useMutation({
    mutationKey: ["editar theme"],
    mutationFn: async () => {
      const { setTheme, theme } = useThemeStore();
      const themeUse = theme === "light" ? "dark" : "light";
      const themeStyle = datausuarios?.tema === "light" ? Dark : Light;
      setTheme({
        tema: themeUse,
        style: themeStyle,
      });
      const p = {
        id: datausuarios?.id,
        tema: themeUse,
      };

      await editarUsuarios(p);
    },
    onError: (error) => {
      toast.error("Error al editar tema: " + error.message);
    },
    onSuccess: () => {
      toast.success("Tema guardado");
      queryClient.invalidateQueries(["mostrar usuarios"]);
    },
  });
};
