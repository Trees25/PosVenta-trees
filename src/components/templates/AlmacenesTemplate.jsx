import styled from "styled-components";
import { ButtonDashed } from "../ui/buttons/ButtonDashed";
import { ListSucursales } from "../organismos/SucursalesDesign/ListSucursales";
import { RegistrarSucursal } from "../organismos/formularios/RegistrarSucursal";
import { Toaster } from "sonner";
import { useSucursalesStore } from "../../store/SucursalesStore";
import { useCajasStore } from "../../store/CajasStore";
import { RegistrarCaja } from "../organismos/formularios/RegistrarCaja";
import { AnimatedGrid } from "../ui/animated/AnimatedGrid";
import { ListAlmacenes } from "../organismos/AlmacenesDesign/ListAlmacenes";
import {RegistrarAlmacen} from "../organismos/formularios/RegistrarAlmacen"
import { useAlmacenesStore } from "../../store/AlmacenesStore";
export const AlmacenesTemplate = () => {
  const { stateSucursal, setStateSucursal } = useSucursalesStore();
  const { stateAlmacen } = useAlmacenesStore();

  return (
    <Container>
      <Toaster position="top-right" />
      {stateSucursal && <RegistrarSucursal />}
      {stateAlmacen && <RegistrarAlmacen />}

      <section className="area1">
        <Header>
          <Title>Almacenes por sucursal</Title>
          <Subtitle>gestiona tus almacenes por sucursal</Subtitle>
         
        </Header>
      </section>
      <section className="area2">
        <ListAlmacenes />
      </section>
      {/* <AnimatedGrid/> */}
    </Container>
  );
};
const Container = styled.div`
  height: 100vh;
  display: grid;
  position: relative;
  grid-template:
    "area1" 300px
    "area2" auto;
  .area1 {
    grid-area: area1;
    /* background-color: rgba(7, 237, 45, 0.14); */
    display: flex;
    flex-direction: column;
  }
  .area2 {
    grid-area: area2;
    /* background-color: rgba(237, 7, 221, 0.14); */
    padding-bottom: 20px;
  }
`;
const Header = styled.div`
  margin-bottom: 20px;
  text-align: center;
  justify-content: center;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Title = styled.h3`
  font-size: 25px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;
const Subtitle = styled.p`
  font-size: 18px;
  color: #6b7280;
  margin: 5px 0 0;
`;
