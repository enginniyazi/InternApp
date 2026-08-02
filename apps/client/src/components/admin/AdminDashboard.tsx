import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { fetchAdminStats, fetchAdminCompanies, approveCompany } from '../../lib/adminService';
import type { AdminStats, AdminCompanyItem } from '../../lib/adminService';

export interface CompanyAdminItem {
  id: string;
  companyName: string;
  email: string;
  website?: string;
  isApproved: boolean;
  createdAt: string;
}

export const AdminDashboard: React.FC = () => {
  const [companies, setCompanies] = useState<AdminCompanyItem[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalStudents: 0,
    totalCompanies: 0,
    totalInternships: 0,
    totalApplications: 0,
  });

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .catch(() => {});
    fetchAdminCompanies()
      .then(setCompanies)
      .catch(() => {});
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await approveCompany(id);
      const updated = await fetchAdminCompanies();
      setCompanies(updated);
    } catch {
      /* toast handled by parent */
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>
        ⚙️ Admin Kontrol Paneli
      </h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div>
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Toplam Kullanıcı</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div>
            <div className="stat-value">{stats.totalStudents}</div>
            <div className="stat-label">Aktif Öğrenci</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div>
            <div className="stat-value">{stats.totalCompanies}</div>
            <div className="stat-label">Kayıtlı Şirket</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📢</div>
          <div>
            <div className="stat-value">{stats.totalInternships}</div>
            <div className="stat-label">Yayındaki İlanlar</div>
          </div>
        </div>
      </div>

      <div className="admin-table-card">
        <h3 style={{ margin: 0, fontSize: '18px' }}>Şirket Onay & Doğrulama Listesi</h3>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Şirket Adı</th>
              <th>E-posta</th>
              <th>Web Sitesi</th>
              <th>Onay Durumu</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((comp) => (
              <tr key={comp.id}>
                <td style={{ fontWeight: 600 }}>{comp.companyName}</td>
                <td>{comp.user.email}</td>
                <td>
                  <a
                    href={comp.website}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#60a5fa' }}
                  >
                    {comp.website || '-'}
                  </a>
                </td>
                <td>
                  <span className="app-status-badge status-pending">⏳ Kayıtlı</span>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                    onClick={() => handleApprove(comp.id)}
                  >
                    Onayla
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
