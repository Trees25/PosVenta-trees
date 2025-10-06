import styled from "styled-components";
import { v } from "../../../styles/variables";
import {
  InputText,
  Btn1,
  useSucursalesStore,
  ConvertirCapitalize,
  useEmpresaStore,
  useAlmacenesStore,
} from "../../../index";
import { useForm } from "react-hook-form";
import { BtnClose } from "../../ui/buttons/BtnClose";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCajasStore } from "../../../store/CajasStore";
export function RegistrarAlmacen() {
  const queryClient = useQueryClient();
  const {
    accion,
    almacenSelectItem,
    setStateAlmacen,
    insertarAlmacen,
    editarAlmacen,
  } = useAlmacenesStore();
  const { dataempresa } = useEmpresaStore();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const insertar = async (data) => {
    if (accion === "Editar") {
      const p = {
        id: almacenSelectItem?.id,
        nombre: ConvertirCapitalize(data.nombre),
      };
      await editarAlmacen(p);
    } else {

      const p = {
        id_sucursal: almacenSelectItem?.id,
        nombre: ConvertirCapitalize(data.nombre),
      };
      await insertarAlmacen(p);
    }
  };
  const { isPending, mutate: doInsertar } = useMutation({
    mutationKey: ["insertar almacen"],
    mutationFn: insertar,
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
    onSuccess: () => {
      toast.success("Almacen registrado correctamente");
      queryClient.invalidateQueries(["mostrar almacenes X empresa"]);
      setStateAlmacen(false);
    },
  });

  const handlesub = (data) => {
    doInsertar(data);
  };

  return (
    <Container>
      {isPending ? (
        <span>guardando...🔼</span>
      ) : (
        <div className="sub-contenedor">
          <div className="headers">
            <section>
              <h1>
                {accion == "Editar"
                  ? "Editar almacen"
                  : "Registrar nuevo almacen"}
              </h1>
            </section>

            <section>
              <BtnClose funcion={() => setStateAlmacen(false)} />
            </section>
          </div>

          <form className="formulario" onSubmit={handleSubmit(handlesub)}>
            <section className="form-subcontainer">
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    defaultValue={
                      accion === "Editar" ? almacenSelectItem?.nombre : ""
                    }
                    type="text"
                    placeholder="sucursal"
                    {...register("nombre", {
                      required: true,
                    })}
                  />
                  <label className="form__label">almacen</label>
                  {errors.nombre?.type === "required" && <p>Campo requerido</p>}
                </InputText>
              </article>

              <Btn1
                icono={<v.iconoguardar />}
                titulo="Guardar"
                bgcolor="#F9D70B"
              />
            </section>
          </form>
        </div>
      )}
    </Container>
  );
}
const Container = styled.div`
  transition: 0.5s;
  top: 0;
  left: 0;
  position: fixed;
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  .sub-contenedor {
    position: relative;
    width: 500px;
    max-width: 85%;
    border-radius: 20px;
    background: ${({ theme }) => theme.body};
    box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
    padding: 13px 36px 20px 36px;
    z-index: 100;
    max-height: 80vh;
    overflow-y: auto;

    .headers {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h1 {
        font-size: 30px;
        font-weight: 700;
        text-transform: uppercase;
      }
      span {
        font-size: 20px;
        cursor: pointer;
      }
    }
    .formulario {
      .form-subcontainer {
        gap: 20px;
        display: flex;
        flex-direction: column;
        .colorContainer {
          .colorPickerContent {
            padding-top: 15px;
            min-height: 50px;
          }
        }
      }
    }
  }
`;
