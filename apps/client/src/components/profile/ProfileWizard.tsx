import React, { useState } from 'react';
import './ProfileWizard.css';

export interface StudentProfileData {
  firstName: string;
  lastName: string;
  phone: string;
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
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [firstName, setFirstName] = useState(initialData?.firstName || '');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [bio, setBio] = useState(initialData?.bio || '');

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUrl, setCvUrl] = useState<string | undefined>(initialData?.cvUrl);

  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!firstName.trim() || !lastName.trim()) {
        setErrorMsg('Lütfen ad ve soyad alanlarını doldurunuz.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePrev = () => {
    setErrorMsg('');
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
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
        bio,
        cvUrl,
      });
    }
  };

  return (
    <div className="profile-wizard-container">
      <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Öğrenci Profil Sihirbazı</h2>

      <div className="wizard-step-bar">
        <div className={`wizard-step-item ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <span className="step-label">Kişisel Bilgiler</span>
        </div>
        <div className={`wizard-step-item ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <span className="step-label">Hakkında</span>
        </div>
        <div className={`wizard-step-item ${step === 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <span className="step-label">CV Yükleme</span>
        </div>
      </div>

      {errorMsg && <div className="error-message">{errorMsg}</div>}

      {step === 1 && (
        <div>
          <div className="form-group">
            <label className="form-label" htmlFor="wiz-firstname">
              Ad
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
              Soyad
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
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="form-group">
            <label className="form-label" htmlFor="wiz-bio">
              Özet Biyografi / Kendinizden Bahsedin
            </label>
            <textarea
              id="wiz-bio"
              className="form-textarea"
              style={{ minHeight: '120px' }}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Üniversite, bölüm, ilgi alanlarınız ve staj hedefleriniz..."
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
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
            <div className="file-info-badge">
              <span>✅ CV Yüklendi: {cvFile ? cvFile.name : 'CV_Profil.pdf'}</span>
              <span style={{ fontSize: '12px', opacity: 0.8 }}>PDF Formatı</span>
            </div>
          )}
        </div>
      )}

      <div className="wizard-actions">
        {step > 1 ? (
          <button type="button" className="btn-secondary" onClick={handlePrev}>
            Geri
          </button>
        ) : (
          <div />
        )}

        {step < 3 ? (
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
