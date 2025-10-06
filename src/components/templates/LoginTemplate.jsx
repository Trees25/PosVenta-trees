import styled from "styled-components";
import {
  Btn1,
  Footer,
  Generarcodigo,
  InputText2,
  Linea,
  Lottieanimacion,
  Title,
  useAuthStore,
} from "../../index";
import { v } from "../../styles/variables";
import { Device } from "../../styles/breakpoints";
import animacionlottie from "../../assets/navidad.json";
import { NieveComponente } from "../organismos/NieveComponente";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
import { useState } from "react";
import { CardModos } from "../organismos/LoginDesign/CardModos";
import { VolverBtn } from "../moleculas/VolverBtn";
export function LoginTemplate() {
  const [stateModos, setStateModos] = useState(true);
  const [stateModo, setStateModo] = useState("empleado");
  const { loginGoogle, loginEmail, crearUserYLogin } = useAuthStore();

  const { register, handleSubmit } = useForm();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ["iniciar con email"],
    mutationFn: loginEmail,
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });
  const { mutate: mutateTester, isPending } = useMutation({
    mutationKey: ["iniciar con email tester"],
    mutationFn: crearUserYLogin,
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
    onSuccess: () => {
      //queryClient.invalidateQueries();
      // window.location.reload();
    },
  });
  const manejadorEmailSesionTester = () => {
    mutateTester({ email: "tester1@gmail.com", password: "123456" });
  };
  const manejadorEmailSesion = (data) => {
    mutate({ email: data.email, password: data.password });
  };
  const manejarCrearUSerTester = () => {
    const response = Generarcodigo({ id: 2 });
    const gmail = "@gmail.com";
    const correoCompleto = response.toLowerCase() + gmail;
    mutateTester({ email: correoCompleto, password: "123456" });
  };
  return (
    <Container>
      <Toaster />
      <div className="card">
        <ContentLogo>
          <img src={v.logo} />
          <span> NOMBRE - POS VENTAS</span>
        </ContentLogo>
        <Title $paddingbottom="40px">Ingresar Modo</Title>
        {stateModos && (
          <ContentModos>
            <CardModos
              title={"Super admin"}
              subtitle={"crea y gestiona tu empresa"}
              bgcolor={"#ed7323"}
              img={"https://i.ibb.co/TDXYj7r9/rey.png"}
              funcion={() => {
                setStateModo("superadmin");
                setStateModos(!stateModos);
              }}
            />
            <CardModos
              title={"Empleado"}
              subtitle={"vende y crece"}
              bgcolor={"#542a1b"}
              img={"https://i.ibb.co/ksfCmJyy/casco.png"}
              funcion={() => {
                setStateModo("empleado");
                setStateModos(!stateModos);
              }}
            />
          </ContentModos>
        )}
        {stateModo === "empleado"
          ? stateModos === false && (
              <PanelModo>
                <VolverBtn funcion={() => setStateModos(!stateModos)} />
                <span>Modo empleado</span>
                <form onSubmit={handleSubmit(manejadorEmailSesion)}>
                  <InputText2>
                    <input
                      className="form__field"
                      placeholder="email"
                      type="text"
                      {...register("email", { required: true })}
                    />
                  </InputText2>
                  <InputText2>
                    <input
                      className="form__field"
                      placeholder="contraseña"
                      type="password"
                      {...register("password", { required: true })}
                    />
                  </InputText2>
                  <Btn1
                    border="2px"
                    titulo="INGRESAR"
                    bgcolor="#1CB0F6"
                    color="255,255,255"
                    width="100%"
                  />
                </form>
              </PanelModo>
            )
          : stateModos === false && (
              <PanelModo>
                <VolverBtn funcion={() => setStateModos(!stateModos)} />
                <span>Modo super admin</span>
                <Btn1
                  disabled={isPending}
                  funcion={manejarCrearUSerTester}
                  border="2px"
                  titulo="MODO INVITADO"
                  bgcolor="#f6ce1c"
                  color="255,255,255"
                  width="100%"
                />
                <Linea>
                  <span>0</span>
                </Linea>
                <Btn1
                  border="2px"
                  funcion={loginGoogle}
                  titulo="Google"
                  bgcolor="#fff"
                  icono={<v.iconogoogle />}
                />
              </PanelModo>
            )}
      </div>
      <Footer />
    </Container>
  );
}
const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  padding: 0 10px;
  color: ${({ theme }) => theme.text};
  .card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    width: 100%;
    margin: 20px;
    @media ${Device.tablet} {
      width: 400px;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  }
`;
const ContentLogo = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px;
  span {
    font-weight: 700;
  }
  img {
    width: 10%;
  }
`;
const ContentModos = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const PanelModo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
