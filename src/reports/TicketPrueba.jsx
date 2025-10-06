import { urlToBase64 } from "../utils/Conversiones";
import createPdf from "../utils/CreatePdf";
const TicketPrueba = async (output) => {
  const content = [
    {
      text: "PRUEBA EXITOSA",
      style: "header",
      margin: [0, 10, 0, 0],
    },
  ];

  //estilos
  const styles = {
    header: {
      fontSize: 9,
      bold: true,
      alignment: "center",
    },
    tHeaderLabel: {
      fontSize: 8,
      alignment: "right",
    },
    tHeaderValue: {
      fontSize: 8,
      bold: true,
    },
    tProductsHeader: {
      fontSize: 8.5,
      bold: true,
    },
    tProductsBody: {
      fontSize: 9,
    },
    tTotals: {
      fontSize: 9,
      bold: true,
      alignment: "right",
    },
    tClientLabel: {
      fontSize: 8,
      alignment: "right",
    },
    tClientValue: {
      fontSize: 8,
      bold: true,
    },
    text: {
      fontSize: 8,
      alignment: "center",
    },
    link: {
      fontSize: 8,
      bold: true,
      margin: [0, 0, 0, 4],
      alignment: "center",
    },
  };
  const response = await createPdf({ content, styles }, output);
  return response;
};
export default TicketPrueba;
