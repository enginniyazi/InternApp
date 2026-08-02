import React, { useState } from 'react';
import type { InternshipData } from '../internships/InternshipCard';
import './StudentApplicationsList.css';

export interface ApplicationItem {
  id: string;
  internshipTitle: string;
  companyName: string;
  status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  note?: string;
  internship?: InternshipData;
}

interface StudentApplicationsListProps {
  applications: ApplicationItem[];
}

export const StudentApplicationsList: React.FC<StudentApplicationsListProps> = ({
  applications,
}) => {
  const [selectedInternship, setSelectedInternship] = useState<InternshipData | null>(null);

  const getStatusBadge = (status: ApplicationItem['status']) => {
    switch (status) {
      case 'PENDING':
        return <span className="app-status-badge status-pending">⏳ Bekliyor</span>;
      case 'REVIEWING':
        return <span className="app-status-badge status-reviewing">🔍 İncelemede</span>;
      case 'ACCEPTED':
        return <span className="app-status-badge status-accepted">🎉 Kabul Edildi</span>;
      case 'REJECTED':
        return <span className="app-status-badge status-rejected">❌ Reddedildi</span>;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="applications-container">
        <h2 className="applications-title">Başvurularım</h2>

        {applications.length > 0 ? (
          <div className="application-card-list">
            {applications.map((app) => (
              <div key={app.id} className="application-item-card">
                <div>
                  <h3 style={{ margin: '0 0 4px 0', color: '#f8fafc', fontSize: '18px' }}>
                    {app.internshipTitle}
                  </h3>
                  <span style={{ fontSize: '14px', color: '#94a3b8' }}>🏢 {app.companyName}</span>
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
                    Başvuru Tarihi: {new Date(app.createdAt).toLocaleDateString('tr-TR')}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {getStatusBadge(app.status)}
                  {app.internship && (
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '13px' }}
                      onClick={() => setSelectedInternship(app.internship || null)}
                    >
                      İlan Detayı
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>Henüz Bir Başvurunuz Bulunmuyor</h3>
            <p>İlanlar sekmesinden ilginizi çeken staj ilanlarına başvurabilirsiniz.</p>
          </div>
        )}
      </div>

      {/* Başvurulan İlanın Detay Modalı */}
      {selectedInternship && (
        <div className="modal-overlay" onClick={() => setSelectedInternship(null)}>
          <div className="modal-content detail-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedInternship.title}</h2>
                <p className="subtitle">{selectedInternship.company?.companyName || 'Şirket'}</p>
              </div>
              <button
                type="button"
                className="close-btn"
                onClick={() => setSelectedInternship(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body detail-modal-body">
              <div className="detail-grid">
                <div className="detail-box">
                  <span className="detail-label">Staj Tipi</span>
                  <span className="detail-value">
                    {selectedInternship.internshipType || 'Standart'}
                  </span>
                </div>
                <div className="detail-box">
                  <span className="detail-label">Çalışma Şekli</span>
                  <span className="detail-value">
                    {selectedInternship.isRemote ? 'Uzaktan (Remote)' : 'Ofiste / Hibrit'}
                  </span>
                </div>
                <div className="detail-box">
                  <span className="detail-label">Lokasyon</span>
                  <span className="detail-value">{selectedInternship.location}</span>
                </div>
                <div className="detail-box">
                  <span className="detail-label">Süre</span>
                  <span className="detail-value">
                    {selectedInternship.durationWeeks || 12} Hafta
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <h4>📄 İlan Açıklaması</h4>
                <p>{selectedInternship.description}</p>
              </div>

              {((selectedInternship.requiredSkills &&
                selectedInternship.requiredSkills.length > 0) ||
                (selectedInternship.requirements &&
                  selectedInternship.requirements.length > 0)) && (
                <div className="detail-section">
                  <h4>🛠️ Aranan Yetenekler ve Şartlar</h4>
                  <div className="perks-tags">
                    {(selectedInternship.requiredSkills?.length
                      ? selectedInternship.requiredSkills
                      : selectedInternship.requirements
                    ).map((req, idx) => (
                      <span
                        key={idx}
                        className="perk-badge"
                        style={{
                          background: 'rgba(99, 102, 241, 0.15)',
                          color: '#818cf8',
                          borderColor: 'rgba(99, 102, 241, 0.3)',
                        }}
                      >
                        #{req}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSelectedInternship(null)}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
