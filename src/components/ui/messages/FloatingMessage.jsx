import React from 'react';
import { createPortal } from 'react-dom';

const FloatingMessage = ({ message }) => {
  return createPortal(
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#ffc107', // Amarillo para advertencia
      color: 'black',
      padding: '15px 20px',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      zIndex: 9999,
      fontSize: '1.1em'
    }}>
      <p>{message}</p>
    </div>,
    document.body
  );
};

export default FloatingMessage;