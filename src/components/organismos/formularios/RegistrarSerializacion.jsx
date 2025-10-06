import React, { useState } from "react";
import { v } from "../../../styles/variables";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { InputText, Btn1 } from "../../../index";

import { BtnClose } from "../../ui/buttons/BtnClose";
import { useGlobalStore } from "../../../store/GlobalStore";
import { useAsignacionCajaSucursalStore } from "../../../store/AsignacionCajaSucursalStore";
import { useEditarSerializacionMutation } from "../../../tanstack/SerializacionStack";


export const RegistrarSerializacion = () => {
  const { setStateClose, itemSelect } = useGlobalStore();
  const [cantidadNumeros, setCantidadNumeros] = useState(
    itemSelect?.cantidad_numeros
  );
  const {sucursalesItemSelectAsignadas} = useAsignacionCajaSucursalStore()
  const {mutate} = useEditarSerializacionMutation()
  const [correlativo, setCorrelativo] = useState(itemSelect?.correlativo);
  const [serie, setSerie] = useState(itemSelect?.serie);

  // Función para formatear el correlativo con ceros a la izquierda
  const formatearCorrelativo = (numero, longitud) => {
    return String(numero).padStart(longitud, "0");
  };

  
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      cantidad_numeros: itemSelect?.cantidad_numeros,
      correlativo: itemSelect?.correlativo,
      serie: itemSelect?.serie,
      sucursal_id: sucursalesItemSelectAsignadas?.id_sucursal,
    },
  });
  return (
    <Container>
      <section className="sub-container">
        <div className="comprobante">
          <BtnClose color={"#000"} funcion={() => setStateClose(false)} />
          <span className="title">Comprobante</span>
          <div className="tipo"> {itemSelect?.tipo_comprobantes?.nombre} </div>
          <div className="numero">
            <span>{serie}-</span>
            <span>{formatearCorrelativo(correlativo, cantidadNumeros)}</span>
          </div>
        </div>

        <form className="form" onSubmit={handleSubmit(mutate)}>
          <article>
            <InputText icono={<v.iconoflechaderecha />}>
              <input
                className="form__field"
                placeholder="Cantidad de numeros"
                type="number"
                value={cantidadNumeros}
                {...register("cantidad_numeros", {
                  required: true,
                })}
                onChange={(e) =>
                  setCantidadNumeros(Math.max(1, parseInt(e.target.value) || 1))
                }
              />
              <label className="form__label">Cantidad de numeros</label>
              {errors.cantidad_numeros?.type === "required" && (
                <p>Campo requerido</p>
              )}
            </InputText>
          </article>
          <article>
            <InputText icono={<v.iconoflechaderecha />}>
              <input
                className="form__field"
                placeholder="Correlativos"
                type="number"
                value={correlativo}
                {...register("correlativo", {
                  required: true,
                })}
                onChange={(e) =>
                  setCorrelativo(Math.max(0, parseInt(e.target.value) || 0))
                }
              />
              <label className="form__label">Correlativo</label>
              {errors.correlativo?.type === "required" && (
                <p>Campo requerido</p>
              )}
            </InputText>
          </article>

          <article>
            <InputText icono={<v.iconoflechaderecha />}>
              <input
                className="form__field"
                placeholder="Serie"
                type="text"
                value={serie}
                {...register("serie", {
                  required: true,
                })}
                onChange={(e) => setSerie(e.target.value.toUpperCase())}
              />
              <label className="form__label">Serie</label>
              {errors.correlativo?.type === "required" && (
                <p>Campo requerido</p>
              )}
            </InputText>
          </article>

          <div className="buttons">
            <Btn1 titulo={"Guardar"} bgcolor={"#fff"} />
          </div>
        </form>
      </section>
    </Container>
  );
};

/* Styled Components Anidado */
const Container = styled.div`
  transition: 0.5s;
  top: 0;
  left: 0;
  position: fixed;
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  input {
    color: ${({ theme }) => theme.text};
  }
  .sub-container {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    background: ${({ theme }) => theme.bgtotal};
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    align-items: center;
    justify-content: center;
    .form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  }
  .comprobante {
    display: flex;
    gap: 8px;
    flex-direction: column;
    align-items: center;
    background: #fff;
    padding: 15px;
    border-radius: 8px;
    width: 300px;
    text-align: center;
    position: relative;
    margin-bottom: 20px;
    .title {
      color: #000;
      font-weight: bold;
      text-transform: uppercase;
    }
    .tipo {
      background: #ea5605;

      padding: 5px 10px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
    }

    .numero {
      margin-top: 10px;
      font-size: 18px;
      font-weight: bold;
      background: white;
      padding: 5px 10px;
      border-radius: 4px;
      border: 2px solid black;

      span:first-child {
        color: red;
      }
      span:last-child {
        color: black;
      }
    }
  }

  .checkbox {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .buttons {
    display: flex;
    margin-top: 20px;
    gap: 10px;

    .guardar {
      background: #ffcc00;
      color: black;
      font-size: 14px;
      font-weight: bold;
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .volver {
      background: #777;
      color: white;
      font-size: 14px;
      font-weight: bold;
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  }
`;
