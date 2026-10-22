/**
 * Non-Blocking Toast Notification Alert System
 * Smart Watch & Band Interactive 3D Showcase & E-Commerce Prototype
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContext = createContext(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Return fallback no-op if used outside provider to prevent crashes
    return {
      addToast: () => {},
      removeToast: () => {},
      success: () => {},
      info: () => {},
      error: () => {},
      toasts: [],
    };
  }
  return context;
}

export function Toast({
  id,
  message,
  type = 'info',
  onDismiss = () => {},
  duration = 3500,
}) {
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  const typeStyles = {
    success: 'bg-white border-emerald-200 text-slate-800 shadow-emerald-500/10',
    info: 'bg-white border-purple-200 text-slate-800 shadow-purple-500/10',
    error: 'bg-white border-rose-200 text-slate-800 shadow-rose-500/10',
  };

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-purple-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
  };

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-3 ${
        typeStyles[type] || typeStyles.info
      }`}
      data-testid={`toast-${id || 'notification'}`}
    >
      {iconMap[type] || iconMap.info}
      <div className="text-xs sm:text-sm font-semibold leading-tight text-slate-800">
        {message}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss Notification"
        className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors ml-auto"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts = [], onDismiss = () => {} }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      data-testid="toast-container"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const success = useCallback(
    (msg, duration) => addToast(msg, 'success', duration),
    [addToast]
  );
  const info = useCallback(
    (msg, duration) => addToast(msg, 'info', duration),
    [addToast]
  );
  const error = useCallback(
    (msg, duration) => addToast(msg, 'error', duration),
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        success,
        info,
        error,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export default Toast;
