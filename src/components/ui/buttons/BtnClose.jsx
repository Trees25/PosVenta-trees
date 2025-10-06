import { Icon } from "@iconify/react/dist/iconify.js";
import styled from "styled-components";
export function BtnClose({funcion}) {
  return (
    <Container onClick={funcion}>
      <Icon icon="ep:close-bold" />
    </Container>
  );
}
const Container = styled.div`
position: absolute;
right:25px;
top:15px;
font-size:35px;
cursor: pointer;
z-index:100;
`;
