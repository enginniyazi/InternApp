import React from 'react';
import './InternshipCard.css';

export interface InternshipData {
  id: string;
  title: string;
  description: string;
  location: string;
  isRemote: boolean;
  requirements: string[];
  createdAt: string;
  company?: {
    companyName?: string;
    logoUrl?: string;
  };
}

interface InternshipCardProps {
  internship: InternshipData;
  isOwner?: boolean;
  onApply?: (id: string) => void;
  onEdit?: (internship: InternshipData) => void;
  onDelete?: (id: string) => void;
}

export const InternshipCard: React.FC<InternshipCardProps> = ({
  internship,
  isOwner = false,
  onApply,
  onEdit,
  onDelete,
}) => {
  const companyInitial = internship.company?.companyName
    ? internship.company.companyName.charAt(0).toUpperCase()
    : 'Ş';

  const formattedDate = new Date(internship.createdAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="internship-card">
      <div>
        <div className="card-header">
          <div className="company-info">
            <div className="company-logo-placeholder">{companyInitial}</div>
            <span className="company-name">
              {internship.company?.companyName || 'Anonim Şirket'}
            </span>
          </div>
          <div className="badge-group">
            <span className="badge badge-location">📍 {internship.location}</span>
            {internship.isRemote && <span className="badge badge-remote">🏠 Uzaktan</span>}
          </div>
        </div>

        <h3 className="card-title">{internship.title}</h3>
        <p className="card-description">{internship.description}</p>

        {internship.requirements && internship.requirements.length > 0 && (
          <div className="requirements-list">
            {internship.requirements.map((req, idx) => (
              <span key={idx} className="requirement-tag">
                #{req}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="card-footer">
        <span className="posted-date">Yayınlanma: {formattedDate}</span>

        <div className="action-btns">
          {isOwner ? (
            <>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => onEdit && onEdit(internship)}
              >
                Düzenle
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => onDelete && onDelete(internship.id)}
              >
                Sil
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn-primary"
              onClick={() => onApply && onApply(internship.id)}
            >
              Başvur
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
