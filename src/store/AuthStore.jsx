import { create } from "zustand";
import { supabase, MostrarUsuarios, ObtenerIdAuthSupabase } from "../index";
import { useQueryClient } from "@tanstack/react-query";

export const useAuthStore = create((set) => ({
  loginGoogle: async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  },
  cerrarSesion: async () => {
    await supabase.auth.signOut();
 
  },
  loginEmail: async (p) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: p.email,
      password: p.password,
    });
    if (error) {
      if (error.status === 400) {
        throw new Error("Correo o contraseña incorrectos");
      } else {
        throw new Error("Error al iniciar sesión: " + error.message);
      }
    }
    return data.user
  },
  crearUserYLogin:async(p)=>{
    const { data, error } = await supabase.auth.signUp({
      email: p.email,
      password: p.password,
      
    })
    return data.user
  },
  // obtenerIdAuthSupabase: async () => {
  //     const response = await ObtenerIdAuthSupabase();
  //     return response;
  //   },
}));
