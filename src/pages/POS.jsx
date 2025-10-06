import { POSTemplate, SpinnerSecundario } from "../index";

import { PantallaAperturaCaja } from "../components/organismos/POSDesign/CajaDesign/PantallaAperturaCaja";

import { useMostrarAperturasCajaPorUsuarioQuery } from "../tanstack/CierresCajaStack";
import { useMostrarMetodosPagoQuery } from "../tanstack/MetodosPagoStack";

export function POS() {
  const {isLoading: isLoadingMetodosPago} = useMostrarMetodosPagoQuery()
  const {data:dataCierreCaja, isLoading, error } = useMostrarAperturasCajaPorUsuarioQuery();
  // Mostrar spinner mientras alguna de las consultas está cargando
  if (isLoading) {
    return <SpinnerSecundario texto="Verificando aperturas de caja" />;
  }
  // Manejar errores de la consulta de cierre de caja
  if (error) {
    return <span>Error caja: {error.message}</span>;
  }

  return dataCierreCaja ? <POSTemplate /> : <PantallaAperturaCaja />;
}
