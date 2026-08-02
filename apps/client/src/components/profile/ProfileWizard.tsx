import React, { useState } from 'react';
import './ProfileWizard.css';

export interface StudentProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  university: string;
  department: string;
  grade: string;
  gpa: string;
  educationLevel: string;
  internshipStatus: string;
  skills: string[];
  linkedinUrl: string;
  githubUrl: string;
  bio: string;
  cvUrl?: string;
}

interface ProfileWizardProps {
  initialData?: Partial<StudentProfileData>;
  onSaveProfile?: (data: StudentProfileData) => Promise<void> | void;
  onUploadCv?: (file: File) => Promise<string | void> | void;
}

export const ProfileWizard: React.FC<ProfileWizardProps> = ({
  initialData,
  onSaveProfile,
  onUploadCv,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [firstName, setFirstName] = useState(initialData?.firstName || '');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [city, setCity] = useState(initialData?.city || 'İstanbul');

  const [university, setUniversity] = useState(initialData?.university || '');
  const [department, setDepartment] = useState(initialData?.department || '');
  const [grade, setGrade] = useState(initialData?.grade || '3. Sınıf');
  const [gpa, setGpa] = useState(initialData?.gpa || '');
  const [educationLevel, setEducationLevel] = useState(initialData?.educationLevel || 'BACHELOR');
  const [internshipStatus, setInternshipStatus] = useState(
    initialData?.internshipStatus || 'MANDATORY'
  );

  const [skills, setSkills] = useState<string[]>(initialData?.skills || ['React', 'TypeScript']);
  const [newSkill, setNewSkill] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState(initialData?.linkedinUrl || '');
  const [githubUrl, setGithubUrl] = useState(initialData?.githubUrl || '');

  const [bio, setBio] = useState(initialData?.bio || '');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUrl, setCvUrl] = useState<string | undefined>(initialData?.cvUrl);

  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!firstName.trim() || !lastName.trim()) {
        setErrorMsg('Lütfen ad ve soyad alanlarını doldurunuz.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!university.trim() || !department.trim()) {
        setErrorMsg('Lütfen okul ve bölüm bilgilerinizi giriniz.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handlePrev = () => {
    setErrorMsg('');
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
    if (step === 4) setStep(3);
  };

  const handleFileChange = async (file: File | null) => {
    if (!file) return;
    setErrorMsg('');

    if (file.type !== 'application/pdf') {
      setErrorMsg('Sadece PDF formatındaki dosyalar yüklenebilir.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Dosya boyutu maksimum 5MB olabilir.');
      return;
    }

    setCvFile(file);

    if (onUploadCv) {
      const uploadedUrl = await onUploadCv(file);
      if (uploadedUrl) {
        setCvUrl(uploadedUrl);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      void handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSave = async () => {
    if (onSaveProfile) {
      await onSaveProfile({
        firstName,
        lastName,
        phone,
        city,
        university,
        department,
        grade,
        gpa,
        educationLevel,
        internshipStatus,
        skills,
        linkedinUrl,
        githubUrl,
        bio,
        cvUrl,
      });
    }
  };

  return (
    <div className="profile-wizard-container" style={{ maxWidth: '680px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Öğrenci Profil Sihirbazı</h2>

      <div className="wizard-step-bar">
        <div className={`wizard-step-item ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <span className="step-label">Kişisel</span>
        </div>
        <div className={`wizard-step-item ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <span className="step-label">Akademik</span>
        </div>
        <div className={`wizard-step-item ${step === 3 ? 'active' : step > 3 ? 'completed' : ''}`}>
          <div className="step-number">3</div>
          <span className="step-label">Yetenek & Linkler</span>
        </div>
        <div className={`wizard-step-item ${step === 4 ? 'active' : ''}`}>
          <div className="step-number">4</div>
          <span className="step-label">CV & Hakkımda</span>
        </div>
      </div>

      {errorMsg && <div className="error-message">{errorMsg}</div>}

      {/* Adım 1: Kişisel Bilgiler */}
      {step === 1 && (
        <div className="tab-content">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="wiz-firstname">
                Ad *
              </label>
              <input
                id="wiz-firstname"
                type="text"
                className="form-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ahmet"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="wiz-lastname">
                Soyad *
              </label>
              <input
                id="wiz-lastname"
                type="text"
                className="form-input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Yılmaz"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="wiz-phone">
                Telefon Numarası
              </label>
              <input
                id="wiz-phone"
                type="text"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+90 555 123 4567"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="wiz-city">
                İkamet Edilen Şehir
              </label>
              <input
                id="wiz-city"
                type="text"
                className="form-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="İstanbul"
              />
            </div>
          </div>
        </div>
      )}

      {/* Adım 2: Akademik Bilgiler */}
      {step === 2 && (
        <div className="tab-content">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="wiz-university">
                Üniversite / Okul Adı *
              </label>
              <input
                id="wiz-university"
                type="text"
                className="form-input"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="İstanbul Teknik Üniversitesi"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="wiz-department">
                Bölüm *
              </label>
              <input
                id="wiz-department"
                type="text"
                className="form-input"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Bilgisayar Mühendisliği"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="wiz-edulevel">
                Eğitim Seviyesi
              </label>
              <select
                id="wiz-edulevel"
                className="form-input"
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
              >
                <option value="BACHELOR">Lisans</option>
                <option value="ASSOCIATE">Önlisans (MYO)</option>
                <option value="HIGH_SCHOOL">Lise / Meslek Lisesi</option>
                <option value="MASTER_PHD">Yüksek Lisans / Doktora</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="wiz-grade">
                Sınıf / Durum
              </label>
              <select
                id="wiz-grade"
                className="form-input"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                <option value="1. Sınıf">1. Sınıf</option>
                <option value="2. Sınıf">2. Sınıf</option>
                <option value="3. Sınıf">3. Sınıf</option>
                <option value="4. Sınıf">4. Sınıf</option>
                <option value="Mezun">Mezun</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="wiz-gpa">
                Not Ortalaması (GANO / 4.00)
              </label>
              <input
                id="wiz-gpa"
                type="number"
                step="0.01"
                min="0"
                max="4"
                className="form-input"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                placeholder="3.45"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="wiz-status">
                Aradığınız Staj Türü
              </label>
              <select
                id="wiz-status"
                className="form-input"
                value={internshipStatus}
                onChange={(e) => setInternshipStatus(e.target.value)}
              >
                <option value="MANDATORY">Zorunlu Okul Stajı</option>
                <option value="VOLUNTARY">Gönüllü Staj</option>
                <option value="LONG_TERM">Uzun Dönem Staj</option>
                <option value="SUMMER">Yaz Stajı</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Adım 3: Yetenekler ve Portfolyo Linkleri */}
      {step === 3 && (
        <div className="tab-content">
          <div className="form-group">
            <label className="form-label">Teknik Yetenekler & Teknolojiler</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Örn: React, Python, Figma"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              />
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '0 16px' }}
                onClick={handleAddSkill}
              >
                Ekle
              </button>
            </div>

            <div className="perks-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="perk-badge"
                  style={{
                    background: 'rgba(99, 102, 241, 0.2)',
                    color: '#a5b4fc',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleRemoveSkill(skill)}
                  title="Silmek için tıklayın"
                >
                  #{skill} ✕
                </span>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="wiz-linkedin">
                LinkedIn Profili URL
              </label>
              <input
                id="wiz-linkedin"
                type="url"
                className="form-input"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/kullaniciadi"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="wiz-github">
                GitHub / Portfolyo URL
              </label>
              <input
                id="wiz-github"
                type="url"
                className="form-input"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/kullaniciadi"
              />
            </div>
          </div>
        </div>
      )}

      {/* Adım 4: CV ve Özet Biyografi */}
      {step === 4 && (
        <div className="tab-content">
          <div className="form-group">
            <label className="form-label" htmlFor="wiz-bio">
              Özet Biyografi / Kendinizden Bahsedin
            </label>
            <textarea
              id="wiz-bio"
              className="form-textarea"
              style={{ minHeight: '100px' }}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Üniversite, ilgi alanlarınız, tamamladığınız projeler ve staj hedefleriniz..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Özgeçmiş (CV / PDF)</label>
            <div
              className={`dropzone-area ${isDragging ? 'dragging' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('cv-file-input')?.click()}
            >
              <div className="upload-icon">📄</div>
              <p style={{ margin: '4px 0', fontWeight: 600 }}>
                PDF CV dosyanızı buraya sürükleyin veya tıklayın
              </p>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                Maksimum dosya boyutu: 5MB (Sadece PDF)
              </span>
              <input
                id="cv-file-input"
                type="file"
                accept="application/pdf"
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
              />
            </div>

            {(cvFile || cvUrl) && (
              <div className="file-info-badge" style={{ marginTop: '10px' }}>
                <span>✅ CV Yüklendi: {cvFile ? cvFile.name : 'CV_Profil.pdf'}</span>
                <span style={{ fontSize: '12px', opacity: 0.8 }}>PDF Formatı</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="wizard-actions" style={{ marginTop: '24px' }}>
        {step > 1 ? (
          <button type="button" className="btn-secondary" onClick={handlePrev}>
            Geri
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button type="button" className="btn-primary" onClick={handleNext}>
            İleri
          </button>
        ) : (
          <button type="button" className="btn-primary" onClick={handleSave}>
            Profili Kaydet ve Tamamla
          </button>
        )}
      </div>
    </div>
  );
};
