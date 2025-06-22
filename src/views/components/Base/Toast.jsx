import React, { useEffect } from 'react';
import styled from 'styled-components';
import { FaCheckCircle, FaExclamationTriangle, FaTimes, FaInfoCircle } from 'react-icons/fa';

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ToastItem = styled.div`
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 400px;
  min-width: 300px;
  animation: slideIn 0.3s ease-out;
  
  &.success {
    background: #d4edda;
    color: #155724;
    border-left: 4px solid #28a745;
  }
  
  &.error {
    background: #f8d7da;
    color: #721c24;
    border-left: 4px solid #dc3545;
  }
  
  &.warning {
    background: #fff3cd;
    color: #856404;
    border-left: 4px solid #ffc107;
  }
  
  &.info {
    background: #d1ecf1;
    color: #0c5460;
    border-left: 4px solid #17a2b8;
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  &.fade-out {
    animation: slideOut 0.3s ease-in forwards;
  }
`;

const ToastIcon = styled.div`
  font-size: 20px;
  flex-shrink: 0;
`;

const ToastContent = styled.div`
  flex: 1;
  
  .toast-title {
    font-weight: 600;
    margin-bottom: 4px;
    font-size: 14px;
  }
  
  .toast-message {
    font-size: 13px;
    opacity: 0.9;
    line-height: 1.4;
  }
`;

const ToastClose = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 16px;
  opacity: 0.7;
  padding: 0;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
`;

const Toast = ({ toasts, onClose }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle />;
      case 'error':
        return <FaExclamationTriangle />;
      case 'warning':
        return <FaExclamationTriangle />;
      case 'info':
        return <FaInfoCircle />;
      default:
        return <FaInfoCircle />;
    }
  };

  return (
    <ToastContainer>
      {toasts.map((toast) => (
        <ToastItem 
          key={toast.id} 
          className={`${toast.type} ${toast.fadeOut ? 'fade-out' : ''}`}
        >
          <ToastIcon>
            {getIcon(toast.type)}
          </ToastIcon>
          <ToastContent>
            <div className="toast-title">{toast.title}</div>
            <div className="toast-message">{toast.message}</div>
          </ToastContent>
          <ToastClose onClick={() => onClose(toast.id)}>
            <FaTimes />
          </ToastClose>
        </ToastItem>
      ))}
    </ToastContainer>
  );
};

export default Toast; 