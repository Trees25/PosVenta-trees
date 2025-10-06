import styled from "styled-components";
import { Device } from "../../../styles/breakpoints";
import { Btn1 } from "../../moleculas/Btn1";
import { Icon } from "@iconify/react/dist/iconify.js";

import { useCierreCajaStore } from "../../../store/CierreCajaStore";
import { useVentasStore } from "../../../store/VentasStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
export function FooterPos() {
  const { eliminarVenta,idventa } = useVentasStore();
  const { setStateIngresoSalida, setTipoRegistro, setStateCierraCaja } =
  useCierreCajaStore();
  const queryClient = useQueryClient()
  const {mutate:mutateEliminarVenta,isPending} = useMutation({
    mutationKey:["eliminar venta"],
    mutationFn: ()=>{
      if(idventa>0){
       return eliminarVenta({id:idventa})
      }else{
        return Promise.reject(new Error("Sin registro de venta para eliminar"))
      }
    },
    onError:(error)=>{
      toast.error(`Error: ${error.message}`)
    },
    onSuccess:()=>{
      toast.success("Venta eliminada")
      queryClient.invalidateQueries(["mostrar detalle venta"])
    }
  })
  return (
    <Footer>
      <article className="content">
        <Btn1 disabled={isPending}
          bgcolor="#f44141"
          color="#fff"
          funcion={mutateEliminarVenta}
          icono={<Icon icon="fluent-emoji-flat:skull" />}
          titulo="Eliminar venta"
        />
        <Btn1
          bgcolor="#fff"
          color="#2d2d2d"
          funcion={()=>setStateCierraCaja(true)}
          icono={<Icon icon="emojione:card-file-box" />}
          titulo="Cerrar caja"
        />
        <Btn1
          bgcolor="#fff"
          color="#2d2d2d"
          funcion={()=>{
            setStateIngresoSalida(true)
        setTipoRegistro("ingreso")
          } }
          icono={<Icon icon="fluent-emoji:dollar-banknote" />}
          titulo="Ingresar dinero"
        />
        <Btn1
           bgcolor="#fff"
          color="#2d2d2d"
          funcion={()=>{
            setStateIngresoSalida(true)
        setTipoRegistro("salida")
          } }
          icono={<Icon icon="noto-v1:money-bag" />}
          titulo="Retirar dinero"
        />
        {/* <Btn1
          bgcolor="#fff"
          color="#2d2d2d"
          icono={<Icon icon="icon-park:preview-open" />}
          titulo="Ver ventas del día"
        /> */}
      </article>
    </Footer>
  );
}
const Footer = styled.section`
  grid-area: footer;
  /* background-color: rgba(57, 231, 26, 0.5); */
  display: none;

  @media ${Device.desktop} {
    display: flex;
  }
  .content {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;
