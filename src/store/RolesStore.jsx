import { create } from "zustand";
import { MostrarRoles } from "../supabase/crudRol";

export const useRolesStore = create((set) => ({
  rolesItemSelect: [],
  dataroles: null,
  setRolesItemSelect: (p) => {
    set({ rolesItemSelect: p });
  },
  mostrarRoles: async () => {
    const response = await MostrarRoles();

    set({
      rolesItemSelect: response[0],
      dataroles: response,
    });
    return response;
  },
}));
