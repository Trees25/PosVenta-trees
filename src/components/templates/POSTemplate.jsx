import styled from "styled-components";
import { Device } from "../../styles/breakpoints";
import { blur_in } from "../../styles/keyframes";
import { v } from "../../styles/variables";
import { PantallaCierreCaja } from "../organismos/POSDesign/CajaDesign/PantallaCierreCaja";
import {
  AreaDetalleventaPos,
  AreaTecladoPos,
  Btn1,
  FooterPos,
  HeaderPos,
  InputText2,
  Reloj,
  useVentasStore,
} from "../../index";
import { PantallaCobro } from "../organismos/POSDesign/PantallaCobro";
import { Toaster } from "sonner";
import { PantallaIngresoSalidaDinero } from "../organismos/POSDesign/CajaDesign/PantallaIngresoSalidaDinero";
import { useCierreCajaStore } from "../../store/CierreCajaStore";
import { MenuFlotante } from "../organismos/POSDesign/MenuFlotante";
import { SelectAlmacenModal } from "../organismos/POSDesign/SelectAlmacenModal";
import { useStockStore } from "../../store/StockStore";
import { useBuscarProductosQuery } from "../../tanstack/ProductosStack";
import { useMostrarAlmacenesXSucursalQuery } from "../../tanstack/AlmacenesStack";
import { useMostrarStockXAlmacenesYProductoQuery } from "../../tanstack/StockStack";
import { useMostrarMetodosPagoQuery } from "../../tanstack/MetodosPagoStack";
import { useMostrarSerializacionesVentasQuery } from "../../tanstack/SerializacionStack";
import { useMostrasrImpresorasPorCajaQuery } from "../../tanstack/ImpresorasStack";
export function POSTemplate() {
  const { statePantallaCobro } = useVentasStore();
  const { stateIngresoSalida, stateCierreCaja } = useCierreCajaStore();
  const { stateModal } = useStockStore();
  useBuscarProductosQuery();
  const { isLoading: isLoadingAlmacenXSucursal } =
    useMostrarAlmacenesXSucursalQuery();
  const { isLoading: isLoadingStockPorProductoYAlmacen } =
    useMostrarStockXAlmacenesYProductoQuery();
   
    const {isLoading: isLoadingSerializacionesVentas} = useMostrarSerializacionesVentasQuery()
    const {isLoading:isLoadingImpresoras} = useMostrasrImpresorasPorCajaQuery()
  return (
    <Container>
      {stateModal && <SelectAlmacenModal />}

      {statePantallaCobro && <PantallaCobro />}

      <HeaderPos />
      <Main>
        <Toaster position="top-center" />
        <AreaDetalleventaPos />
        <AreaTecladoPos />
      </Main>
      <FooterPos />
      <MenuFlotante />
      {stateIngresoSalida && <PantallaIngresoSalidaDinero />}
      {stateCierreCaja && <PantallaCierreCaja />}
    </Container>
  );
}
const Container = styled.div`
  height: calc(100vh - 60px);
  padding: 10px;
  padding-top: 50px;
  display: grid;
  gap: 10px;
  grid-template:
    "header" 220px
    "main" auto;

  animation: ${blur_in} 0.5s linear both;
  @media ${Device.desktop} {
    grid-template:
      "header header" 140px
      "main main"
      "footer footer" 60px;
  }
`;

const Main = styled.div`
  grid-area: main;
  /* background-color: rgba(228, 20, 20, 0.5); */
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  overflow: hidden;
  gap: 10px;

  @media ${Device.desktop} {
    flex-direction: row;
  }
`;
