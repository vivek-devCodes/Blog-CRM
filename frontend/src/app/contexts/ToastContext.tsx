'use client';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import Toaster, { ToastMessage, ToastType } from '../components/ui/Toaster';

interface ToastContextType {
  showToast: (message: string, options?: { type?: ToastType; title?: string; duration?: number }) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, options?: { type?: ToastType; title?: string; duration?: number }) => {
    const id = Math.random().toString(36).slice(2);
    const toast: ToastMessage = {
      id,
      message,
      type: options?.type ?? 'info',
      title: options?.title,
      duration: options?.duration ?? 3500,
    };
    setToasts((prev) => [toast, ...prev].slice(0, 5));
  }, []);

  const success = useCallback((message: string, title = 'Success') => showToast(message, { type: 'success', title }), [showToast]);
  const error = useCallback((message: string, title = 'Error') => showToast(message, { type: 'error', title }), [showToast]);
  const info = useCallback((message: string, title = 'Info') => showToast(message, { type: 'info', title }), [showToast]);
  const warning = useCallback((message: string, title = 'Warning') => showToast(message, { type: 'warning', title }), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};


