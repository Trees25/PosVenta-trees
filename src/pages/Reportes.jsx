import { useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { Btn1 } from "../components/moleculas/Btn1";

export function Reportes() {
  const [reporteSeleccionado, setReporteSeleccionado] = useState(1);
  const tiposReporte = [
    {
      id: 1,
      nombre: "Inventario valorado",
      icono: "mdi:file-document-outline",
      filtrofechas: false,
      to: "inventario_valorado",
    },
    {
      id: 2,
      nombre: "Productos con Stock Bajo",
      icono: "mdi:file-alert-outline",
      filtrofechas: false,
      to: "report_stock_bajo_minimo",
    },
    {
      id: 3,
      nombre: "Reporte de Ventas",
      icono: "mdi:file-chart-outline",
      filtrofechas: true,
      to: "report_ventas",
    },
    {
      id: 4,
      nombre: "Detalle de Ventas",
      icono: "mdi:file-table-outline",
      filtrofechas: true,
      to: "detalle-ventas",
    },
  ];

  return (
    <Contenedor>
      <div className="barra-lateral">
        <div className="titulo-barra">
          <h1>Reportes</h1>
        </div>
        <nav className="navegacion">
          {tiposReporte.map((reporte) => (
            <SidebarItem
              to={reporte.to}
              key={reporte.id}
              className={reporteSeleccionado === reporte.id ? "activo" : ""}
              onClick={() => setReporteSeleccionado(reporte)}
            >
              <span>{reporte.nombre}</span>
            </SidebarItem>
          ))}
        </nav>
      </div>

      <div className="contenido-principal">
       

        <div className="visor-pdf">{/* <Outlet /> */}</div>
      </div>
    </Contenedor>
  );
}
const SidebarItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 12px;
  cursor: pointer;
  margin: 5px 0;
  transition: all 0.3s ease-in-out;
  padding: 0 5%;
  position: relative;
  text-decoration: none;
  color: ${(props) => props.theme.text};
  height: 60px;

  &:hover {
    color: ${(props) => props.theme.colorSubtitle};
  }
  &.active {
    background: ${(props) => props.theme.bg6};
    border: 2px solid ${(props) => props.theme.bg5};
    color: ${(props) => props.theme.color1};
    font-weight: 600;
  }
`;
const Contenedor = styled.div`
  display: flex;
  height: 100vh;
  .barra-lateral {
    width: 16rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    border-right: 1px solid ${({ theme }) => theme.color2};
    .titulo-barra {
      padding: 1rem;

      h1 {
        font-size: 1.25rem;
        font-weight: bold;
      }
    }

    .navegacion {
      padding: 0.5rem;
      button {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 0.75rem;
        border-radius: 0.5rem;
        text-align: left;
        margin-bottom: 0.25rem;
        transition: background-color 0.2s;
        background-color: ${(props) => props.theme.bgtotal};
        color: ${(props) => props.theme.text};
        border: none;
        &:hover {
          background-color: #f3f4f6;
          color: #202020;
        }

        &.activo {
          background-color: #ffffff;
          color: #202020;
          font-weight: 700;
        }

        span {
          margin-left: 0.75rem;
        }
      }
    }
  }

  .contenido-principal {
    flex: 1;
    display: flex;
    flex-direction: column;

   
  }
`;
