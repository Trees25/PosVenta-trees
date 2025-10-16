// src/context/PaymentStatusContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import DelayModal from '../components/ui/modal/DelayModal';
import FloatingMessage from '../components/ui/messages/FloatingMessage';
import { supabase } from '../supabase/supabase.config'; // Tu instancia de Supabase

const PaymentStatusContext = createContext();

export const usePaymentStatus = () => useContext(PaymentStatusContext);

export const PaymentStatusProvider = ({ children }) => {
  const [paymentStatusData, setPaymentStatusData] = useState({
    estado_pago: 'al_dia',
    dias_atraso: 0,
    link_pago_mp: null,
    fecha_proximo_vencimiento: null,
  });
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [showFloatingMessage, setShowFloatingMessage] = useState(false);
  const [isSystemSlowed, setIsSystemSlowed] = useState(false);
  const [blockedActionCallback, setBlockedActionCallback] = useState(null);

  // Obtener el ID del usuario autenticado de Supabase Auth
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setCurrentUserId(session.user.id);
        } else {
          setCurrentUserId(null); // No hay usuario logueado
          // Opcional: limpiar estados de pago o redirigir
          setPaymentStatusData({
            estado_pago: 'al_dia',
            dias_atraso: 0,
            link_pago_mp: null,
            fecha_proximo_vencimiento: null,
          });
          setShowFloatingMessage(false);
          setIsSystemSlowed(false);
        }
      }
    );

    // Obtener el usuario inicial si ya hay una sesión activa
    const getInitialUser = async () => {
      const { data: { user } = {} } = await supabase.auth.getUser(); // Desestructuración segura
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    getInitialUser();

    return () => {
      subscription?.unsubscribe(); // Usar la suscripción del listener
    };
  }, []); // El array de dependencias vacío asegura que se ejecute solo una vez al montar


  useEffect(() => {
    const fetchPaymentStatus = async () => {
      if (!currentUserId) {
        // No hay usuario logueado, no podemos buscar estado de pago
        setPaymentStatusData({
          estado_pago: 'al_dia',
          dias_atraso: 0,
          link_pago_mp: null,
          fecha_proximo_vencimiento: null,
        });
        setShowFloatingMessage(false);
        setIsSystemSlowed(false);
        return;
      }

      // **CAMBIO AQUI:** Usar supabase.auth.getSession()
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        console.warn("No session found for fetching payment status.");
        // Podrías limpiar el estado o redirigir si no hay sesión
        setPaymentStatusData({
          estado_pago: 'al_dia',
          dias_atraso: 0,
          link_pago_mp: null,
          fecha_proximo_vencimiento: null,
        });
        setShowFloatingMessage(false);
        setIsSystemSlowed(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-payment-status`,
          {
            headers: {
              'Authorization': `Bearer ${session.access_token}`, // Pasa el token del usuario
              'Content-Type': 'application/json'
            },
          }
        );
        const data = await response.json();

        if (response.ok) {
          setPaymentStatusData(data);
          const { estado_pago, dias_atraso, link_pago_mp } = data;

          // Mensaje flotante
          if ((estado_pago === 'pendiente' || estado_pago === 'vencido') && dias_atraso < 30) {
            setShowFloatingMessage(true);
          } else {
            setShowFloatingMessage(false);
          }

          // Ralentización
          if (estado_pago === 'vencido' && dias_atraso >= 30) {
            setIsSystemSlowed(true);
          } else {
            setIsSystemSlowed(false);
          }
        } else {
          console.error("Error fetching payment status:", data.error);
          // Opcional: Manejar el error de la función Edge de forma más robusta
          // por ejemplo, estableciendo un estado de error global.
        }
      } catch (error) {
        console.error("Network or parsing error fetching payment status:", error);
        // Opcional: Manejar errores de red/parsing
      }
    };

    // Fetch inicial cuando el usuario_id cambie o se monte
    fetchPaymentStatus();
    // Reajustamos el intervalo a 30 minutos (1000ms * 60s * 30min) para que no sea tan frecuente
    const intervalId = setInterval(fetchPaymentStatus, 1000 * 60 * 30);

    return () => clearInterval(intervalId);
  }, [currentUserId]); // Dependencia del ID del usuario autenticado


  const handleBlockedAction = (callback) => {
    if (isSystemSlowed) {
      setBlockedActionCallback(() => callback);
      setShowDelayModal(true);
      return true; // Indica que la acción fue bloqueada y el modal se mostró
    }
    return false; // Indica que la acción NO fue bloqueada
  };

  const handleModalClose = () => {
    setShowDelayModal(false);
    if (blockedActionCallback) {
      // Si el callback existe, significa que una acción fue bloqueada
      // Lo ejecutamos aquí para permitir que la acción continúe después de cerrar el modal
      // Esto dependerá de tu UX deseada: ¿quieres que la acción se ejecute después de ver el modal o que se impida definitivamente?
      // Por ahora, lo ejecuto. Si quieres impedirlo, elimina la siguiente línea.
      blockedActionCallback();
      setBlockedActionCallback(null);
    }
  };

  const value = {
    paymentStatusData,
    isSystemSlowed,
    handleBlockedAction,
  };

  return (
    <PaymentStatusContext.Provider value={value}>
      {children}
      {/* **CAMBIO AQUI:** Añadido document.body como segundo argumento para createPortal */}
      {showFloatingMessage && currentUserId && (
        createPortal(
          <FloatingMessage
            message={`¡Atención! Tu pago está ${paymentStatusData.estado_pago}. Por favor, abona para evitar interrupciones. Link de pago: ${paymentStatusData.link_pago_mp || 'Contacta a soporte'}`}
          />,
          document.body
        )
      )}
      {showDelayModal && currentUserId && (
        createPortal(
          <DelayModal
            onClose={handleModalClose}
            delay={7000}
            message="¡Tu suscripción ha vencido hace más de 30 días! Regulariza tu situación para continuar utilizando el sistema sin demoras."
          />,
          document.body
        )
      )}
    </PaymentStatusContext.Provider>
  );
};