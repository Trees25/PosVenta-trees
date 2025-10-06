import { Routes, Route, Navigate } from "react-router-dom";
import {
  Categorias,
  Configuraciones,
  Home,
  Login,
  Productos,
  ProtectedRoute,
  POS,
  Layout,
  PageNot,
  Empresa,
  ClientesProveedores,
} from "../index";
import { BasicosConfig } from "../components/organismos/EmpresaConfigDesign/BasicosConfig";
import { MonedaConfig } from "../components/organismos/EmpresaConfigDesign/MonedaConfig";
import { MetodosPago } from "../pages/MetodosPago";
import { Dashboard } from "../pages/Dashboard";
import { SucursalesCaja } from "../pages/SucursalesCaja";
import { Impresoras } from "../pages/Impresoras";
import { Usuarios } from "../pages/Usuarios";
import { Almacenes } from "../pages/Almacenes";
import { Inventario } from "../pages/Inventario";
import { ConfiguracionTicket } from "../pages/ConfiguracionTicket";
import { MiPerfil } from "../pages/MiPerfil";
import { SerializacionComprobantes } from "../pages/SerializacionComprobantes";
import { Reportes } from "../pages/Reportes";

export function MyRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <ProtectedRoute accessBy="non-authenticated">
            <Login />
          </ProtectedRoute>
        }
      />

      <Route
        path="/configuracion"
        element={
          <Layout>
            <ProtectedRoute accessBy="authenticated">
              <Configuraciones />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/miperfil"
        element={
          <Layout>
            <ProtectedRoute accessBy="authenticated">
              <MiPerfil />
            </ProtectedRoute>
          </Layout>
        }
      />
       <Route
        path="/reportes"
        element={
          <Layout>
            <ProtectedRoute accessBy="authenticated">
              <Reportes />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/inventario"
        element={
          <Layout>
            <ProtectedRoute accessBy="authenticated">
              <Inventario />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/configuracion/categorias"
        element={
          <Layout>
            <ProtectedRoute accessBy="authenticated">
              <Categorias />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/configuracion/serializacion"
        element={
          <Layout>
            <ProtectedRoute accessBy="authenticated">
              <SerializacionComprobantes />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/configuracion/ticket"
        element={
          <Layout>
            <ProtectedRoute accessBy="authenticated">
              <ConfiguracionTicket />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/configuracion/productos"
        element={
          <Layout>
            <ProtectedRoute accessBy="authenticated">
              <Productos />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/configuracion/empresa"
        element={
          <Layout>
            <ProtectedRoute accessBy="authenticated">
              <Empresa />
            </ProtectedRoute>
          </Layout>
        }
      >
        <Route index element={<Navigate to="empresabasicos" />} />
        <Route path="empresabasicos" element={<BasicosConfig />} />
        <Route path="monedaconfig" element={<MonedaConfig />} />
      </Route>
      <Route
        path="/pos"
        element={
          <Layout>
            <ProtectedRoute accessBy="authenticated">
              <POS />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route path="*" element={<PageNot />} />
      <Route
        path="/configuracion/clientes"
        element={
          <Layout>
            <ProtectedRoute accessBy="authenticated">
              <ClientesProveedores />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/configuracion/proveedores"
        element={
          <Layout>
            <ProtectedRoute accessBy="authenticated">
              <ClientesProveedores />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/configuracion/metodospago"
        element={
          <Layout>
            <ProtectedRoute accessBy="authenticated">
              <MetodosPago />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/"
        element={
          <Layout>
            <ProtectedRoute accessBy="authenticated">
              <Home />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <Layout>
            <ProtectedRoute accessBy="authenticated">
              <Dashboard />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/configuracion/sucursalcaja"
        element={
          <Layout>
            <ProtectedRoute accessBy="authenticated">
              <SucursalesCaja />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/configuracion/impresoras"
        element={
          <Layout>
            <ProtectedRoute accessBy="authenticated">
              <Impresoras />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/configuracion/usuarios"
        element={
          <Layout>
            <ProtectedRoute accessBy="authenticated">
              <Usuarios />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/configuracion/almacenes"
        element={
          <Layout>
            <ProtectedRoute accessBy="authenticated">
              <Almacenes />
            </ProtectedRoute>
          </Layout>
        }
      />
    </Routes>
  );
}
