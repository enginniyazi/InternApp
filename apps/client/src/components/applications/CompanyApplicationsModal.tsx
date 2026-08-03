import React, { useState } from 'react';
import './CompanyApplicationsModal.css';
import { ApplicationChatModal } from '../common/ApplicationChatModal';

export interface ApplicantItem {
  id: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  university?: string;
  department?: string;
  grade?: string;
  gpa?: number;
  skills?: string[];
  linkedinUrl?: string;
  githubUrl?: string;
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
  currentUserId?: string;
  onUpdateStatus?: (applicationId: string, status: ApplicantItem['status']) => void;
}

export const CompanyApplicationsModal: React.FC<CompanyApplicationsModalProps> = ({
  isOpen,
  onClose,
  internshipTitle,
  applicants,
  currentUserId = '',
  onUpdateStatus,
}) => {
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
  const [activeChatApp, setActiveChatApp] = useState<ApplicantItem | null>(null);

  if (!isOpen) return null;

  const getFullCvUrl = (cvUrl?: string) => {
    if (!cvUrl) return '';
    if (cvUrl.startsWith('http://') || cvUrl.startsWith('https://')) {
      return cvUrl;
    }
    const backendBase = import.meta.env.VITE_API_URL || 'https://stajapp-server.onrender.com';
    const cleanCvPath = cvUrl.startsWith('/') ? cvUrl : `/${cvUrl}`;
    return `${backendBase.replace(/\/$/, '')}${cleanCvPath}`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '750px', width: '92%' }}>
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
                      <div
                        className="applicant-email"
                        style={{ fontSize: '13px', color: '#94a3b8' }}
                      >
                        ✉️ {app.studentEmail} {app.studentPhone && `• 📞 ${app.studentPhone}`}
                      </div>
                      {(app.university || app.department) && (
                        <div style={{ fontSize: '12px', color: '#818cf8', marginTop: '2px' }}>
                          🎓 {app.university || 'Üniversite'} - {app.department || 'Bölüm'} (
                          {app.grade || 'Öğrenci'}) {app.gpa ? `• GANO: ${app.gpa}` : ''}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {app.cvUrl ? (
                        <a
                          href={getFullCvUrl(app.cvUrl)}
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
                          CV Yok
                        </span>
                      )}

                      <button
                        type="button"
                        className="btn-primary"
                        style={{ padding: '6px 12px', fontSize: '13px' }}
                        onClick={() => setActiveChatApp(app)}
                      >
                        💬 Adayla Mesajlaş
                      </button>

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

                  {/* Aday Detayları Paneli */}
                  {isExpanded && (
                    <div
                      style={{
                        background: 'rgba(0, 0, 0, 0.25)',
                        padding: '14px 16px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        fontSize: '13px',
                        color: '#cbd5e1',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {app.skills && app.skills.length > 0 && (
                        <div>
                          <strong style={{ color: '#e2e8f0' }}>🛠️ Bildiği Yetenekler:</strong>
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '6px',
                              marginTop: '4px',
                            }}
                          >
                            {app.skills.map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                style={{
                                  background: 'rgba(99, 102, 241, 0.15)',
                                  color: '#818cf8',
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                }}
                              >
                                #{skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {(app.linkedinUrl || app.githubUrl) && (
                        <div style={{ display: 'flex', gap: '16px' }}>
                          {app.linkedinUrl && (
                            <a
                              href={app.linkedinUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '12px' }}
                            >
                              🔗 LinkedIn Profili ↗
                            </a>
                          )}
                          {app.githubUrl && (
                            <a
                              href={app.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: '#c084fc', textDecoration: 'none', fontSize: '12px' }}
                            >
                              💻 GitHub / Portfolyo ↗
                            </a>
                          )}
                        </div>
                      )}

                      {app.bio && (
                        <div>
                          <strong style={{ color: '#e2e8f0' }}>👤 Biyografi:</strong>
                          <p style={{ margin: '4px 0 0 0', color: '#94a3b8' }}>{app.bio}</p>
                        </div>
                      )}

                      {app.note && (
                        <div>
                          <strong style={{ color: '#818cf8' }}>💬 Başvuru Ön Yazısı:</strong>
                          <p style={{ margin: '4px 0 0 0', color: '#f8fafc', fontStyle: 'italic' }}>
                            "{app.note}"
                          </p>
                        </div>
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

      {/* Mesajlaşma Modalı */}
      {activeChatApp && (
        <ApplicationChatModal
          applicationId={activeChatApp.id}
          title={`${internshipTitle} - ${activeChatApp.studentName}`}
          currentUserId={currentUserId}
          onClose={() => setActiveChatApp(null)}
        />
      )}
    </div>
  );
};
