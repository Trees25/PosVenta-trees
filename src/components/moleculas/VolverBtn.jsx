import { Icon } from "@iconify/react/dist/iconify.js";
import styled from "styled-components";
export function VolverBtn({funcion}) {
  return (<Container onClick={funcion}>
<Icon icon="mingcute:arrow-left-fill" className="icono"/>
<span className="texto">Volver</span>
  </Container>);
}
const Container =styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 8px;
   margin-bottom: 30px;
  .icono {
    font-size: 25px;
  }
  .texto{
    font-size: 18px;
  }
 
`