import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import type { InternshipData } from './InternshipCard';
import './InternshipFormModal.css';

const internshipSchema = z.object({
  title: z.string().min(3, 'İlan başlığı en az 3 karakter olmalıdır.'),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalıdır.'),
  location: z.string().min(2, 'Lokasyon alanı boş bırakılamaz.'),
  isRemote: z.boolean(),
  requirements: z.array(z.string()),
});

export type InternshipFormData = z.infer<typeof internshipSchema>;

interface InternshipFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InternshipFormData) => Promise<void> | void;
  initialData?: InternshipData | null;
  isLoading?: boolean;
}

export const InternshipFormModal: React.FC<InternshipFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isRemote, setIsRemote] = useState(false);
  const [requirementsInput, setRequirementsInput] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setLocation(initialData.location);
      setIsRemote(initialData.isRemote);
      setRequirementsInput(initialData.requirements ? initialData.requirements.join(', ') : '');
    } else {
      setTitle('');
      setDescription('');
      setLocation('');
      setIsRemote(false);
      setRequirementsInput('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const reqArray = requirementsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const result = internshipSchema.safeParse({
      title,
      description,
      location,
      isRemote,
      requirements: reqArray,
    });

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    await onSubmit(result.data);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3 className="modal-title">
            {initialData ? 'Staj İlanını Düzenle' : 'Yeni Staj İlanı Oluştur'}
          </h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="modal-title">
              İlan Başlığı
            </label>
            <input
              id="modal-title"
              type="text"
              className={`form-input ${errors.title ? 'has-error' : ''}`}
              placeholder="Örn: Frontend Developer Stajyeri"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="modal-description">
              Açıklama
            </label>
            <textarea
              id="modal-description"
              className={`form-textarea ${errors.description ? 'has-error' : ''}`}
              placeholder="Staj detayları, beklentiler ve avantajlar..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="modal-location">
              Lokasyon / Şehir
            </label>
            <input
              id="modal-location"
              type="text"
              className={`form-input ${errors.location ? 'has-error' : ''}`}
              placeholder="Örn: İstanbul"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isRemote}
                onChange={(e) => setIsRemote(e.target.checked)}
              />
              Uzaktan Çalışma (Remote) İmkânı Var
            </label>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="modal-requirements">
              Gereksinimler (Virgülle ayırın)
            </label>
            <input
              id="modal-requirements"
              type="text"
              className="form-input"
              placeholder="React, TypeScript, Git, HTML/CSS"
              value={requirementsInput}
              onChange={(e) => setRequirementsInput(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isLoading}>
              İptal
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Kaydediliyor...' : 'Kaydet ve Yayınla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
