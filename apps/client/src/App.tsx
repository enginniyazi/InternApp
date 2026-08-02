import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { AuthForm } from './components/auth/AuthForm';
import type { LoginFormData, RegisterFormData } from './components/auth/AuthForm';
import { InternshipList } from './components/internships/InternshipList';
import type { InternshipData } from './components/internships/InternshipCard';
import { InternshipFormModal } from './components/internships/InternshipFormModal';
import type { InternshipFormData } from './components/internships/InternshipFormModal';
import { ProfileWizard } from './components/profile/ProfileWizard';
import type { StudentProfileData } from './components/profile/ProfileWizard';
import { StudentApplicationsList } from './components/applications/StudentApplicationsList';
import type { ApplicationItem } from './components/applications/StudentApplicationsList';
import { CompanyApplicationsModal } from './components/applications/CompanyApplicationsModal';
import type { ApplicantItem } from './components/applications/CompanyApplicationsModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ToastContainer } from './components/common/ToastContainer';
import type { ToastMessage } from './components/common/ToastContainer';
import { ApiError } from './lib/api';
import { getAccessToken } from './lib/auth';
import { loginUser, registerUser, fetchCurrentUser, logoutUser } from './lib/authService';
import type { UserData } from './lib/authService';
import {
  fetchInternships,
  fetchMyInternships,
  createInternship,
  updateInternship,
  deleteInternship,
} from './lib/internshipService';
import {
  applyToInternship,
  fetchStudentApplications,
  fetchCompanyApplications,
  updateApplicationStatus,
} from './lib/applicationService';
import { fetchStudentProfile, updateStudentProfile, uploadCv } from './lib/profileService';

