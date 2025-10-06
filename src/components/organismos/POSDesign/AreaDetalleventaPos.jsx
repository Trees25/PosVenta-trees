import styled from "styled-components";

import { blur_in } from "../../../styles/keyframes";
import { FormatearNumeroDinero } from "../../../utils/Conversiones";
import {
  Btn1,
  InputText2,
  Lottieanimacion,
 
  useDetalleVentasStore,
  useEmpresaStore,
  useVentasStore,
} from "../../../index";
import animacionvacio from "../../../assets/vacioanimacion.json";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import { Device } from "../../../styles/breakpoints";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
export function AreaDetalleventaPos() {

  const { dataempresa } = useEmpresaStore();
  const [editIndex, setEditIndex] = useState(null);
  const [newCantidad, setNewCantidad] = useState(1);
  const { mostrardetalleventa, editarCantidadDetalleVenta,eliminardetalleventa } =
    useDetalleVentasStore();
    const queryClient = useQueryClient()
  const { idventa } = useVentasStore();
  const EditarCantidadDv = async (data) => {
    const p = {
      _id: data.id,
      _cantidad: data.cantidad,
    };
    await editarCantidadDetalleVenta(p);
  };
  const {mutate:mutateEditarCantidadDV} = useMutation({
    mutationKey: ["editar cantidad detalle venta"],
    mutationFn: EditarCantidadDv,
    onError:(error)=>{
      toast.error(`Error: ${error.message}`)
    },
    onSuccess:()=>{
      queryClient.invalidateQueries(["mostrar detalle venta"])
    }
  });
  const EliminarDV =async(p) =>{
    await eliminardetalleventa({id:p.id})
  }
  const {mutate:mutateEliminarDV} = useMutation({
    mutationKey: ["editar cantidad detalle venta"],
    mutationFn: EliminarDV,
    onError:(error)=>{
      toast.error(`Error: ${error.message}`)
    },
    onSuccess:()=>{
      queryClient.invalidateQueries(["mostrar detalle venta"])
    }
  });
  const handleEditClick = (index, cantidad) => {
    setEditIndex(index);
    setNewCantidad(cantidad);
  };
  const handleInputChange = (e) => {
    const value = Math.max(0, parseFloat(e.target.value));
    setNewCantidad(value);
  };
  const handleInputBlur = (item) => {
    mutateEditarCantidadDV({id:item.id,cantidad:newCantidad})
    setEditIndex(null); // Salir del modo edición
  };
  const handleKeyDown = (e, item) => {
    if (e.key === "Enter") {
      handleInputBlur(item); // Llama a `handleInputBlur` cuando se presiona Enter
    }
  };
  const { data: items } = useQuery({
    queryKey: ["mostrar detalle venta", { id_venta: idventa }],
    queryFn: () => mostrardetalleventa({ id_venta: idventa }),
  });
  return (
    <AreaDetalleventa className={items?.length > 0 ? "" : "animacion"}>
    {items?.length > 0 ? (
      items?.map((item, index) => {
        return (
          <Itemventa key={index}>
            <article className="contentdescripcion">
              <span className="descripcion">{item.descripcion}</span>
              <span className="importe">
                <strong>precio unit:</strong>
                🪵
                {FormatearNumeroDinero(
                  item.precio_venta,
                  dataempresa?.currency,
                  dataempresa?.iso
                )}
              </span>
              <ContentTotalResponsive>
                <span className="importerespo">
                  <strong>precio unit:</strong>
                  🪵
                  {FormatearNumeroDinero(
                    item.precio_venta,
                    dataempresa?.currency,
                    dataempresa?.iso
                  )}
                </span>
                <article className="contentTotaldetalleventarespon">
                  <span className="cantidad">
                    <strong>
                      {FormatearNumeroDinero(
                        item.total,
                        dataempresa?.currency,
                        dataempresa?.iso
                      )}
                    </strong>
                  </span>
                  <span
                    className="delete"
                    onClick={() => mutateEliminarDV(item)}
                  >
                    <Icon icon="weui:delete-filled" width="24" height="24" />
                  </span>
                </article>
              </ContentTotalResponsive>
            </article>
            <article className="contentbtn">
              <Btn1
                funcion={() =>
                  mutateEditarCantidadDV({
                    id: item.id,
                    cantidad: item.cantidad + 1,
                  })
                }
                width="20px"
                height="35px"
                icono={<Icon icon="mdi:add-bold" />}
              ></Btn1>
              {editIndex === index ? (
                <InputText2>
                  <input
                    type="number"
                    value={newCantidad}
                    onChange={handleInputChange}
                    onBlur={() => handleInputBlur(item)}
                    onKeyDown={(e) => handleKeyDown(e, item)}
                    className="form__field"
                    min="1"
                  />
                </InputText2>
              ) : (
                <>
                  <span className="cantidad">{item.cantidad}</span>
                  <Icon
                    icon="mdi:pencil"
                    onClick={() => handleEditClick(index, item.cantidad)}
                    className="edit-icon"
                  />
                </>
              )}

              <Btn1
                funcion={() =>
                  mutateEditarCantidadDV({
                    id: item.id,
                    cantidad: item.cantidad - 1,
                  })
                }
                width="20px"
                height="35px"
                icono={<Icon icon="subway:subtraction-1" />}
              ></Btn1>
            </article>
            <article className="contentTotaldetalleventa">
              <span className="cantidad">
                <strong>
                  {FormatearNumeroDinero(
                    item.total,
                    dataempresa?.currency,
                    dataempresa?.iso
                  )}
                </strong>
              </span>
              <span className="delete" onClick={() => mutateEliminarDV(item)}>
                <Icon icon="weui:delete-filled" width="24" height="24" />
              </span>
            </article>
          </Itemventa>
        );
      })
    ) : (
      <Lottieanimacion animacion={animacionvacio} alto="200" ancho="200" />
    )}
  </AreaDetalleventa>
  );
}
const ContentTotalResponsive = styled.div`
  display: flex;
  flex-direction: flex;
  gap: 8px;
  width: 100%;
  justify-content: space-between;
  .descripcionrespon {
    font-weight: 700;
    font-size: 20px;
  }
  .importerespo {
    font-size: 15px;
    display: flex;
    width: 100%;
  }
  @media ${Device.laptop} {
    display: none;
  }
  .contentTotaldetalleventarespon {
    display: flex;
    flex-direction: row-reverse;
    justify-content: end;
    text-align: end;
    align-items: center;
gap:8px;
    width: 100%;
    .delete {
      cursor: pointer;
      width: 20px;
      align-self: center;
    }
  }
`;
const AreaDetalleventa = styled.section`
  display: flex;
  width: 100%;
  margin-top: 10px;
  flex-direction: column;
  gap: 10px;
  max-height:calc(100vh - 500px);
  overflow-y: auto; /* Activa el scroll solo en Y */
  overflow-x: hidden; /* Oculta el scroll en X */
      
  &::-webkit-scrollbar {
  width: 12px;
  background: rgba(24, 24, 24, 0.2);
}

&::-webkit-scrollbar-thumb {
  background: rgba(148, 148, 148, 0.9);
  border-radius: 10px;
  filter: blur(10px);
}

  &.animacion {
    height: 100%;
    justify-content: center;
  }
  @media ${Device.laptop} {
    max-height:initial;
  }
`;
const Itemventa = styled.section`
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-bottom: 1px dashed ${({ theme }) => theme.color2};
  animation: ${blur_in} 0.2s linear both;
  flex-direction: column;
  gap: 10px;
  .contentdescripcion {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    .descripcion {
      font-weight: 700;
      font-size: 20px;
    }
    .importe {
      font-size: 15px;
      display: none;
      @media ${Device.laptop} {
        display: block;
      }
    }
  }
  .contentbtn {
    display: flex;
    width: 100%;
    height: 100%;
    gap: 10px;
    align-items: center;
    justify-content: center;
    .cantidad {
      font-size: 1.8rem;
      font-weight: 700;
    }
    .edit-icon {
      cursor: pointer;
      font-size: 18px;
    }
  }
  .contentTotaldetalleventa {
    display: none;
    @media ${Device.laptop} {
      display: flex;
      flex-direction: row;
      justify-content: center;
      text-align: end;
      align-items: center;
      margin-bottom: 10px;
      width: 100%;
      .delete {
        cursor: pointer;
        width: 20px;
        align-self: center;
      }
    }
  }
  @media ${Device.tablet} {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    .contentdescripcion {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
      .descripcion {
        font-weight: 700;
        font-size: 20px;
      }
      .importe {
        font-size: 15px;
      }
    }
    .contentbtn {
      display: flex;
      width: 100%;
      height: 100%;
      gap: 10px;
      align-items: center;
      justify-content: center;
      .cantidad {
        font-size: 1.8rem;
        font-weight: 700;
      }
      .edit-icon {
        cursor: pointer;
        font-size: 18px;
      }
    }
  }
`;
