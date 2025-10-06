import { numeroALetras, urlToBase64 } from "../utils/Conversiones";
import createPdf from "../utils/CreatePdf";
const TicketVenta = async (output, data) => {
  const fechaCompleta = data.dataventas?.fecha;
  const fechaObj = new Date(fechaCompleta);
  const simboloMoneda = data.dataempresa?.simbolo_moneda;
  const textoTotal = numeroALetras(
    data.dataventas?.monto_total,
    data.dataempresa?.nombre_moneda
  );
  const fecha = fechaObj.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const hora = fechaObj.toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const logoempresa = await urlToBase64(
    data.dataempresa?.logo === "-"
      ? "https://i.ibb.co/TxhZ45j7/bride.png"
      : data.dataempresa?.logo
  );
  const productTableBody = [
    [
      { text: "CÓDIGO - DESCRIPCIÓN", colSpan: 4, style: "tProductsHeader" },
      {},
      {},
      {},
    ],
    [
      { text: "CANT.", style: "tProductsHeader" },
      { text: "UM", style: "tProductsHeader", alignment: "center" },
      { text: "PRECIO", style: "tProductsHeader", alignment: "right" },
      { text: "TOTAL", style: "tProductsHeader", alignment: "right" },
    ],
    ...data.productos.flatMap((item) => [
      [
        {
          text: `${item.productos?.codigo_barras} - ${item.productos.nombre}`,
          style: "tProductsBody",
          colSpan: 4,
        },
        {},
        {},
        {},
      ],
      [
        { text: item.cantidad, style: "tProductsBody", alignment: "center" },
        { text: "unidad", style: "tProductsBody", alignment: "center" },
        {
          text: item.precio_venta,
          style: "tProductsBody",
          alignment: "right",
        },
        { text: item.total, style: "tProductsBody", alignment: "right" },
      ],
    ]),
  ];
  const formasPagoTableBody = [
    [
      {
        text: "FORMA DE PAGO:",
        style: "tTotals",
        alignment: "right",
        colSpan: 4,
        margin: [0, 4, 0, 0],
      },
      {},
      {},
      {},
    ],
    ...data.metodosPago?.flatMap((item) =>
      item.tipo === "Efectivo"
        ? [
            [
              {
                text: `${item.tipo}: ${simboloMoneda}`,
                style: "tTotals",
                colSpan: 2,
                border: [false, false, false, true],
              },
              {},
              {
                text: item.monto,
                style: "tTotals",
                colSpan: 2,
                border: [false, false, false, true],
              },
              {},
            ],
            [
              { text: " ", colSpan: 2, border: [false, false, false, false] },
              {},
              {
                text: `Vuelto: ${simboloMoneda} ${item.vuelto}`,
                style: "tProductsBody",
                colSpan: 2,
                alignment: "right",
                margin: [0, 0, 0, 0],
              },
              {},
            ],
          ]
        : [
            [
              {
                text: `${item.tipo}: ${simboloMoneda}`,
                style: "tTotals",
                colSpan: 2,
              },
              {},
              { text: item.monto, style: "tTotals", colSpan: 2 },
              {},
            ],
          ]
    ),
  ];

  const content = [
    //DATA EMPRESA
    {
      image: logoempresa, //logo
      fit: [141.73, 56.692],
      alignment: "center",
    },
    {
      text: data.dataempresa?.nombre,
      style: "header",
      margin: [0, 10, 0, 0],
    },
    {
      text: data.dataempresa?.direccion_fiscal,
      style: "header",
    },
    {
      text: data.dataempresa?.id_fiscal,
      style: "header",
    },

    //TIPO Y NUMERO DOCUMENTO
    { text: data.nombreComprobante, style: "header", margin: [0, 10, 0, 2.25] },
    {
      text: data.dataventas?.nro_comprobante,
      style: "header",
      margin: [0, 2.25, 0, 0],
    },

    //DATOS CEBECERA FACTURAR

    {
      margin: [0, 10, 0, 0],
      table: {
        widths: ["25%", "35%", "15%", "25%"],
        body: [
          [
            { text: "FECHA:", style: "tHeaderLabel" },
            { text: fecha, style: "tHeaderValue" },
            { text: "HORA:", style: "tHeaderLabel" },
            { text: hora, style: "tHeaderValue" },
          ],
          [
            { text: "CAJERO:", style: "tHeaderLabel" },
            { text: data.nombrecajero, style: "tHeaderValue", colSpan: 3 },
            {},
            {},
          ],

          //DATOS CLIENTE
          [
            {
              text: "CLIENTE: ",
              style: "tTotals",
              alignment: "left",
              colSpan: 4,
              margin: [0, 6, 0, 0],
            },
            {},
            {},
            {},
          ],
          [
            { text: "NOMBRES: ", style: "tClientLabel" },
            {
              text: data.dataCliente?.nombres || "Generico",
              style: "tClientValue",
              colSpan: 3,
            },
            {},
            {},
          ],
          [
            { text: "DOC.ID: ", style: "tClientLabel" },
            {
              text: data.dataCliente?.identificador_fiscal || "-",
              style: "tClientValue",
              colSpan: 3,
            },
            {},
            {},
          ],
          [
            { text: "DIRECC.: ", style: "tClientLabel" },
            {
              text: data.dataCliente?.direccion || "-",
              style: "tClientValue",
              colSpan: 3,
            },
            {},
            {},
          ],
        ],
      },
      layout: "noBorders",
    },
    //TABLA PRODUCTOS
    {
      margin: [0, 10, 0, 0],
      table: {
        widths: ["20%", "20%", "30%", "30%"],
        headerRows: 2,
        body: productTableBody,
      },
      layout: {
        hLineWidth: function (i, node) {
          return i == 2 ? 0.5 : 0;
        },
        vLineWidth: function (i, node) {
          return 0;
        },
        hLineColor: function () {
          return "#a9a9a9";
        },
      },
    },
    //TOTALES
    {
      margin: [0, 10, 0, 0],
      table: {
        widths: ["25%", "35%", "15%", "25%"],
        body: [
          //TOTAL
          [
            {
              text: `SUBTOTAL: ${simboloMoneda}`,
              style: "tTotals",
              colSpan: 2,
            },
            {},
            { text: data.dataventas?.sub_total, style: "tTotals", colSpan: 2 },
            {},
          ],
          [
            {
              text: `${data.dataempresa?.impuesto}: ${simboloMoneda}`,
              style: "tTotals",
              colSpan: 2,
            },
            {},
            {
              text: data.dataventas?.total_impuestos,
              style: "tTotals",
              colSpan: 2,
            },
            {},
          ],
          [
            { text: `TOTAL: ${simboloMoneda}`, style: "tTotals", colSpan: 2 },
            {},
            { text: data.dataventas.monto_total, style: "tTotals", colSpan: 2 },
            {},
          ],
          //TOTAL IMPORTE EN LETRAS
          [
            {
              text: "IMPORTE EN LETRAS:",
              style: "tTotals",
              alignment: "left",
              colSpan: 4,
              margin: [0, 4, 0, 0],
            },
            {},
            {},
            {},
          ],
          [
            {
              text: textoTotal,
              style: "tProductsBody",
              colSpan: 4,
            },
            {},
            {},
            {},
          ],
          ...formasPagoTableBody,
          //FORMAS DE PAGO
        ],
      },
      layout: "noBorders",
    },
    //NOTA DE PIE
    {
      text: data.dataempresa?.pie_pagina_ticket,
      style: "header",
      alignment: "center",
      margin: [0, 5],
    },
    //QR FACTURA
    {
      stack: [
        {
          qr: `${data.dataempresa?.id_fiscal}|${data.dataventas?.nro_comprobante}|${data.dataventas.monto_total}|${data.dataventas?.sub_total}|${data.dataventas?.total_impuestos}|${fecha}${hora}|`,
          fit: 115,
          alignment: "center",
          eccLevel: "Q",
          margin: [0, 10, 0, 3],
        },
        {
          text: "Representación impresa del comprobante original. Consulta tu comprobante aquí:",
          style: "text",
        },
        {
          text: "https://codigo369web.com/",
          link: "https://codigo369web.com/",
          style: "link",
        },
      ],
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
export default TicketVenta;
