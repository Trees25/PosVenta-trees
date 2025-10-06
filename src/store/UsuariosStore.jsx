import { create } from "zustand";
import {
  EditarUsuarios,
  EliminarUsuarioAsignado,
  InsertarCredencialesUser,
  InsertarUsuarios,
} from "../index";
import { InsertarAsignacionCajaSucursal } from "../supabase/crudAsignacionCajaSucursal";
import { usePermisosStore } from "./PermisosStore";
import { InsertarPermisos } from "../supabase/crudPermisos";
import { supabase } from "../supabase/supabase.config";
const tabla = "usuarios";
export const useUsuariosStore = create((set) => ({
  refetchs: null,
  datausuarios: [],
  itemSelect: null,
  setItemSelect: (p) => set({ itemSelect: p }),
  mostrarusuarios: async (p) => {
    console.log("🏁 Ejecutando mostrarusuarios con:", p.id_auth);
    try {
      const { data, error } = await supabase
        .from(tabla)
        .select(`*, roles(*)`)
        .eq("id_auth", p.id_auth)
        .maybeSingle();

      console.log("📥 Resultado Supabase:", data);

      if (error) {
        console.error("💥 Supabase error en MostrarUsuarios:", error);
        throw new Error(error.message);
      }

      set({ datausuarios: data });
      return data;
    } catch (err) {
      console.error("🔥 ERROR inesperado:", err);
      throw err;
    }
  },
  eliminarUsuarioAsignado: async (p) => {
    await EliminarUsuarioAsignado(p);
  },
  insertarUsuario: async (p) => {
    const selectModules = usePermisosStore.getState().selectedModules || [];
    console.log("Módulos seleccionados:", selectModules);
    const data = await InsertarCredencialesUser({
      email: p.email,
      pass: p.pass,
    });
    const dataUserNew = await InsertarUsuarios({
      nombres: p.nombres,
      nro_doc: p.nro_doc,
      telefono: p.telefono,
      id_rol: p.id_rol,
      correo: p.email,
      id_auth: data,
    });
    await InsertarAsignacionCajaSucursal({
      id_sucursal: p.id_sucursal,
      id_usuario: dataUserNew?.id,
      id_caja: p.id_caja,
    });

    if (Array.isArray(selectModules) && selectModules.length > 0) {
      selectModules.forEach(async (idModule) => {
        let p = {
          id_usuario: dataUserNew?.id,
          idmodulo: idModule,
        };
        await InsertarPermisos(p);
      });
    } else {
      throw new Error("No hay módulos seleccionados");
    }
  },
  editarUsuarios: async (p) => {
    await EditarUsuarios(p);
  },
  editarThemeUser: async (p) => {
    const { error } = await supabase.from(tabla).update(p).eq("id", p.id);
    if (error) {
      throw new Error(error.message);
    }
  },
}));
