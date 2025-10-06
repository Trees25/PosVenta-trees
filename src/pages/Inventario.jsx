import styled from "styled-components";
import { CrudTemplate } from "../components/templates/CrudTemplate";
import { RegistrarInventario } from "../components/organismos/formularios/RegistrarInventario";
import { TablaInventarios } from "../components/organismos/tablas/TablaInventarios";
import { useQuery } from "@tanstack/react-query";

import { useMovStockStore } from "../store/MovStockStore";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useProductosStore } from "../store/ProductosStore";
import { Title } from "../components/atomos/Title";
import { Btn1 } from "../components/moleculas/Btn1";
import { useState } from "react";
import { BuscadorList } from "../components/ui/lists/BuscadorList";
import { useGlobalStore } from "../store/GlobalStore";
export const Inventario = () => {
  const { mostrarMovStock } = useMovStockStore();
  const { dataempresa } = useEmpresaStore();
  const { buscarProductos, buscador } = useProductosStore();
  const { productosItemSelect, setBuscador, selectProductos } =
    useProductosStore();
  const [openRegistro, SetopenRegistro] = useState(false);
  const { setStateClose, setAccion, stateClose, accion } = useGlobalStore();

  const [dataSelect, setdataSelect] = useState([]);
  const [isExploding, setIsExploding] = useState(false);
  const {
    data: dataproductos,
    isLoading: isLoadingBuscarProductos,
    error,
  } = useQuery({
    queryKey: ["buscar productos", buscador],
    queryFn: () =>
      buscarProductos({
        id_empresa: dataempresa?.id,
        buscador: buscador,
      }),
    enabled: !!dataempresa,
  });

  const { data, isLoading } = useQuery({
    queryKey: [
      "mostrar movimientos de stock",
      {
        id_empresa: dataempresa?.id,
        id_producto: productosItemSelect?.id,
      },
    ],
    queryFn: () =>
      mostrarMovStock({
        id_empresa: dataempresa?.id,
        id_producto: productosItemSelect?.id,
      }),
    enabled: !!dataempresa,
  });

  function nuevoRegistro() {
    setStateClose(true);
    setAccion("Nuevo");
    setItemSelect([]);
  }
  return (
    <Container>
      {stateClose && <RegistrarInventario />}

      <section className="area1">
        {productosItemSelect?.nombre && (
          <span>
            {" "}
            Producto: {" "}<strong>{productosItemSelect?.nombre}</strong>{" "}
          </span>
        )}
|
        <Title>Inventario</Title>
        <Btn1 funcion={nuevoRegistro} titulo="Registrar" />
      </section>
      <section className="area2">
        <BuscadorList
          setBuscador={setBuscador}
          data={dataproductos}
          onSelect={selectProductos}
        />
      </section>

      <section className="main">
        <TablaInventarios
          setdataSelect={setdataSelect}
          setAccion={setAccion}
          SetopenRegistro={SetopenRegistro}
          data={data}
        />
      </section>
    </Container>
  );
};
const Container = styled.div`
  height: calc(100vh - 80px);

  margin-top: 50px;
  padding: 15px;
  display: grid;
  grid-template:
    "area1" 60px
    "area2" 60px
    "main" auto;
  .area1 {
    grid-area: area1;
    /* background-color: rgba(103, 93, 241, 0.14); */
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 15px;
  }
  .area2 {
    grid-area: area2;
    /* background-color: rgba(7, 237, 45, 0.14); */
    display: flex;
    justify-content: end;
    align-items: center;
  }
  .main {
    grid-area: main;
    /* background-color: rgba(237, 7, 221, 0.14); */
  }
`;
