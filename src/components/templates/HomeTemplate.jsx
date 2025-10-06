import styled from "styled-components";
import { Welcome } from "../../index";
import { LandingPagesWelcome } from "../organismos/LandingPages/LandingPagesWelcome";

export function HomeTemplate() {

  return (
     <LandingPagesWelcome/>
  );
}
const Container = styled.div`
  height: 100vh;
`;
