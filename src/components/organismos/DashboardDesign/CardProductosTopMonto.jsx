import styled from "styled-components";
import { LiveIndicator } from "../../moleculas/LiveIndicator";
import { TablaMovimientosCajaLive } from "../tablas/TablaMovimientosCajaLive";
import { useDetalleVentasStore, useEmpresaStore } from "../../..";
import { useMovCajaStore } from "../../../store/MovCajaStore";
import { useQuery } from "@tanstack/react-query";
import { BarLoader } from "react-spinners";
import { useDashboardStore } from "../../../store/DashboardStore";
import {TablaProductosTop10} from "../../organismos/tablas/TablaProductosTop10"
export const CardProductosTopMonto = () => {
  const { dataempresa } = useEmpresaStore();
  const { mostrartop10productosmasvendidosxmonto } = useDetalleVentasStore();
  const { fechaInicio, fechaFin } = useDashboardStore();
  const {data,isLoading,error} = useQuery({
    queryKey: ["mostrar top10 productos masvendidosxmonto",{
      _id_empresa: dataempresa?.id,
      _fecha_inicio: fechaInicio,
      _fecha_fin: fechaFin,
    }],
    queryFn: () => mostrartop10productosmasvendidosxmonto({
      _id_empresa: dataempresa?.id,
      _fecha_inicio: fechaInicio,
      _fecha_fin: fechaFin,
    }),
    enabled: !!dataempresa,
  });
  if(isLoading) return <BarLoader color="#6d6d6d"/>
  if(error) return <span>error...{error.message} </span>

  return (
    <Container>
      <HeaderCard>
        <Title>TOP 10 (productos por monto)</Title>
      </HeaderCard>
      {
        data && data.length > 0 ?(<TablaProductosTop10 data={data} />):(<span className="textsindata">sin data...</span> )
      }
      
    </Container>
  );
};
const Container = styled.div`
 width:100%;
 border: 2px solid ${({ theme }) => theme.bordercolorDash};
 border-radius: 20px;
 display:flex;
 flex-direction:column;
 background-color: ${({ theme }) => theme.body};
 .textsindata{
  text-align:center;
 }
`;
const HeaderCard = styled.div`
  text-align: center;
  display: flex;
  gap: 15px;
  align-items: center;
  padding-left: 20px;
`;
const Title = styled.h3`
  font-size: 25px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;
