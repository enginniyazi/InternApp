import React from 'react';
import './CompanyApplicationsModal.css';

export interface ApplicantItem {
  id: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  cvUrl?: string;
  bio?: string;
  note?: string;
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
  const [expandedAppId, setExpandedAppId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '720px', width: '92%' }}>
        <div className="modal-header">
          <h3 className="modal-title">
            Gelen Başvurular: <span style={{ color: '#818cf8' }}>{internshipTitle}</span>
          </h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {applicants.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {applicants.map((app) => {
              const isExpanded = expandedAppId === app.id;

              return (
                <div
                  key={app.id}
                  className="applicant-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div className="applicant-name">{app.studentName}</div>
                      <div className="applicant-email">
                        ✉️ {app.studentEmail} {app.studentPhone && `• 📞 ${app.studentPhone}`}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {app.cvUrl ? (
                        <a
                          href={app.cvUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-secondary"
                          style={{
                            padding: '6px 12px',
                            fontSize: '13px',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: '#60a5fa',
                            borderColor: 'rgba(96, 165, 250, 0.4)',
                          }}
                        >
                          📄 CV İncele
                        </a>
                      ) : (
                        <span
                          style={{
                            fontSize: '12px',
                            color: '#94a3b8',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '4px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          CV Yüklenmemiş
                        </span>
                      )}

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

                      <button
                        type="button"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          fontSize: '13px',
                        }}
                        onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                      >
                        {isExpanded ? '▲ Gizle' : '▼ Detay'}
                      </button>
                    </div>
                  </div>

                  {/* Aday Biyografisi & Ön Yazısı (Açılır Detay) */}
                  {isExpanded && (
                    <div
                      style={{
                        background: 'rgba(0, 0, 0, 0.25)',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        fontSize: '13px',
                        color: '#cbd5e1',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      {app.bio && (
                        <div>
                          <strong style={{ color: '#e2e8f0' }}>👤 Aday Biyografisi:</strong>
                          <p style={{ margin: '4px 0 0 0', color: '#94a3b8' }}>{app.bio}</p>
                        </div>
                      )}

                      {app.note && (
                        <div>
                          <strong style={{ color: '#818cf8' }}>💬 Başvuru Ön Yazısı / Notu:</strong>
                          <p style={{ margin: '4px 0 0 0', color: '#f8fafc', fontStyle: 'italic' }}>
                            "{app.note}"
                          </p>
                        </div>
                      )}

                      {!app.bio && !app.note && (
                        <span style={{ color: '#64748b' }}>
                          Ek biyografi veya ön yazı bulunmuyor.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
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
