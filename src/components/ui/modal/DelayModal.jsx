import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const DelayModal = ({ onClose, delay, message }) => {
  const [remainingTime, setRemainingTime] = useState(delay / 1000);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsButtonEnabled(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [delay]);

  const handleClose = () => {
    if (isButtonEnabled) {
      onClose(); // Llama a la función onClose que se le pasa desde el contexto
    }
  };

  return createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000 // Asegurar que esté por encima de todo
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
      }}>
        <h2>Atención: Pago Vencido</h2>
        <p>{message}</p>
        <p>Deberá esperar {remainingTime} segundos para continuar.</p>
        <button
          onClick={handleClose}
          disabled={!isButtonEnabled}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: isButtonEnabled ? 'pointer' : 'not-allowed',
            backgroundColor: isButtonEnabled ? '#007bff' : '#cccccc',
            color: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          Continuar
        </button>
      </div>
    </div>,
    document.body
  );
};

export default DelayModal;