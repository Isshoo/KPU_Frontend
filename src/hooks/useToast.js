import { useState, useCallback } from 'react';

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, title, message, duration = 5000) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type,
      title,
      message,
      fadeOut: false
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => {
      const toastToRemove = prev.find(toast => toast.id === id);
      if (toastToRemove) {
        // Add fade out animation
        toastToRemove.fadeOut = true;
        return [...prev];
      }
      return prev;
    });

    // Remove from DOM after animation
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 300);
  }, []);

  const showSuccess = useCallback((title, message, duration) => {
    addToast('success', title, message, duration);
  }, [addToast]);

  const showError = useCallback((title, message, duration) => {
    addToast('error', title, message, duration);
  }, [addToast]);

  const showWarning = useCallback((title, message, duration) => {
    addToast('warning', title, message, duration);
  }, [addToast]);

  const showInfo = useCallback((title, message, duration) => {
    addToast('info', title, message, duration);
  }, [addToast]);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAllToasts
  };
};

export default useToast; 