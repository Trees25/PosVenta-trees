import styled from "styled-components";
import { Btn1, Buscador, Title } from "../../index";
import { v } from "../../styles/variables";
import { useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { Toaster } from "sonner";
import { BuscadorList } from "../ui/lists/BuscadorList";
import { useGlobalStore } from "../../store/GlobalStore";
export function CrudTemplate({
  FormularioRegistro,
  title,
  Tabla,
  data,
  setBuscador,
  tipoBuscador,
  dataBuscadorList,
  selectBuscadorList,
  setBuscadorList,stateBtnAdd,stateBuscador
}) {
  const {stateClose,isExploding,setItemSelect,setAccion,setIsExploding,setStateClose} = useGlobalStore() 

 
  function nuevoRegistro() {
    setStateClose(true);
    setAccion("Nuevo");
    setItemSelect([]);
    setIsExploding(false);
  }
  return (
    <Container>
      <Toaster position="top-right" />
      {stateClose && FormularioRegistro && (
        <FormularioRegistro
        />
      )}
      <section className="area1">
        <Title>{title} </Title>
        {
          stateBtnAdd &&   <Btn1
          funcion={nuevoRegistro}
          bgcolor={v.colorPrincipal}
          titulo="nuevo"
          icono={<v.iconoagregar />}
        />
        }
      
      </section>
      {
          stateBuscador &&   <section className="area2">
        
        {tipoBuscador === "list" ? (
          <BuscadorList
            data={dataBuscadorList}
            onSelect={selectBuscadorList}
            setBuscador={setBuscadorList}
          />
        ) : (
          <Buscador setBuscador={setBuscador} />
        )}
      </section>
        }
     

      <section className="main">
        {isExploding && <ConfettiExplosion />}
        {data?.length > 0 && Tabla}
      </section>
    </Container>
  );
}
const Container = styled.div`
  height: calc(100vh - 80px);

  margin-top: 50px;
  padding: 15px;
  display: grid;
  grid-template:
    "area1" 60px
    "area2" 60px
    "main" auto;
  .area1 {
    grid-area: area1;
    /* background-color: rgba(103, 93, 241, 0.14); */
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 15px;
  }
  .area2 {
    grid-area: area2;
    /* background-color: rgba(7, 237, 45, 0.14); */
    display: flex;
    justify-content: end;
    align-items: center;
  }
  .main {
    grid-area: main;
    /* background-color: rgba(237, 7, 221, 0.14); */
  }
`;
