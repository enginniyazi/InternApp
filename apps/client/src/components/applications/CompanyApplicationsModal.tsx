import React from 'react';
import './CompanyApplicationsModal.css';

export interface ApplicantItem {
  id: string;
  studentName: string;
  studentEmail: string;
  cvUrl?: string;
  status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

interface CompanyApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  internshipTitle: string;
  applicants: ApplicantItem[];
  onUpdateStatus?: (applicationId: string, status: ApplicantItem['status']) => void;
}

export const CompanyApplicationsModal: React.FC<CompanyApplicationsModalProps> = ({
  isOpen,
  onClose,
  internshipTitle,
  applicants,
  onUpdateStatus,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '650px' }}>
        <div className="modal-header">
          <h3 className="modal-title">
            Başvurular: <span style={{ color: '#818cf8' }}>{internshipTitle}</span>
          </h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {applicants.length > 0 ? (
          <div>
            {applicants.map((app) => (
              <div key={app.id} className="applicant-card">
                <div>
                  <div className="applicant-name">{app.studentName}</div>
                  <div className="applicant-email">✉️ {app.studentEmail}</div>
                  {app.cvUrl && (
                    <a
                      href={app.cvUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-block',
                        marginTop: '6px',
                        fontSize: '12px',
                        color: '#60a5fa',
                        textDecoration: 'underline',
                      }}
                    >
                      📄 CV Dosyasını İncele (PDF)
                    </a>
                  )}
                </div>

                <div>
                  <select
                    className="status-select"
                    value={app.status}
                    onChange={(e) =>
                      onUpdateStatus &&
                      onUpdateStatus(app.id, e.target.value as ApplicantItem['status'])
                    }
                  >
                    <option value="PENDING">⏳ Bekliyor</option>
                    <option value="REVIEWING">🔍 İncelemede</option>
                    <option value="ACCEPTED">🎉 Kabul Et</option>
                    <option value="REJECTED">❌ Reddet</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Bu ilana henüz başvuru yapılmadı.</p>
          </div>
        )}
      </div>
    </div>
  );
};
