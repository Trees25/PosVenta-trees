import styled from "styled-components";
import { Btn1 } from "../moleculas/Btn1";
import { slideBackground } from "../../styles/keyframes";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useImpresorasStore } from "../../store/ImpresorasStore";
import { BarLoader } from "react-spinners";
import { Switch } from "../ui/toggles/Switch";
import { SelectList } from "../ui/lists/SelectList";
import { toast, Toaster } from "sonner";
import { useAsignacionCajaSucursalStore } from "../../store/AsignacionCajaSucursalStore";
import { useState } from "react";
import ticket from "../../reports/TicketPrueba";
import {HeaderImpresoras} from "../organismos/ImpresorasDesign/HeaderImpresoras"
export const ImpresorasTemplate = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const {
    mostrarDatosPc,
    statePrintDirecto,
    setStatePrintDirecto,
    mostrarListaImpresoraLocales,
    selectImpresora,
    setSelectImpresora,
    editarImpresoras,
    mostrarImpresoraXCaja,
  } = useImpresorasStore();
  const { sucursalesItemSelectAsignadas } = useAsignacionCajaSucursalStore();
  const queryClient = useQueryClient();
  //mostrar impresoras por caja
  const {
    data: dataImpresorasPorCaja,
    isLoading: isLoadingImpresoras,
    error: errorImpresoras,
  } = useQuery({
    queryKey: [
      "mostrar impresora por caja",
      {
        id_caja: sucursalesItemSelectAsignadas?.id_caja,
      },
    ],
    queryFn: () =>
      mostrarImpresoraXCaja({
        id_caja: sucursalesItemSelectAsignadas?.id_caja,
      }),
  });
  //mostrar datos de Pc local
  const {
    data: dataPcLocal,
    isLoading: isLocadingDatosPc,
    error: errorDatosPc,
  } = useQuery({
    queryKey: ["mostrar datos de PC"],
    queryFn: mostrarDatosPc,
  });
  //mostrar las impresoras locales
  const {
    data: dataImpresorasLocales,
    isLoading: isloadingImpresorasLocales,
    error: errorImpresorasLocales,
  } = useQuery({
    queryKey: ["mostrar lista impresoras locales"],
    queryFn: mostrarListaImpresoraLocales,
    enabled: !!dataPcLocal,
  });
  //editar impresoras
  const { mutate: doEditar, isPending } = useMutation({
    mutationKey: ["editar impresoras"],
    mutationFn: editar,
    onError: (error) => {
      toast.error("Error al editar impresoras" + error.message);
    },
    onSuccess: () => {
      toast.success("Datos guardados");
      queryClient.invalidateQueries(["mostrar impresora por caja"]);
    },
  });
  async function editar() {
    const p = {
      id: dataImpresorasPorCaja?.id,
      state: statePrintDirecto,
      pc_name: dataPcLocal?.machineName,
      ip_local: dataPcLocal?.localIPs[0],
      name: selectImpresora?.name,
    };
    console.log("editar", p);
    await editarImpresoras(p);
  }
  const probarTicket = async () => {
    const response = await ticket("b64");
    // Convertir el contenido base64 en un archivo Blob
    const binaryString = atob(response.content);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: "application/pdf" });
    // Crear un archivo simulando un archivo subido
    const file = new File([blob], "GeneratedTicket.pdf", {
      type: "application/pdf",
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("printerName", selectImpresora?.name);
    const responseApi = await fetch("http://localhost:5075/api/print-ticket", {
      method: "POST",
      body: formData,
    });
    if (responseApi.ok) {
      toast.success("El PDF se envió a imprimir correctamente.");
    } else {
      const error = await responseApi.text();
      toast.error("Error al imprimir" + error);
    }
  };
  const descargarArchivo = (ruta) => {
    const link = document.createElement("a");
    link.href = ruta;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const isLoading = isLocadingDatosPc;
  const error = errorDatosPc;
  if (isLoading) {
    return <BarLoader color="#b7b7b7" />;
  }
  return (
    <Container>
      <Toaster />
      {dataPcLocal ? (
        <SubContainer>
          <HeaderImpresoras/>
          <Title>IMPRESORAS</Title>
          <ContentSwich>
            <SubTitle>Imprimir directo</SubTitle>
            <Switch
              setState={() => {
                setStatePrintDirecto();
                doEditar();
              }}
              state={statePrintDirecto}
            />
          </ContentSwich>

          <Avatar $bg="#d70e79">
            {statePrintDirecto ? (
              <>
                <Btn1 funcion={probarTicket} bgcolor={"#d70e79"} color={"#fff"} titulo={"probar"} />
                <SelectList
                  itemSelect={selectImpresora}
                  onSelect={setSelectImpresora}
                  data={dataImpresorasLocales}
                  displayField="name"
                />
                <Btn1
                  funcion={doEditar}
                  disabled={isPending}
                  bgcolor={"#fff"}
                  titulo={"Guardar"}
                />
              </>
            ) : (
              <span className="anuncio">
                {" "}
                se mostrara un cuadro de diálogo al momento de imprimir
              </span>
            )}
          </Avatar>
        </SubContainer>
      ) : (
        <SubContainer>
          <Title>IMPRESORAS</Title>
          <SubTitle>Descargue e instale el servidor</SubTitle>
          <Avatar $bg="#1424a0">
            <Btn1
              funcion={() =>
                descargarArchivo(
                  "https://drive.google.com/file/d/1v5Q632tEWx8yTlfnC4HYT6SsGKnORduw/view?usp=sharing"
                )
              }
              titulo={"descargar"}
            />
            <span className="nombre">ver tutorial</span>
          </Avatar>
          <span className="descripcion">
            servicio para imprimir directo a impresoras térmicas
          </span>
          <br></br>
          <section className="advertencia">
            <Icon className="icono" icon="meteocons:barometer" />
            <span>si ya instalo, actualice esta pagina.</span>
          </section>
        </SubContainer>
      )}
    </Container>
  );
};
const ContentSwich = styled.section`
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
`;
const Container = styled.div`
  max-width: 400px;
  height: 100vh;
  display: flex;
  align-items: center;
  margin: auto;
  position: relative;
`;
const SubContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  .advertencia {
    background-color: rgba(237, 95, 6, 0.2);
    border-radius: 10px;
    margin-top: 10px;
    margin: auto;
    height: 70px;
    display: flex;
    color: #f75510;
    width: 100%;
    align-items: center;
    .icono {
      font-size: 100px;
    }
  }
`;
const Title = styled.span`
  font-size: 44px;
  margin-bottom: 20px;
  font-weight: bold;
  position: absolute;
  top: 50px;
  right: 0;
  left: 0;
  text-align: center;
`;
const SubTitle = styled.span`
  font-size: 20px;
`;
const Avatar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  border-radius: 10px;
  height: 200px;
  flex-direction: column;
  justify-content: center;
  gap: 10px;

  .nombre {
    font-size: 30px;
    font-weight: bold;
    cursor: pointer;
  }
  .anuncio {
    text-align: center;
    font-weight: bold;
    color: #fff;
  }
  background-color: ${(props) => props.$bg};
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 120 120'%3E%3Cpolygon fill='%23000' fill-opacity='0.19' points='120 0 120 60 90 30 60 0 0 0 0 0 60 60 0 120 60 120 90 90 120 60 120 0'/%3E%3C/svg%3E");

  background-size: 60px 60px;
  animation: ${slideBackground} 10s linear infinite;
`;
