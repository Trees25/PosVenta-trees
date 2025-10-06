import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import styled from "styled-components";

export const SelectList = ({
  data, 
  placeholder, 
  onSelect, 
  displayField = "nombre",itemSelect
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(itemSelect?.[displayField] || "Select an option");

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (item) => {
     setSelected(item);
    setIsOpen(false);
    onSelect(item);
  };

  return (
    <DropdownContainer>
      <DropdownHeader onClick={toggleDropdown}>
        {itemSelect?.[displayField]}
        <Arrow isOpen={isOpen}><Icon icon="iconamoon:arrow-up-2-bold" width="24" height="24" /></Arrow>
      </DropdownHeader>
      {isOpen && (
        <DropdownList>
          {data?.map((item, index) => {
            return (
              <DropdownItem
                key={index}
                onClick={() => handleSelect(item)}
                isSelected={item === selected}
              >
                {item === selected && <CheckMark>✔</CheckMark>}
                {item?.[displayField]}
              </DropdownItem>
            );
          })}
        </DropdownList>
      )}
    </DropdownContainer>
  );
};

// Estilos usando Styled Components
const DropdownContainer = styled.div`
  position: relative;
  width: ${(props) => props.width};

`;

const DropdownHeader = styled.div`
 background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  padding: 8px 15px;
  border: 1px solid #333;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap:10px;
`;

const Arrow = styled.span`
  transform: ${({ isOpen }) => (isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 0.3s ease;
`;

const DropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: ${({ theme }) => theme.body};
  border: 1px solid #333;
  border-radius: 5px;
  margin-top: 5px;
  max-height: 150px;
  overflow-y: auto;
  z-index: 1000;

  // Evita que se adapte al tamaño del header
  min-width: 200px; /* Ancho mínimo */
  width: max-content; /* Ancho según el contenido */
  max-width: 300px; /* Ancho máximo */
`;

const DropdownItem = styled.div`
  padding: 10px 15px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  background-color: ${({ isSelected }) =>
    isSelected ? ( theme ) => theme.bg : "transparent"};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.bg};
  }
`;

const CheckMark = styled.span`
  color:${({ theme }) => theme.text};
  font-size: 14px;
`;
