import { Icon } from "@iconify/react/dist/iconify.js";
import styled from "styled-components";

export const MessageComponent = ({text}) => {
  return (
    <Container>
      <Icon className="icono" icon="meteocons:barometer" />
      <span>
        {text}
      </span>
    </Container>
  );
};
const Container = styled.div`
  background-color: rgba(237, 95, 6, 0.2);
  border-radius: 10px;
  padding: 10px;
  display: flex;
  color: #f75510;
  align-items: center;
  .icono {
    font-size: 100px;
  }
`;
