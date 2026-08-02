import React from 'react';
import './Toast.css';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="toast-wrapper"
      role="region"
      aria-live="polite"
      aria-label="Sistem Bildirimleri"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item toast-${toast.type}`} role="alert">
          <span>
            {toast.type === 'success' && '✅ '}
            {toast.type === 'error' && '⚠️ '}
            {toast.type === 'info' && 'ℹ️ '}
            {toast.text}
          </span>
          <button
            type="button"
            className="toast-close"
            aria-label="Bildirimi kapat"
            onClick={() => onDismiss(toast.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
