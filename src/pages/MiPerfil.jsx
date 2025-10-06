import React from "react";
import styled from "styled-components";
import { InputText2 } from "../components/organismos/formularios/InputText2";
import { Btn1 } from "../components/moleculas/Btn1";
import { useForm } from "react-hook-form";

import { slideBackground } from "../styles/keyframes";

import { Toaster } from "sonner";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useEditarPerfilMutation } from "../tanstack/UsuariosStack";
export const MiPerfil = () => {
  const { datausuarios } = useUsuariosStore();
  const {mutate,isPending} = useEditarPerfilMutation()
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      nombres: datausuarios?.nombres || "",
      nro_doc: datausuarios?.nro_doc || "",
      telefono: datausuarios?.telefono || "",
    },
  });
  return (
    <Container>
       <Toaster position="top-right" />
      {isPending ? (
        <span>guardando...🐖</span>
      ) : (
        <>
          <Title>Mi Perfil</Title> 
          <Avatar>
            <ContentRol>
              <span>{datausuarios?.roles?.nombre} </span>
            </ContentRol>
            <span className="nombre">{datausuarios?.nombres}</span>
          </Avatar>
          <form onSubmit={handleSubmit(mutate)}>
            <Label>Nombres</Label>
            <InputText2>
              <input
                className="form__field"
                placeholder="nombres"
                type="text"
                {...register("nombres", {
                  required: true,
                })}
              />
              {errors.nombres?.type === "required" && <p>Campo requerido</p>}
            </InputText2>
            <Label>Numero Identidad</Label>
            <InputText2>
              <input
                className="form__field"
                placeholder="nro_doc"
                type="text"
                {...register("nro_doc", {
                  required: true,
                })}
              />
              {errors.nro_doc?.type === "required" && <p>Campo requerido</p>}
            </InputText2>
            <Label>Celular</Label>
            <InputText2>
              <input
                className="form__field"
                placeholder="telefono"
                type="text"
                {...register("telefono", {
                  required: true,
                })}
              />
              {errors.telefono?.type === "required" && <p>Campo requerido</p>}
            </InputText2>
            <Label>Email</Label>
            <InputText2>
              <input
                disabled="true"
                step="0.01"
                defaultValue={datausuarios?.correo}
                className="form__field"
                placeholder="correo"
                type="text"
              />
            </InputText2>
            <br></br>
            <Btn1 bgcolor="#0930bb" color="#fff" titulo="GUARDAR CAMBIOS" />
          </form>
        </>
      )}
    </Container>
  );
};
const ContentRol = styled.div`
  background-color: #391ebb;
  border: 2px solid #fff;
  border-radius: 8px;
  position: absolute;
  top: -10px;
  right: 10px;
  padding: 5px 8px;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
`;
const Container = styled.div`
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  margin: 0 auto;
  position: relative;
  p {
    color: #f75510;
    font-weight: 700;
  }
  .advertencia {
    background-color: rgba(237, 95, 6, 0.2);
    border-radius: 10px;
    padding: 10px;
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

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const Avatar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  width: 100%;
  border-radius: 10px;
  padding: 10px;
  .nombre {
    font-weight: 700;

    text-align: center;
    align-self: center;

    font-size: 25px;
    overflow: hidden; /* Para asegurarse de que el contenido adicional esté oculto */
    white-space: normal; /* Permite el salto de línea */
    word-wrap: break-word; /* Rompe las palabras largas y las envuelve a la siguiente línea */
    color: #fff !important;
  }
  background-color: #391ebb;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 120 120'%3E%3Cpolygon fill='%23000' fill-opacity='0.19' points='120 0 120 60 90 30 60 0 0 0 0 0 60 60 0 120 60 120 90 90 120 60 120 0'/%3E%3C/svg%3E");

  background-size: 60px 60px;
  animation: ${slideBackground} 10s linear infinite;
  img {
    object-fit: cover;
  }
  input {
    display: none;
  }
`;

const Label = styled.label`
  display: block;
  margin: 10px 0 5px;
`;
