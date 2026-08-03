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

  // Modaller için state
  const [selectedInternship, setSelectedInternship] = useState<AdminInternshipItem | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);

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

  const handleToggleApproveCompany = async (id: string, currentApproved?: boolean) => {
    try {
      await approveCompany(id);
      setActionMsg(
        currentApproved ? 'Şirket onayı kaldırıldı / askıya alındı.' : 'Şirket başarıyla onaylandı!'
      );
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
      if (selectedUser?.id === id) setSelectedUser(null);
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
      if (selectedInternship?.id === id) setSelectedInternship(null);
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

      {/* 🏢 Sekme 2: Çift Yönlü Şirket Onay Paneli */}
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
                <th>Onay Rozeti</th>
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
                  <td>
                    {comp.isApproved ? (
                      <span
                        style={{
                          background: 'rgba(16, 185, 129, 0.2)',
                          color: '#34d399',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        ✅ Onaylı Şirket
                      </span>
                    ) : (
                      <span
                        style={{
                          background: 'rgba(245, 158, 11, 0.2)',
                          color: '#fbbf24',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        ⏳ Onay Bekliyor
                      </span>
                    )}
                  </td>
                  <td style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {new Date(comp.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td>
                    <button
                      type="button"
                      className={comp.isApproved ? 'btn-secondary' : 'btn-primary'}
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={() => handleToggleApproveCompany(comp.id, comp.isApproved)}
                    >
                      {comp.isApproved ? '🚫 Onayı Kaldır (Askıya Al)' : '✅ Şirketi Onayla'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 📢 Sekme 3: İlan Moderasyonu ve Detay İnceleme */}
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
                <th>Başvuru</th>
                <th>İşlemler</th>
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
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                        onClick={() => setSelectedInternship(item)}
                      >
                        🔍 Detay Gör
                      </button>
                      <button
                        type="button"
                        className="btn-danger"
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                        onClick={() => handleDeleteInternship(item.id, item.title)}
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 👥 Sekme 4: Kullanıcı Yönetimi & Profil İnceleme */}
      {activeTab === 'users' && (
        <div className="admin-table-card">
          <h3 style={{ margin: 0, fontSize: '18px', marginBottom: '16px' }}>
            Kullanıcı Listesi & Profil İnceleme
          </h3>

          <table className="admin-table">
            <thead>
              <tr>
                <th>E-posta</th>
                <th>Rol</th>
                <th>Profil Özeti</th>
                <th>Kayıt Tarihi</th>
                <th>İşlemler</th>
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
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                        onClick={() => setSelectedUser(usr)}
                      >
                        👤 Profil Gör
                      </button>
                      {usr.role !== 'ADMIN' && (
                        <button
                          type="button"
                          className="btn-danger"
                          style={{ padding: '6px 10px', fontSize: '12px' }}
                          onClick={() => handleDeleteUser(usr.id, usr.email)}
                        >
                          Hesabı Sil
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔍 İlan Detay İnceleme Modalı */}
      {selectedInternship && (
        <div className="detail-modal-backdrop" onClick={() => setSelectedInternship(null)}>
          <div className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '12px',
              }}
            >
              <div>
                <span
                  className="badge-type"
                  style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px' }}
                >
                  {selectedInternship.company?.companyName}
                </span>
                <h3 style={{ margin: '6px 0 0 0', fontSize: '20px', color: 'var(--text-main)' }}>
                  {selectedInternship.title}
                </h3>
              </div>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSelectedInternship(null)}
              >
                ✕
              </button>
            </div>

            <div className="detail-modal-body" style={{ padding: '16px 0' }}>
              <div className="detail-grid" style={{ marginBottom: '16px' }}>
                <div className="detail-box">
                  <span className="detail-label">ŞEHİR / LOKASYON</span>
                  <span className="detail-value">
                    {selectedInternship.city || selectedInternship.location}
                  </span>
                </div>
                <div className="detail-box">
                  <span className="detail-label">EĞİTİM SEVİYESİ</span>
                  <span className="detail-value">{selectedInternship.targetEducationLevel}</span>
                </div>
                <div className="detail-box">
                  <span className="detail-label">ÇALIŞMA ŞEKLİ</span>
                  <span className="detail-value">{selectedInternship.workModel || 'Ofiste'}</span>
                </div>
                <div className="detail-box">
                  <span className="detail-label">TOPLAM BAŞVURU</span>
                  <span className="detail-value">
                    {selectedInternship._count?.applications || 0} Aday
                  </span>
                </div>
              </div>

              <div className="detail-section" style={{ marginBottom: '16px' }}>
                <h4>İlan Açıklaması</h4>
                <p style={{ whiteSpace: 'pre-line' }}>{selectedInternship.description}</p>
              </div>

              {selectedInternship.requirements && selectedInternship.requirements.length > 0 && (
                <div className="detail-section">
                  <h4>Aranan Nitelikler & Yetenekler</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                    {selectedInternship.requirements.map((req, idx) => (
                      <span key={idx} className="requirement-tag">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '12px',
              }}
            >
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSelectedInternship(null)}
              >
                Kapat
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={() =>
                  handleDeleteInternship(selectedInternship.id, selectedInternship.title)
                }
              >
                İlanı Yayından Kaldır
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 👤 Kullanıcı Profil İnceleme Modalı */}
      {selectedUser && (
        <div className="detail-modal-backdrop" onClick={() => setSelectedUser(null)}>
          <div className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '12px',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)' }}>
                👤 Kullanıcı Profil İnceleme ({selectedUser.role})
              </h3>
              <button type="button" className="btn-secondary" onClick={() => setSelectedUser(null)}>
                ✕
              </button>
            </div>

            <div className="detail-modal-body" style={{ padding: '16px 0' }}>
              <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-muted)' }}>
                <strong>E-posta:</strong> {selectedUser.email} &bull; <strong>Kayıt Tarihi:</strong>{' '}
                {new Date(selectedUser.createdAt).toLocaleDateString('tr-TR')}
              </p>

              {selectedUser.studentProfile && (
                <div>
                  <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-main)' }}>
                    🎓 Öğrenci Akademik Bilgileri
                  </h4>
                  <div className="detail-grid" style={{ marginBottom: '12px' }}>
                    <div className="detail-box">
                      <span className="detail-label">AD SOYAD</span>
                      <span className="detail-value">
                        {selectedUser.studentProfile.firstName}{' '}
                        {selectedUser.studentProfile.lastName}
                      </span>
                    </div>
                    <div className="detail-box">
                      <span className="detail-label">ÜNİVERSİTE</span>
                      <span className="detail-value">
                        {selectedUser.studentProfile.university || 'Belirtilmedi'}
                      </span>
                    </div>
                    <div className="detail-box">
                      <span className="detail-label">BÖLÜM</span>
                      <span className="detail-value">
                        {selectedUser.studentProfile.department || 'Belirtilmedi'}
                      </span>
                    </div>
                    <div className="detail-box">
                      <span className="detail-label">NOT ORTALAMASI (GPA)</span>
                      <span className="detail-value">
                        {selectedUser.studentProfile.gpa
                          ? selectedUser.studentProfile.gpa.toFixed(2)
                          : '-'}
                      </span>
                    </div>
                  </div>

                  {selectedUser.studentProfile.skills &&
                    selectedUser.studentProfile.skills.length > 0 && (
                      <div style={{ marginBottom: '12px' }}>
                        <span className="detail-label">TEKNİK YETENEKLER</span>
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px',
                            marginTop: '4px',
                          }}
                        >
                          {selectedUser.studentProfile.skills.map((skill, idx) => (
                            <span key={idx} className="perk-badge">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {selectedUser.studentProfile.bio && (
                    <div style={{ marginBottom: '12px' }}>
                      <span className="detail-label">HAKKINDA / ÖZGEÇMİŞ ÖZETİ</span>
                      <p
                        style={{
                          margin: '4px 0 0 0',
                          fontSize: '13px',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {selectedUser.studentProfile.bio}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {selectedUser.companyProfile && (
                <div>
                  <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-main)' }}>
                    🏢 Şirket Profil Bilgileri
                  </h4>
                  <div className="detail-grid">
                    <div className="detail-box">
                      <span className="detail-label">ŞİRKET UNVANI</span>
                      <span className="detail-value">
                        {selectedUser.companyProfile.companyName}
                      </span>
                    </div>
                    <div className="detail-box">
                      <span className="detail-label">WEB SİTESİ</span>
                      <span className="detail-value">
                        {selectedUser.companyProfile.website || '-'}
                      </span>
                    </div>
                  </div>
                  {selectedUser.companyProfile.description && (
                    <div style={{ marginTop: '12px' }}>
                      <span className="detail-label">ŞİRKET AÇIKLAMASI</span>
                      <p
                        style={{
                          margin: '4px 0 0 0',
                          fontSize: '13px',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {selectedUser.companyProfile.description}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '12px',
              }}
            >
              <button type="button" className="btn-secondary" onClick={() => setSelectedUser(null)}>
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
