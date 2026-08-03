import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Evet, Devam Et',
  cancelText = 'Vazgeç',
  type = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const iconMap = {
    danger: '🗑️',
    warning: '⚠️',
    info: 'ℹ️',
  };

  const buttonColorMap = {
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#4f46e5',
  };

  return (
    <div className="detail-modal-backdrop" onClick={onCancel}>
      <div
        className="detail-modal-content"
        style={{
          maxWidth: '440px',
          padding: '24px',
          textAlign: 'center',
          animation: 'modalPop 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>{iconMap[type]}</div>
        <h3
          style={{
            margin: '0 0 8px 0',
            fontSize: '20px',
            color: 'var(--text-main)',
            fontWeight: 700,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            margin: '0 0 24px 0',
            fontSize: '14px',
            color: 'var(--text-muted)',
            lineHeight: '1.5',
          }}
        >
          {message}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
            disabled={isLoading}
            style={{ flex: 1, padding: '10px 16px', borderRadius: '10px' }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '10px',
              backgroundColor: buttonColorMap[type],
              borderColor: buttonColorMap[type],
            }}
          >
            {isLoading ? 'İşleniyor...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
