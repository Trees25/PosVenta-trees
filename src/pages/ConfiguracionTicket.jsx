import styled from "styled-components";
import { Btn1 } from "../components/moleculas/Btn1";
import { ImageSelector } from "../hooks/useImageSelector";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useForm } from "react-hook-form";

import { Toaster } from "sonner";

import { useGlobalStore } from "../store/GlobalStore";
import { useUpdateEmpresaTicketMutation } from "../tanstack/EmpresaStack";
import { SpinnerSecundario } from "../components/moleculas/SpinnerSecundario";

export const ConfiguracionTicket = () => {
  const { dataempresa } = useEmpresaStore();
  const { fileUrl } = useGlobalStore();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      nombre: dataempresa?.nombre,
      id_fiscal: dataempresa?.id_fiscal,
      direccion_fiscal: dataempresa?.direccion_fiscal,
      nombre_moneda: dataempresa?.nombre_moneda,
      pie_pagina_ticket: dataempresa?.pie_pagina_ticket,
    },
  });
  const { mutate, isPending } = useUpdateEmpresaTicketMutation();

  return (
    <Container>
      <Toaster position="top-right" />
      {isPending ? (
        <SpinnerSecundario texto={"guardando..."} />
      ) : (
        <div className="left-section">
          <Contentguia>
            <span className="title">TICKET</span>
            <span className="format-title">
              puedes modificar detalles de tu ticket
            </span>
            {/* <Btn1 bgcolor={"#fad43c"} titulo={"Guardar"} /> */}
          </Contentguia>

          <ImageSelector fileUrl={fileUrl || dataempresa?.logo} />
          <form className="receipt-content" onSubmit={handleSubmit(mutate)}>
            <Btn1 bgcolor={"#fad43c"} titulo={"Guardar"} />
            <br></br>

            <div className="company-info">
              <div className="company-name">
                <input
                  type="text"
                  placeholder="Ingrese el nombre de la empresa"
                  {...register("nombre", {
                    required: "Campo requerido",
                  })}
                />
                {errors.nombre && <p>{errors.nombre.message}</p>}
                <div className="tech-label">
                  <span>NombreEmpresa</span>
                  <span className="tech-type">(input)</span>
                </div>
                <div className="connector-line" />
              </div>

              <div className="company-details">
                <input
                  type="text"
                  placeholder="Ingrese el RUC"
                  {...register("id_fiscal", {
                    required: "Campo requerido",
                  })}
                />
                {errors.id_fiscal && <p>{errors.id_fiscal.message}</p>}
                <div className="tech-label">
                  <span>RUC</span>
                  <span className="tech-type">(input)</span>
                </div>
                <div className="connector-line" />
              </div>

              <div className="company-details">
                <input
                  type="text"
                  placeholder="Ingrese la dirección fiscal"
                  {...register("direccion_fiscal", {
                    required: "Campo requerido",
                  })}
                />
                {errors.direccion_fiscal && (
                  <p>{errors.direccion_fiscal.message}</p>
                )}
                <div className="tech-label">
                  <span>Dirección</span>
                  <span className="tech-type">(input)</span>
                </div>
                <div className="connector-line" />
              </div>
            </div>

            <div className="ticket-number">
              TICKET - T0001
              <div className="tech-label">
                <span>Ticket</span>
                <span className="tech-type">(id)</span>
              </div>
              <div className="connector-line" />
            </div>

            <div className="divider"></div>

            <div className="details-section">
              <div className="details-row">
                <div className="details-label">Cajero</div>
                <div className="details-colon">:</div>
                <div className="details-value">Nombre del Cajero</div>
                <div className="tech-label">
                  <span>Cajero</span>
                  <span className="tech-type">(text)</span>
                </div>
                <div className="connector-line" />
              </div>

              <div className="details-row">
                <div className="details-label">Fecha Emisión</div>
                <div className="details-colon">:</div>
                <div className="details-value">19/02/2018</div>
                <div className="tech-label">
                  <span>Fecha</span>
                  <span className="tech-type">(date)</span>
                </div>
                <div className="connector-line" />
              </div>

              <div className="details-row">
                <div className="details-label">Cliente</div>
                <div className="details-colon">:</div>
                <div className="details-value">NOMBRE DEL CLIENTE</div>
                <div className="tech-label">
                  <span>Cliente</span>
                  <span className="tech-type">(text)</span>
                </div>
                <div className="connector-line" />
              </div>
            </div>

            <div className="divider"></div>

            <table className="products-table">
              <thead>
                <tr>
                  <th>
                    Cant.
                    <div className="tech-label">
                      <span>Cantidad</span>
                      <span className="tech-type">(number)</span>
                    </div>
                    <div className="connector-line" />
                  </th>
                  <th>
                    Descripción
                    <div className="tech-label">
                      <span>Producto</span>
                      <span className="tech-type">(text)</span>
                    </div>
                    <div className="connector-line" />
                  </th>
                  <th>
                    Importe
                    <div className="tech-label">
                      <span>Precio</span>
                      <span className="tech-type">(currency)</span>
                    </div>
                    <div className="connector-line" />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Gaseosa Coca Cola x 1 Lt</td>
                  <td>$2600</td>
                </tr>
              </tbody>
            </table>

            <div className="summary-section">
              <div className="summary-row">
                <div>Sub Total:</div>
                <div>$26</div>
                <div className="tech-label">
                  <span>SubTotal</span>
                  <span className="tech-type">(currency)</span>
                </div>
                <div className="connector-line" />
              </div>
              <div className="summary-row">
                <div>Descuento:</div>
                <div>$0.00</div>
                <div className="tech-label">
                  <span>Descuento</span>
                  <span className="tech-type">(currency)</span>
                </div>
                <div className="connector-line" />
              </div>
              <div className="summary-row total">
                <div>TOTAL:</div>
                <div>$26</div>
                <div className="tech-label">
                  <span>Total</span>
                  <span className="tech-type">(currency)</span>
                </div>
                <div className="connector-line" />
              </div>
            </div>

            <div className="payment-info">
              <div className="son-text">
                SON: VEINTISEIS CON 50/100
                <input
                  type="text"
                  placeholder="Ingrese nombre moneda"
                  {...register("nombre_moneda", {
                    required: "Campo requerido",
                  })}
                />
                {errors.nombre_moneda && <p>{errors.nombre_moneda.message}</p>}
                <div className="tech-label">
                  <span>Moneda</span>
                  <span className="tech-type">(input)</span>
                </div>
                <div className="connector-line" />
              </div>
              <div className="payment-row">
                <div>EFECTIVO:</div>
                <div>$50</div>
                <div className="tech-label">
                  <span>Efectivo</span>
                  <span className="tech-type">(currency)</span>
                </div>
                <div className="connector-line" />
              </div>
              <div className="payment-row">
                <div>VUELTO:</div>
                <div>$14</div>
                <div className="tech-label">
                  <span>Vuelto</span>
                  <span className="tech-type">(currency)</span>
                </div>
                <div className="connector-line" />
              </div>
              <div className="payment-row">
                <div>Tipo de Pago:</div>
                <div>Efectivo</div>
                <div className="tech-label">
                  <span>TipoPago</span>
                  <span className="tech-type">(text)</span>
                </div>
                <div className="connector-line" />
              </div>
            </div>

            <div className="divider"></div>

            <div className="footer-info">
              <div className="footer-row">
                <input
                  type="text"
                  placeholder="Ingrese un pie de pagina"
                  {...register("pie_pagina_ticket", {
                    required: "Campo requerido",
                  })}
                />
                {errors.pie_pagina_ticket && (
                  <p>{errors.pie_pagina_ticket.message}</p>
                )}
                <div className="tech-label">
                  <span>Agradecimiento</span>
                  <span className="tech-type">(input)</span>
                </div>
                <div className="connector-line" />
              </div>
            </div>

            <div className="footer-stars">
              ************************************************
            </div>

            <div className="qr-code">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Codigo_QR.svg/500px-Codigo_QR.svg.png"
                alt="QR Code"
              />
              <div className="tech-label">
                <span>QR</span>
                <span className="tech-type">(image)</span>
              </div>
              <div className="connector-line" />
            </div>
          </form>
        </div>
      )}
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  position: relative;
  color: #000;
  /* background-color:red; */
  input {
    width: 90%;
    padding: 6px 10px;
    font-size: 12px;
    text-align: center;
    border: 1px solid #ffd600;
    border-radius: 4px;
    background-color: #fffde7;
    transition: all 0.3s ease;

    &:hover,
    &:focus {
      border-color: #ffc107;
      background-color: #fff9c4;
      box-shadow: 0 0 0 2px rgba(255, 214, 0, 0.1);
    }

    &:focus {
      outline: none;
    }
  }

  .left-section {
    width: 400px;
    margin: 10px;
    margin-top:20px;
    margin-bottom:20px;
    background-color: #ffffff;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    &::before,
    &::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      height: 20px;
      background-image: linear-gradient(
        to right,
        transparent 0%,
        transparent 5%,
        white 5%,
        white 10%,
        transparent 10%,
        transparent 15%,
        white 15%,
        white 20%,
        transparent 20%,
        transparent 25%,
        white 25%,
        white 30%,
        transparent 30%,
        transparent 35%,
        white 35%,
        white 40%,
        transparent 40%,
        transparent 45%,
        white 45%,
        white 50%,
        transparent 50%,
        transparent 55%,
        white 55%,
        white 60%,
        transparent 60%,
        transparent 65%,
        white 65%,
        white 70%,
        transparent 70%,
        transparent 75%,
        white 75%,
        white 80%,
        transparent 80%,
        transparent 85%,
        white 85%,
        white 90%,
        transparent 90%,
        transparent 95%,
        white 95%,
        white 100%
      );
    }

    &::before {
      top: -10px;
    }

    &::after {
      bottom: -10px;
    }
  }

  .back-button {
    position: absolute;
    top: 20px;
    left: 20px;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 10;
    align-items: center;
    display: flex;
    font-weight: 600;
  }

  .camera-icon {
    margin: 30px 0;
    position: relative;

    &:hover {
      .tech-label {
        opacity: 1;
      }

      .connector-line {
        opacity: 1;
        width: 50px;
      }
    }
  }

  .company-info {
    width: 100%;
    max-width: 600px;
    text-align: center;
    margin-bottom: 20px;
    position: relative;

    &:hover {
      .tech-label {
        opacity: 1;
      }

      .connector-line {
        opacity: 1;
        width: 50px;
      }
    }
  }

  .company-name {
    font-weight: bold;
    margin-bottom: 10px;
    position: relative;

    &:hover {
      .tech-label {
        opacity: 1;
      }

      .connector-line {
        opacity: 1;
        width: 50px;
      }
    }
  }

  .company-details {
    font-size: 12px;
    margin: 8px 0;
    position: relative;

    &:hover {
      .tech-label {
        opacity: 1;
      }

      .connector-line {
        opacity: 1;
        width: 50px;
      }
    }
  }

  .ticket-number {
    font-weight: bold;
    margin: 10px 0;
    position: relative;

    &:hover {
      .tech-label {
        opacity: 1;
      }

      .connector-line {
        opacity: 1;
        width: 50px;
      }
    }
  }

  .barcode {
    width: 100%;
    max-width: 600px;
    height: 50px;
    margin: 10px 0;
    position: relative;

    &:hover {
      .tech-label {
        opacity: 1;
      }

      .connector-line {
        opacity: 1;
        width: 50px;
      }
    }

    img {
      max-width: 100%;
      height: auto;
    }
  }

  .divider {
    width: 100%;
    max-width: 600px;
    border-top: 1px dashed #ccc;
    margin: 10px 0;
  }

  .details-section {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    position: relative;
  }

  .details-row {
    display: grid;
    grid-template-columns: 120px 20px 1fr;
    padding: 8px 0;
    border-bottom: 1px dotted #ccc;
    align-items: center;
    position: relative;

    &:hover {
      background-color: rgba(74, 108, 247, 0.05);

      .tech-label {
        opacity: 1;
      }

      .connector-line {
        opacity: 1;
        width: 50px;
      }
    }
  }

  .details-label {
    font-weight: 500;
  }

  .details-colon {
    text-align: center;
  }

  .details-value {
    color: #333;
  }

  .products-table {
    width: 100%;
    max-width: 600px;
    margin: 20px auto;
    border-collapse: separate;
    border-spacing: 0;

    th,
    td {
      padding: 10px;
      text-align: left;
      position: relative;

      &:hover {
        background-color: rgba(74, 108, 247, 0.05);

        .tech-label {
          opacity: 1;
        }

        .connector-line {
          opacity: 1;
          width: 50px;
        }
      }
    }

    th {
      font-weight: 500;
      color: #666;
      border-bottom: 1px solid #ddd;
    }

    td {
      border-bottom: 1px dotted #ccc;
    }
  }

  .summary-section {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    margin: 5px 0;
    padding: 5px 0;
    position: relative;

    &:hover {
      background-color: rgba(74, 108, 247, 0.05);

      .tech-label {
        opacity: 1;
      }

      .connector-line {
        opacity: 1;
        width: 50px;
      }
    }
  }

  .summary-row.total {
    font-weight: bold;
    color: #000;
  }

  .payment-info {
    width: 100%;
    max-width: 600px;
    font-size: 12px;
    margin: 10px auto;
  }

  .son-text {
    display: flex;
    align-items: center;
    padding: 5px 0;
    position: relative;

    &:hover {
      background-color: rgba(74, 108, 247, 0.05);

      .tech-label {
        opacity: 1;
      }

      .connector-line {
        opacity: 1;
        width: 50px;
      }
    }
  }

  .payment-row {
    display: flex;
    justify-content: space-between;
    margin: 5px 0;
    padding: 5px 0;
    position: relative;

    &:hover {
      background-color: rgba(74, 108, 247, 0.05);

      .tech-label {
        opacity: 1;
      }

      .connector-line {
        opacity: 1;
        width: 50px;
      }
    }
  }

  .footer-info {
    width: 100%;
    max-width: 600px;
    margin: 20px auto 0;
  }

  .footer-row {
    width: 100%;

    text-align: center;
    padding: 5px 0;
    margin: 2px 0;
    font-size: 12px;
    position: relative;

    &:hover {
      .tech-label {
        opacity: 1;
      }

      .connector-line {
        opacity: 1;
        width: 50px;
      }
    }

    input {
      width: 90%;
      padding: 6px 10px;
      font-size: 12px;
      text-align: center;
      border: 1px solid #ffd600;
      border-radius: 4px;
      background-color: #fffde7;
      transition: all 0.3s ease;

      &:hover,
      &:focus {
        border-color: #ffc107;
        background-color: #fff9c4;
        box-shadow: 0 0 0 2px rgba(255, 214, 0, 0.1);
      }

      &:focus {
        outline: none;
      }
    }
  }

  .footer-stars {
    width: 100%;
    max-width: 600px;
    text-align: center;
    color: #ffd700;
    margin: 10px auto;
  }

  .qr-code {
    width: 120px;
    height: 120px;
    position: relative;
    &:hover {
      .tech-label {
        opacity: 1;
      }

      .connector-line {
        opacity: 1;
      }
    }

    img {
      max-width: 100%;
      height: auto;
    }
  }

  .receipt-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Desktop tooltips */
  .tech-label {
    position: absolute;
    top: 50%;
    transform: translateY(-50%) translateX(-10px);
    left: -120px;
    background-color: #1a1a1a;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-family: "Courier New", monospace;
    font-size: 12px;
    opacity: 0;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 6px;
    pointer-events: none;
    z-index: 20;
    white-space: nowrap;
  }

  .tech-type {
    color: #ff7e33;
    font-size: 11px;
  }

  .connector-line {
    position: absolute;
    left: -70px;
    top: 50%;
    height: 2px;
    background-color: white;
    opacity: 0;
    width: 0;
    transition: all 0.3s ease;
    z-index: 19;
  }

  .help-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #1a1a1a;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 2px solid #333;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 1001;
    transition: all 0.3s ease;
  }

  .help-button:hover {
    background-color: #333;
    transform: scale(1.1);
  }

  /* Mobile tooltips */
  @media (max-width: 768px) {
    /* Add margin to all elements that have tooltips to make space */
    .company-name,
    .company-details,
    .ticket-number,
    .barcode,
    .details-row,
    .summary-row,
    .payment-row,
    .son-text,
    .footer-row,
    .qr-code,
    .camera-icon,
    th,
    td {
      margin-bottom: 30px;
    }

    /* Position tooltips below elements */
    .tech-label {
      top: 100%;
      left: 0;
      right: 0;
      width: 100%;
      margin-top: 5px;
      transform: none;
      text-align: center;
      justify-content: center;
    }

    /* Position connector lines */
    .connector-line {
      top: 100%;
      left: 50%;
      width: 2px !important;
      height: 5px;
      margin-top: 0;
    }

    /* Ensure tooltips don't overlap */
    .receipt-content {
      padding-bottom: 40px;
    }

    /* Make inputs more touch-friendly */
    input {
      padding: 10px !important;
      font-size: 16px !important;
    }
  }
`;
const Contentguia = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 10px;
  margin: 10px;
  font-size: 14px;
  width: 100%;
  border-bottom: 2px dashed #c9c9c9;

  .title {
    font-size: 40px;
    font-weight: bold;
  }
  .format-title {
    color: #878787;
    margin-bottom: 10px;
  }
`;
