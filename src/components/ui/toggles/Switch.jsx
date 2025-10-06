import React from 'react';
import styled from 'styled-components';

export const Switch = ({ state, setState }) => {
  return (
    <SwitchLabel>
      <ToggleInput type="checkbox" checked={state} onClick={setState} />
      <Slider />
    </SwitchLabel>
  );
};

const SwitchLabel = styled.label`
  --input-focus: #2d8cf0;
  --font-color: #323232;
  --font-color-sub: #666;
  --bg-color: #fff;
  --bg-color-alt: #666;
  --main-color: #323232;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  width: 50px;
  height: 20px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const Slider = styled.span`
  box-sizing: border-box;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  box-shadow: 4px 4px var(--main-color);
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--bg-color);
  transition: 0.3s;

  &:before {
    box-sizing: border-box;
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    border: 2px solid var(--main-color);
    border-radius: 5px;
    left: -2px;
    bottom: 2px;
    background-color: var(--bg-color);
    box-shadow: 0 3px 0 var(--main-color);
    transition: 0.3s;
  }

  ${ToggleInput}:checked + & {
    background-color: var(--input-focus);
  }

  ${ToggleInput}:checked + &:before {
    transform: translateX(30px);
  }
`;