import { create } from "zustand";
import { Dark, Light } from "../styles/themes";
export const useThemeStore = create((set, get) => ({
  theme: "light",
  themeStyle: Light,
  setTheme: (p) => {
    set({ theme: p.tema});
    set({ themeStyle: p.style });
  },
}));
