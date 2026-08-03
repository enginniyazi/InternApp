import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import {
  fetchAdminStats,
  fetchAdminCompanies,
  approveCompany,
  fetchAdminUsers,
  deleteAdminUser,
  fetchAdminInternships,
  deleteAdminInternship,
} from '../../lib/adminService';
import type {
  AdminStats,
  AdminCompanyItem,
  AdminUserItem,
  AdminInternshipItem,
} from '../../lib/adminService';

type AdminTab = 'stats' | 'companies' | 'internships' | 'users';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('stats');
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalStudents: 0,
    totalCompanies: 0,
    totalInternships: 0,
    totalApplications: 0,
  });
  const [companies, setCompanies] = useState<AdminCompanyItem[]>([]);
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [internships, setInternships] = useState<AdminInternshipItem[]>([]);
  const [actionMsg, setActionMsg] = useState('');

  const loadData = () => {
    fetchAdminStats()
      .then(setStats)
      .catch(() => {});
    fetchAdminCompanies()
      .then(setCompanies)
      .catch(() => {});
    fetchAdminUsers()
      .then(setUsers)
      .catch(() => {});
    fetchAdminInternships()
      .then(setInternships)
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveCompany = async (id: string) => {
    try {
      await approveCompany(id);
      setActionMsg('Şirket hesabı doğrulandı!');
      loadData();
    } catch {
      setActionMsg('İşlem başarısız.');
    }
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (!window.confirm(`${email} kullanıcısını silmek istediğinize emin misiniz?`)) return;
    try {
      await deleteAdminUser(id);
      setActionMsg('Kullanıcı sistemden silindi.');
      loadData();
    } catch {
      setActionMsg('Kullanıcı silinemedi.');
    }
  };

  const handleDeleteInternship = async (id: string, title: string) => {
    if (!window.confirm(`"${title}" ilanını yayından kaldırmak istediğinize emin misiniz?`)) return;
    try {
      await deleteAdminInternship(id);
      setActionMsg('İlan başarıyla yayından kaldırıldı.');
      loadData();
    } catch {
      setActionMsg('İlan silinemedi.');
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>⚙️ Admin Yönetim Paneli</h2>
        {actionMsg && (
          <span
            style={{
              fontSize: '13px',
              color: '#34d399',
              background: 'rgba(16, 185, 129, 0.15)',
              padding: '6px 12px',
              borderRadius: '8px',
            }}
          >
            {actionMsg}
          </span>
        )}
      </div>

      {/* Navigasyon Sekmeleri */}
      <div className="admin-tabs-bar" style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Genel İstatistikler
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'companies' ? 'active' : ''}`}
          onClick={() => setActiveTab('companies')}
        >
          🏢 Şirket Onayları ({companies.length})
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'internships' ? 'active' : ''}`}
          onClick={() => setActiveTab('internships')}
        >
          📢 İlan Moderasyonu ({internships.length})
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Kullanıcı Yönetimi ({users.length})
        </button>
      </div>

      {/* 📊 Sekme 1: İstatistik Kartları */}
      {activeTab === 'stats' && (
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
              <div className="stat-label">Kayıtlı Öğrenci</div>
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

          <div className="stat-card">
            <div className="stat-icon">📥</div>
            <div>
              <div className="stat-value">{stats.totalApplications}</div>
              <div className="stat-label">Toplam Başvuru</div>
            </div>
          </div>
        </div>
      )}

      {/* 🏢 Sekme 2: Şirket Onay Paneli */}
      {activeTab === 'companies' && (
        <div className="admin-table-card">
          <h3 style={{ margin: 0, fontSize: '18px', marginBottom: '16px' }}>
            Kayıtlı Şirketler & Onay Durumu
          </h3>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Şirket Adı</th>
                <th>E-posta</th>
                <th>Web Sitesi</th>
                <th>Kayıt Tarihi</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((comp) => (
                <tr key={comp.id}>
                  <td style={{ fontWeight: 600 }}>{comp.companyName}</td>
                  <td>{comp.user.email}</td>
                  <td>
                    {comp.website ? (
                      <a
                        href={comp.website}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#60a5fa' }}
                      >
                        {comp.website}
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {new Date(comp.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={() => handleApproveCompany(comp.id)}
                    >
                      Onayla / Doğrula
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 📢 Sekme 3: İlan Moderasyonu */}
      {activeTab === 'internships' && (
        <div className="admin-table-card">
          <h3 style={{ margin: 0, fontSize: '18px', marginBottom: '16px' }}>
            Tüm İlanlar & Moderasyon
          </h3>

          <table className="admin-table">
            <thead>
              <tr>
                <th>İlan Başlığı</th>
                <th>Şirket</th>
                <th>Şehir / Lokasyon</th>
                <th>Staj Seviyesi</th>
                <th>Başvuru Sayısı</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {internships.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600 }}>{item.title}</td>
                  <td>{item.company?.companyName || 'Şirket'}</td>
                  <td>{item.city || item.location}</td>
                  <td>{item.targetEducationLevel || 'Lisans'}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#818cf8' }}>
                      {item._count?.applications || 0} Aday
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => handleDeleteInternship(item.id, item.title)}
                    >
                      Yayından Kaldır (Sil)
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 👥 Sekme 4: Kullanıcı Yönetimi */}
      {activeTab === 'users' && (
        <div className="admin-table-card">
          <h3 style={{ margin: 0, fontSize: '18px', marginBottom: '16px' }}>
            Kullanıcı Listesi & Hesap Yönetimi
          </h3>

          <table className="admin-table">
            <thead>
              <tr>
                <th>E-posta</th>
                <th>Rol</th>
                <th>Profil Bilgisi</th>
                <th>Kayıt Tarihi</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {users.map((usr) => (
                <tr key={usr.id}>
                  <td style={{ fontWeight: 600 }}>{usr.email}</td>
                  <td>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        background:
                          usr.role === 'ADMIN'
                            ? 'rgba(239, 68, 68, 0.2)'
                            : usr.role === 'COMPANY'
                              ? 'rgba(99, 102, 241, 0.2)'
                              : 'rgba(16, 185, 129, 0.2)',
                        color:
                          usr.role === 'ADMIN'
                            ? '#f87171'
                            : usr.role === 'COMPANY'
                              ? '#818cf8'
                              : '#34d399',
                      }}
                    >
                      {usr.role}
                    </span>
                  </td>
                  <td>
                    {usr.studentProfile
                      ? `${usr.studentProfile.firstName} ${usr.studentProfile.lastName} (${usr.studentProfile.university || 'Okul Belirtilmemiş'})`
                      : usr.companyProfile
                        ? usr.companyProfile.companyName
                        : 'Sistem Yöneticisi'}
                  </td>
                  <td style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {new Date(usr.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td>
                    {usr.role !== 'ADMIN' ? (
                      <button
                        type="button"
                        className="btn-danger"
                        onClick={() => handleDeleteUser(usr.id, usr.email)}
                      >
                        Hesabı Sil
                      </button>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Korumalı</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