type UserRoleType = 'GUEST' | 'STUDENT' | 'COMPANY' | 'ADMIN';
type TabType = 'internships' | 'profile' | 'applications' | 'admin';

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const savedTheme = localStorage.getItem('stajapp_theme') as 'dark' | 'light';
    return savedTheme || 'dark';
  });

  const [userRole, setUserRole] = useState<UserRoleType>('GUEST');
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const savedTab = localStorage.getItem('stajapp_tab') as TabType;
    return savedTab || 'internships';
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [internships, setInternships] = useState<InternshipData[]>([]);
  const [studentApplications, setStudentApplications] = useState<ApplicationItem[]>([]);
  const [companyApplicants, setCompanyApplicants] = useState<ApplicantItem[]>([]);

  // Profile State
  const [studentProfile, setStudentProfile] = useState<StudentProfileData>({
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    university: '',
    department: '',
    grade: '3. Sınıf',
    gpa: '',
    educationLevel: 'BACHELOR',
    internshipStatus: 'MANDATORY',
    skills: [],
    linkedinUrl: '',
    githubUrl: '',
    bio: '',
  });

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
  const [editingInternship, setEditingInternship] = useState<InternshipData | null>(null);

  // ─── Tema ───
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('stajapp_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('stajapp_tab', activeTab);
  }, [activeTab]);

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = String(Date.now());
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleApiError = useCallback((err: unknown, fallback = 'Bir hata oluştu.') => {
    const message = err instanceof ApiError ? err.message : fallback;
    addToast('error', message);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  // ─── Oturum doğrulama (sayfa yüklendiğinde) ───
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setIsAuthLoading(false);
      return;
    }
    fetchCurrentUser()
      .then((user) => {
        setCurrentUser(user);
        setUserRole(user.role);
      })
      .catch(() => {
        setUserRole('GUEST');
        setCurrentUser(null);
      })
      .finally(() => setIsAuthLoading(false));
  }, []);

  // ─── İlanları çek ───
  const loadInternships = useCallback(
    async (filters?: { search?: string; isRemote?: boolean }) => {
      try {
        if (userRole === 'COMPANY') {
          const data = await fetchMyInternships();
          setInternships(data);
        } else if (userRole !== 'GUEST') {
          const data = await fetchInternships(filters);
          setInternships(data);
        }
      } catch (err) {
        handleApiError(err, 'İlanlar yüklenemedi.');
      }
    },
    [userRole, handleApiError]
  );

  useEffect(() => {
    if (userRole !== 'GUEST') {
      loadInternships();
    }
  }, [userRole, loadInternships]);

  // ─── Başvuruları çek ───
  useEffect(() => {
    if (userRole === 'STUDENT') {
      fetchStudentApplications()
        .then(setStudentApplications)
        .catch((err) => handleApiError(err, 'Başvurular yüklenemedi.'));
    }
    if (userRole === 'COMPANY') {
      fetchCompanyApplications()
        .then(setCompanyApplicants)
        .catch((err) => handleApiError(err, 'Başvurular yüklenemedi.'));
    }
  }, [userRole, handleApiError]);

  // ─── Profil çek ───
  useEffect(() => {
    if (userRole === 'STUDENT') {
      fetchStudentProfile()
        .then(setStudentProfile)
        .catch(() => {});
    }
  }, [userRole]);

  // ─── Auth Handlers ───
  const handleLogin = async (data: LoginFormData) => {
    try {
      const user = await loginUser(data.email, data.password);
      setCurrentUser(user);
      setUserRole(user.role);
      setActiveTab(user.role === 'ADMIN' ? 'admin' : 'internships');
      addToast('success', 'Başarıyla giriş yapıldı. Hoş geldiniz!');
    } catch (err) {
      handleApiError(err, 'Giriş başarısız.');
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    try {
      const user = await registerUser(data.email, data.password, data.role, {
        firstName: data.firstName,
        lastName: data.lastName,
        companyName: data.companyName,
      });
      setCurrentUser(user);
      setUserRole(user.role);
      setActiveTab('internships');
      addToast('success', 'Hesabınız başarıyla oluşturuldu.');
    } catch (err) {
      handleApiError(err, 'Kayıt başarısız.');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      setCurrentUser(null);
      setUserRole('GUEST');
      setInternships([]);
      setStudentApplications([]);
      setCompanyApplicants([]);
      setActiveTab('internships');
      addToast('info', 'Oturumunuz kapatıldı.');
    }
  };

  // ─── Internship Handlers ───
  const handleApply = async (id: string) => {
    try {
      await applyToInternship(id);
      addToast('success', 'Staj başvurusunda bulunuldu!');
      const apps = await fetchStudentApplications();
      setStudentApplications(apps);
    } catch (err) {
      handleApiError(err, 'Başvuru gönderilemedi.');
    }
  };

  const handleCreateNew = () => {
    setEditingInternship(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (internship: InternshipData) => {
    setEditingInternship(internship);
    setIsFormModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu staj ilanını silmek istediğinize emin misiniz?')) return;
    try {
      await deleteInternship(id);
      addToast('info', 'İlan başarıyla silindi.');
      await loadInternships();
    } catch (err) {
      handleApiError(err, 'İlan silinemedi.');
    }
  };

  const handleFormSubmit = async (data: InternshipFormData) => {
    try {
      if (editingInternship) {
        await updateInternship(editingInternship.id, data);
        addToast('success', 'İlan başarıyla güncellendi.');
      } else {
        await createInternship(data);
        addToast('success', 'Yeni staj ilanı yayınlandı!');
      }
      await loadInternships();
    } catch (err) {
      handleApiError(err, 'İlan kaydedilemedi.');
    }
  };

  // ─── Profile Handler ───
  const handleSaveProfile = async (data: StudentProfileData) => {
    try {
      const updated = await updateStudentProfile(data);
      setStudentProfile(updated);
      addToast('success', 'Profil bilgileriniz kaydedildi.');
      setActiveTab('internships');
    } catch (err) {
      handleApiError(err, 'Profil kaydedilemedi.');
    }
  };

  const handleUploadCv = async (file: File) => {
    try {
      const cvUrl = await uploadCv(file);
      setStudentProfile((prev) => ({ ...prev, cvUrl }));
      addToast('success', 'CV başarıyla yüklendi.');
      return cvUrl;
    } catch (err) {
      handleApiError(err, 'CV yüklenemedi.');
      return undefined;
    }
  };

  // ─── Company Application Status Handler ───
  const handleUpdateApplicantStatus = async (
    applicationId: string,
    newStatus: ApplicantItem['status']
  ) => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      addToast('info', 'Başvuru durumu güncellendi ve adaya bildirildi.');
      const apps = await fetchCompanyApplications();
      setCompanyApplicants(apps);
    } catch (err) {
      handleApiError(err, 'Durum güncellenemedi.');
    }
  };

  // ─── Auth Loading Screen ───
  if (isAuthLoading) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-primary)',
          color: 'var(--text-main)',
        }}
      >
        <p>Yükleniyor...</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="main-header" role="banner">
        <h1>🚀 StajApp Platformu</h1>

        <nav aria-label="Ana Navigasyon" className="nav-links">
          {userRole !== 'GUEST' && (
            <div className="nav-group">
              <button
                type="button"
                aria-current={activeTab === 'internships' ? 'page' : undefined}
                className={`btn-secondary ${activeTab === 'internships' ? 'active' : ''}`}
                onClick={() => setActiveTab('internships')}
                style={{
                  padding: '6px 12px',
                  fontSize: '13px',
                  borderRadius: '8px',
                  background: activeTab === 'internships' ? '#4f46e5' : 'var(--bg-card)',
                  color: activeTab === 'internships' ? '#ffffff' : 'var(--text-main)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                }}
              >
                İlanlar
              </button>

              {userRole === 'STUDENT' && (
                <>
                  <button
                    type="button"
                    aria-current={activeTab === 'applications' ? 'page' : undefined}
                    className={`btn-secondary ${activeTab === 'applications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('applications')}
                    style={{
                      padding: '6px 12px',
                      fontSize: '13px',
                      borderRadius: '8px',
                      background: activeTab === 'applications' ? '#4f46e5' : 'var(--bg-card)',
                      color: activeTab === 'applications' ? '#ffffff' : 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                    }}
                  >
                    Başvurularım ({studentApplications.length})
                  </button>

                  <button
                    type="button"
                    aria-current={activeTab === 'profile' ? 'page' : undefined}
                    className={`btn-secondary ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                    style={{
                      padding: '6px 12px',
                      fontSize: '13px',
                      borderRadius: '8px',
                      background: activeTab === 'profile' ? '#4f46e5' : 'var(--bg-card)',
                      color: activeTab === 'profile' ? '#ffffff' : 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                    }}
                  >
                    Profilim & CV
                  </button>
                </>
              )}

              {userRole === 'COMPANY' && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setIsApplicantsModalOpen(true)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '13px',
                    borderRadius: '8px',
                  }}
                >
                  Gelen Başvurular ({companyApplicants.length})
                </button>
              )}

              {userRole === 'ADMIN' && (
                <button
                  type="button"
                  aria-current={activeTab === 'admin' ? 'page' : undefined}
                  className={`btn-secondary ${activeTab === 'admin' ? 'active' : ''}`}
                  onClick={() => setActiveTab('admin')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '13px',
                    borderRadius: '8px',
                    background: activeTab === 'admin' ? '#4f46e5' : 'var(--bg-card)',
                    color: activeTab === 'admin' ? '#ffffff' : 'var(--text-main)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                  }}
                >
                  Admin Paneli
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            aria-label="Tema değiştir"
            onClick={toggleTheme}
            style={{
              padding: '6px 12px',
              fontSize: '13px',
              borderRadius: '8px',
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
            }}
          >
            {theme === 'dark' ? '🌙 Koyu Mod' : '☀️ Açık Mod'}
          </button>

          {userRole !== 'GUEST' && (
            <div className="nav-group">
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {currentUser?.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  padding: '6px 12px',
                  fontSize: '13px',
                  borderRadius: '8px',
                  background: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Çıkış Yap
              </button>
            </div>
          )}
        </nav>
      </header>

      <section style={{ flex: 1 }}>
        {userRole === 'GUEST' ? (
          <AuthForm onLogin={handleLogin} onRegister={handleRegister} />
        ) : activeTab === 'profile' && userRole === 'STUDENT' ? (
          <ProfileWizard
            initialData={studentProfile}
            onSaveProfile={handleSaveProfile}
            onUploadCv={handleUploadCv}
          />
        ) : activeTab === 'applications' && userRole === 'STUDENT' ? (
          <StudentApplicationsList applications={studentApplications} />
        ) : activeTab === 'admin' && userRole === 'ADMIN' ? (
          <AdminDashboard />
        ) : (
          <InternshipList
            internships={internships}
            isCompany={userRole === 'COMPANY'}
            onApply={handleApply}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreateNew={handleCreateNew}
            onSearchChange={(search) => loadInternships({ search })}
            onRemoteToggle={(isRemote) => loadInternships({ isRemote })}
          />
        )}
      </section>

      <InternshipFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingInternship}
      />

      <CompanyApplicationsModal
        isOpen={isApplicantsModalOpen}
        onClose={() => setIsApplicantsModalOpen(false)}
        internshipTitle="Frontend Developer Stajyeri"
        applicants={companyApplicants}
        onUpdateStatus={handleUpdateApplicantStatus}
      />

      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </main>
  );
}

export default App;
