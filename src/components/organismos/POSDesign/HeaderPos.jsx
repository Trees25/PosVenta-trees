import styled from "styled-components";
import {
  Btn1,
  InputText2,
  ListaDesplegable,
  Reloj,
  useProductosStore,
  useVentasStore,
  useUsuariosStore,
  useEmpresaStore,
  useAlmacenesStore,
  useDetalleVentasStore,
} from "../../../index";
import { v } from "../../../styles/variables";
import { Device } from "../../../styles/breakpoints";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";

import { useFormattedDate } from "../../../hooks/useFormattedDate";
import { useCierreCajaStore } from "../../../store/CierreCajaStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SelectList } from "../../ui/lists/SelectList";
import { useStockStore } from "../../../store/StockStore";
import { useEliminarVentasIncompletasMutate } from "../../../tanstack/VentasStack";


export function HeaderPos() {
  const [stateLectora, setStateLectora] = useState(true);
  const [cantidadInput, setCantidadInput] = useState(1);
  const [stateTeclado, setStateTeclado] = useState(false);
  const [stateListaproductos, setStateListaproductos] = useState(false);
  const { setBuscador, dataProductos, selectProductos, buscador } =
    useProductosStore();
  
  const { datausuarios } = useUsuariosStore();
  const { dataStockXAlmacenesYProducto, setStateModal } = useStockStore();

  const { idventa, insertarVentas } = useVentasStore();

  const { dataempresa } = useEmpresaStore();
  const { dataCierreCaja } = useCierreCajaStore();
  const { almacenSelectItem, dataAlmacenesXsucursal, setAlmacenSelectItem } =
    useAlmacenesStore();
  const { insertarDetalleVentas } = useDetalleVentasStore();
  const queryClient = useQueryClient();

  const buscadorRef = useRef(null);
  const fechaactual = useFormattedDate();

  function focusclick() {
    buscadorRef.current.focus();
    buscadorRef.current.value.trim() === ""
      ? setStateListaproductos(false)
      : setStateListaproductos(true);
  }
  function buscar(e) {
    setBuscador(e.target.value);
    let texto = e.target.value;
    if (texto.trim() === "" || stateLectora) {
      setStateListaproductos(false);
    } else {
      setStateListaproductos(true);
    }
  }

  async function insertarventas() {
    if (idventa === 0) {
      const pventas = {
        fecha: fechaactual,
        id_usuario: datausuarios?.id,
        id_sucursal: dataCierreCaja?.caja?.id_sucursal,
        id_empresa: dataempresa?.id,
        id_cierre_caja: dataCierreCaja?.id,
      };

      const result = await insertarVentas(pventas);
      if (result?.id > 0) {
        await insertarDVentas(result?.id);
      }
    } else {
      await insertarDVentas(idventa);
    }
    setBuscador("");
    buscadorRef.current.focus();
    setCantidadInput(1);
  }
  async function insertarDVentas(idventa) {
    const productosItemSelect =
      useProductosStore.getState().productosItemSelect;
    const pDetalleVentas = {
      _id_venta: idventa,
      _cantidad: parseFloat(cantidadInput) || 1,
      _precio_venta: productosItemSelect.precio_venta,
      _descripcion: productosItemSelect.nombre,
      _id_producto: productosItemSelect.id,
      _precio_compra: productosItemSelect.precio_compra,
      _id_sucursal:  dataCierreCaja?.caja?.id_sucursal,
      _id_almacen: almacenSelectItem?.id,
    };
    console.log("pDetalleVentas", pDetalleVentas);
    await insertarDetalleVentas(pDetalleVentas);
  }
  const { mutate: mutationInsertarVentas } = useMutation({
    mutationKey: ["insertar ventas"],
    mutationFn: insertarventas,
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
      queryClient.invalidateQueries(["mostrar Stock XAlmacenes YProducto"]);
      if (dataStockXAlmacenesYProducto) {
        setStateModal(true);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mostrar detalle venta"]);
    },
  });
  //validar cantidad
  const ValidarCantidad = (e) => {
    const value = Math.max(0, parseFloat(e.target.value));
    setCantidadInput(value);
  };
  const {mutate} = useEliminarVentasIncompletasMutate();
  useEffect(() => {
    buscadorRef.current.focus();
   mutate()
  }, []);
  useEffect(() => {
    let timeout;
    const texto = buscador.trim();
    const isCodigoDeBarras = /^[0-9]{3,}$/.test(texto);
    if (isCodigoDeBarras) {
      setStateListaproductos(false);
      timeout = setTimeout(() => {
        const productoEncontrado = dataProductos?.find(
          (p) => p.codigo_barras === texto
        );
        if (productoEncontrado) {
          selectProductos(productoEncontrado);
          mutationInsertarVentas();
          setBuscador("");
        } else {
          toast.error("Producto no encontrado");
          setBuscador("");
        }
      }, 100);
    } else {
      if (texto.length > 1) {
        timeout = setTimeout(() => {
          setStateListaproductos(true);
        }, 200);
      } else {
        setStateListaproductos(false);
      }
    }
  }, [buscador]);
  return (
    <Header>
      <ContentSucursal>
      <div>
         <strong>SUCURSAL:&nbsp; </strong>{" "}
        {dataCierreCaja.caja?.sucursales?.nombre}
      </div>
      |
       <div>
       <strong>CAJA:&nbsp; </strong>{" "}
       {dataCierreCaja.caja?.descripcion}
       </div>

      </ContentSucursal>
      <section className="contentprincipal">
        <Contentuser className="area1">
          <div className="textos">
            <span className="usuario">{datausuarios?.nombres} </span>
            <span>🧊{datausuarios?.roles?.nombre} </span>
          </div>
        </Contentuser>
      
        <article className="contentfecha area3">
          <Reloj />
        </article>
      </section>
      <section className="contentbuscador">
        <article className="area1">
          <div className="contentCantidad">
            <InputText2>
              <input
                type="number"
                min="1"
                value={cantidadInput}
                onChange={ValidarCantidad}
                placeholder="cantidad..."
                className="form__field"
              />
            </InputText2>
          </div>
          <InputText2>
            <input
              value={buscador}
              ref={buscadorRef}
              onChange={buscar}
              className="form__field"
              type="search"
              placeholder="buscar..."
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" && stateListaproductos) {
                  e.preventDefault(); // Evita que el input capture el foco
                  document.querySelector("[tabindex='0'").focus(); //mandar el foco a la lista
                }
              }}
            />
            <ListaDesplegable
              funcioncrud={mutationInsertarVentas}
              top="59px"
              funcion={selectProductos}
              setState={() => setStateListaproductos(!stateListaproductos)}
              data={dataProductos}
              state={stateListaproductos}
            />
          </InputText2>
        </article>
        <article className="area2">
          
        
        </article>
      </section>
    </Header>
  );
}
const Header = styled.div`
  grid-area: header;
  /* background-color: rgba(222, 18, 130, 0.5); */
  display: flex;
  height: 100%;

  flex-direction: column;
  gap: 20px;
  @media ${Device.desktop} {
    border-bottom: 1px solid ${({ theme }) => theme.color2};
  }

  .contentprincipal {
    width: 100%;
    display: grid;
    grid-template-areas:
      "area1 area2"
      "area3 area3";

    .area1 {
      grid-area: area1;
    }
    .area2 {
      grid-area: area2;
    }
    .area3 {
      grid-area: area3;
    }
    @media ${Device.desktop} {
      display: flex;
      justify-content: space-between;
    }
    .contentlogo {
      display: flex;
      align-items: center;
      font-weight: 700;
      gap: 8px;
      img {
        width: 30px;
        object-fit: contain;
      }
    }
  }
  .contentbuscador {
    display: grid;
    grid-template:
      "area2 area2"
      "area1 area1";
    gap: 10px;
    height: 100%;
    align-items: center;
    position: relative;

    .area1 {
      grid-area: area1;
      display: flex;
      gap: 30px;
      .contentCantidad {
        width: 150px;
      }
      /* background-color: #ff00ae; */
    }
    .area2 {
      grid-area: area2;
      display: flex;
      gap: 10px;
      /* background-color: #15ff00; */
    }
    @media ${Device.desktop} {
      display: flex;
      justify-content: flex-start;
      gap: 10px;
      .area1 {
        width: 40vw;
      }
    }
  }
`;
const ContentSucursal = styled.section`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  /* background-color: red; */
  align-items: center;
  height: 45px;
  border-bottom: 1px solid ${({ theme }) => theme.color2};
  gap:8px;
`;
const Contentuser = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .contentimg {
    display: flex;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      object-fit: cover;
    }
  }
  .textos {
    display: none;

    .usuario {
      font-weight: 700;
    }
    @media ${Device.laptop} {
      display: flex;
      flex-direction: column;
    }
  }
`;
