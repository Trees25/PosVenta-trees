import styled, { ThemeProvider } from "styled-components";
import {
  AuthContextProvider,
  Dark,
  GlobalStyles,
  Light,
  MyRoutes,
  useThemeStore,
  useUsuariosStore,
} from "./index";
import { Device } from "./styles/breakpoints";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  const { setTheme } = useThemeStore();
  const { datausuarios } = useUsuariosStore();
  const location = useLocation();
  const themeStyle = datausuarios?.tema ==="light"?Light:Dark
  useEffect(() => {
    if (location.pathname === "/login") {
      setTheme({
        tema: "light",
        style: Light,
      });
    } else {
      if (datausuarios) {
        const themeStyle = datausuarios?.tema === "light" ? Light : Dark;
        setTheme({
          tema: datausuarios?.tema,
          style: themeStyle,
        });
      }
    }
  }, [datausuarios]);
  return (
    <ThemeProvider theme={themeStyle}>
      <AuthContextProvider>
        <GlobalStyles />
        <MyRoutes />

        <ReactQueryDevtools initialIsOpen={true} />
      </AuthContextProvider>
    </ThemeProvider>
  );
}

export default App;
