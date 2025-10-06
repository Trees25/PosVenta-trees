import React from "react";
import styled from "styled-components";

export const AnimatedGrid = () => {
  return (
    <GridContainer>
      {Array.from({ length: 4 }).map((_, rowIndex) => (
        <HorizontalLine
          key={`h-line-${rowIndex}`}
          style={{ top: `${25 * (rowIndex + 1)}%` }}
        />
      ))}
      {Array.from({ length: 4 }).map((_, colIndex) => (
        <VerticalLine
          key={`v-line-${colIndex}`}
          style={{ left: `${25 * (colIndex + 1)}%` }}
        />
      ))}
    </GridContainer>
  );
};

// Styled Components
const GridContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
`;

const HorizontalLine = styled.div`
  position: absolute;
  left: 0;
  width: 0; /* Cambiado para que se anime desde 0 */
  height: 1px;
  background: transparent;
  border-top: 1px dashed rgba(255, 255, 255, 0.2);
  animation: drawHorizontalLine 2s ease-in-out forwards;
  animation-delay: calc(var(--line-index, 0) * 0.2s);

  @keyframes drawHorizontalLine {
    from {
      width: 0; /* Inicia desde 0 en las coordenadas X */
    }
    to {
      width: 100%; /* Termina cubriendo toda la anchura */
    }
  }
`;

const VerticalLine = styled.div`
  position: absolute;
  top: 0;
  height: 0; /* Cambiado para que se anime desde 0 */
  width: 1px;
  background: transparent;
  border-left: 1px dashed rgba(255, 255, 255, 0.2);
  animation: drawVerticalLine 2s ease-in-out forwards;
  animation-delay: calc(var(--line-index, 0) * 0.2s);

  @keyframes drawVerticalLine {
    from {
      height: 0; /* Inicia desde 0 en las coordenadas Y */
    }
    to {
      height: 100%; /* Termina cubriendo toda la altura */
    }
  }
`;
