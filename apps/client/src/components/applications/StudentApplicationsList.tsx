import React from 'react';
import './StudentApplicationsList.css';

export interface ApplicationItem {
  id: string;
  internshipTitle: string;
  companyName: string;
  status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  note?: string;
}

interface StudentApplicationsListProps {
  applications: ApplicationItem[];
}

export const StudentApplicationsList: React.FC<StudentApplicationsListProps> = ({
  applications,
}) => {
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

              <div>{getStatusBadge(app.status)}</div>
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
  );
};
