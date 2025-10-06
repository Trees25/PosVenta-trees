import { create } from "zustand";

const initialState = {
  stateClose: false,
  itemSelect: null,
  accion: "",
  isExploding: false,
};
export const useGlobalStore = create((set) => ({
  ...initialState,
  setStateClose: (p) => {
    set({ stateClose: p });
  },
  setAccion: (p) => set({ accion: p }),
  setItemSelect: (p) => set({ itemSelect: p }),
  setIsExploding: (p) => set({ isExploding: p }),
  file: [],
  setFile: (p) => set({ file: p }),
  fileUrl: "",
  setFileUrl: (p) => set({ fileUrl: p }),
}));
