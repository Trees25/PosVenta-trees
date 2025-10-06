import styled from "styled-components";
import { useMovStockStore } from "../../../store/MovStockStore";

export const RadioChecks = () => {
  const { setTipo, tipo } = useMovStockStore();

  return (
    <Container>
      <div className="radio-inputs">
        <label className="radio">
          <input
            type="radio"
            name="radio"
            value="ingreso"
            checked={tipo === "ingreso"}
            onChange={() => setTipo("ingreso")}
          />
          <span className="name">Ingreso</span>
        </label>

        <label className="radio">
          <input
            type="radio"
            name="radio"
            value="salida"
            checked={tipo === "salida"}
            onChange={() => setTipo("salida")}
          />
          <span className="name">Salida</span>
        </label>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .radio-inputs {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    border-radius: 0.5rem;
    background-color: #eee;
    box-sizing: border-box;
    box-shadow: 0 0 0px 1px rgba(0, 0, 0, 0.06);
    padding: 0.25rem;
    width: 300px;
    font-size: 14px;
    .radio {
      flex: 1 1 auto;
      text-align: center;
      input {
        display: none;
      }
      input:checked + .name {
        background-color: #fff;
        font-weight: 600;
      }
      .name {
        display: flex;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        border-radius: 0.5rem;
        border: none;
        padding: 0.5rem 0;
        color: rgba(51, 65, 85, 1);
        transition: all 0.15s ease-in-out;
      }
    }
  }
`;
