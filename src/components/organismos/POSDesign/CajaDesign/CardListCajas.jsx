import { Icon } from "@iconify/react/dist/iconify.js";
import styled from "styled-components";
import { InputText2 } from "../../formularios/InputText2";
import { Btn1 } from "../../../moleculas/Btn1";

import { useState } from "react";
import { useUsuariosStore } from "../../../../store/UsuariosStore";

import { useCierreCajaStore } from "../../../../store/CierreCajaStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useFormattedDate } from "../../../../hooks/useFormattedDate";
import { useMetodosPagoStore } from "../../../../store/MetodosPagoStore";
import { useMovCajaStore } from "../../../../store/MovCajaStore";
import { useAsignacionCajaSucursalStore } from "../../../../store/AsignacionCajaSucursalStore";
import { useCajasStore } from "../../../../store/CajasStore";
export function CardListCajas({
  title,
  subtitle,
  bgcolor,
  funcion,
  sucursal,
  state,
}) {
  const [montoEfectivo, setMontoEfectivo] = useState(0);
  const fechaActual = useFormattedDate();
  const queryClient = useQueryClient();
  const { datausuarios } = useUsuariosStore();
  const { sucursalesItemSelectAsignadas, dataSucursalesAsignadas } =
    useAsignacionCajaSucursalStore();

  const { aperturarcaja } = useCierreCajaStore();
  const { dataMetodosPago } = useMetodosPagoStore();
  const { insertarMovCaja } = useMovCajaStore();
  const {cajaSelectItem} = useCajasStore()

  const registrarMovCaja = async (p) => {
    const id_metodo_pago = dataMetodosPago
      .filter((item) => item.nombre === "Efectivo")
      .map((item) => item.id)[0];
    const pmovcaja = {
      fecha_movimiento: fechaActual,
      tipo_movimiento: "apertura",
      monto: montoEfectivo ? montoEfectivo : 0,
      id_metodo_pago: id_metodo_pago,
      descripcion: `Apertura de caja con`,
      id_usuario: datausuarios?.id,
      id_cierre_caja: p.id_cierre_caja,
    };

    await insertarMovCaja(pmovcaja);
  };
  const insertar = async () => {
    const p = {
      fechainicio: fechaActual,
      fechacierre: fechaActual,
      id_usuario: datausuarios?.id,
      id_caja: cajaSelectItem?.id_caja,
    };
    console.log("pcierrecaja",p)
    const data = await aperturarcaja(p);

    await registrarMovCaja({ id_cierre_caja: data?.id });
  };

  const mutation = useMutation({
    mutationKey: ["aperturar caja"],
    mutationFn: insertar,
    onSuccess: () => {
      toast.success("🎉 Caja aperturada correctamente!!!");
      queryClient.invalidateQueries("mostrar cierre de caja");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });
  return (
    <Container $bgcolor={bgcolor} onClick={funcion} $state={!state}>
      <article className="content-wrapper">
        <section className="badge-container">
          <span className="badge-button">
            {title} {state ? "(aperturada)" : "(libre)"}{" "}
          </span>
        </section>

        <span className="sucursal-text">Sucursal: {sucursal} </span>
        {subtitle != 0 && (
          <section className="title-section">
            <Icon
              className="subtitle"
              icon="pepicons-print:open"
              width="20"
              height="20"
            />
            <span className="label">caja aperturada por: </span>
            <span className="subtitle">{subtitle} </span>
          </section>
        )}
        {state && (
          <Btn1
            titulo="TOMAR TURNO"
           
          />
        )}

        {!state && (
          <section className="contentInputs">
            <span className="title">Aperturar caja con:</span>
            <InputText2>
              <input
                className="form__field"
                onChange={(e) => setMontoEfectivo(parseFloat(e.target.value))}
                type="number"
                placeholder="0.00"
              />
            </InputText2>
          </section>
        )}

        {!state && (
          <article className="contentbtn">
            <Btn1
              titulo="OMITIR"
              funcion={() => {
                setMontoEfectivo(0);
                mutation.mutateAsync();
              }}
            />
            <Btn1
              titulo="APERTURAR"
              color="#ffffff"
              border="2px"
              bgcolor="#0d0d0d"
              funcion={()=>mutation.mutateAsync()}
            />
          </article>
        )}
      </article>
    </Container>
  );
}
const Container = styled.section`
  transition: 0.2s;
  transition-timing-function: linear;
  cursor: pointer;
  position: relative;
  background-color: ${({ theme }) => theme.body};
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  gap: 1.25rem;
  overflow: hidden;
  border: 1px solid rgba(50, 50, 50, 0.4);

  transform: translate(0, -3px);
  &:active {
    transform: translate(0, 0);
  }

  &::before {
    content: "";
    display: flex;
    width: 60px;
    height: 60px;
    background-color: rgba(251, 251, 251, 0.25);
    position: absolute;
    border-radius: 50%;
    bottom: -15px;
    right: -15px;
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 15px;
  }
  .contentInputs {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .form__field {
    }
    .form__field:focus {
      font-weight: 700;
      border-image-slice: 1;
      border: 2px solid ${(props) => props.$bgcolor};
    }
  }
  .contentbtn {
    display: flex;
    gap: 10px;
  }
  .badge-container {
    color: ${(props) => props.$bgcolor};
    border-radius: 8px;

    display: flex;
    gap: 0.5rem;
  }

  .badge-button {
    font-weight: bold;
    text-transform: uppercase;
  }
  .sucursal-text {
    font-weight: bold;
  }
  .title-section {
    display: flex;
    gap: 4px;
    align-items: center;
    .label {
      font-size: 14px;
    }
    .subtitle {
      font-weight: 600;
      font-size: 16px;
    }
  }

  .title {
    font-weight: bold;
  }

  .emoji-container {
    position: absolute;
    right: 10px;
    display: flex;
    align-items: center;
    height: 60px;
    font-size: 2rem;
  }

  .character-image {
    height: 100%;
    position: relative;
  }
`;
