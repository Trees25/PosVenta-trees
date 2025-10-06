import { create } from "zustand";

import {
  MostrarPermisos,
  EliminarPermisos,
  MostrarPermisosDefault,
  InsertarPermisos,
  MostrarPermisosGlobales,
  MostrarPermisosConfiguracion,
} from "../supabase/crudPermisos";
export const usePermisosStore = create((set, get) => ({
  datapermisos: [],
  selectedModules: [],
  setSelectedModules: (p) => set({ selectedModules: p }),
  toggleModule: (moduleId) => {
    const { selectedModules, datapermisos } = get();
    let updatedModules;
    let updatedPermisos;

    if (selectedModules.includes(moduleId)) {
      // Desmarcar: remover de ambos
      updatedModules = selectedModules.filter((id) => id !== moduleId);
      updatedPermisos = datapermisos.filter((p) => p.idmodulo !== moduleId);
    } else {
      // Marcar: agregar a ambos
      updatedModules = [...selectedModules, moduleId];
      updatedPermisos = [...datapermisos, { idmodulo: moduleId }];
    }

    set({
      selectedModules: updatedModules,
      datapermisos: updatedPermisos,
    });
  },

  mostrarPermisos: async (p) => {
    const response = await MostrarPermisos(p);
    set({ datapermisos: response });
    return response;
  },
  mostrarPermisosDefault: async () => {
    const response = MostrarPermisosDefault();
    return response;
  },
  eliminarPermisos: async (p) => {
    await EliminarPermisos(p);
  },
  actualizarPermisos: async (p) => {
    // await EliminarPermisos(p)
    // await InsertarPermisos(p)
  },
  dataPermisosGlobales: null,
  mostrarPermisosGlobales: async (p) => {
    const response = await MostrarPermisosGlobales(p);
    set({ dataPermisosGlobales: response });
    return response;
  },
  dataPermisosConfiguracion: [],
  mostrarPermisosConfiguracion: async (p) => {
    const response = await MostrarPermisosConfiguracion(p);
    set({ dataPermisosConfiguracion: response });
    return response;
  },
}));
