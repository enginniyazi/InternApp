import React from 'react';
import './InternshipCard.css';

export type InternshipType = 'MANDATORY' | 'VOLUNTARY' | 'LONG_TERM' | 'SUMMER';
export type EducationLevel = 'HIGH_SCHOOL' | 'ASSOCIATE' | 'BACHELOR' | 'MASTER_PHD' | 'ALL';
export type WorkModel = 'REMOTE' | 'HYBRID' | 'ON_SITE';
export type StipendType = 'UNPAID' | 'MINIMUM_WAGE' | 'ABOVE_MINIMUM' | 'SCHOLARSHIP';
export type ReturnOfferProbability = 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';

export interface InternshipData {
  id: string;
  title: string;
  description: string;
  location: string;
  isRemote: boolean;
  requirements: string[];
  createdAt: string;

  internshipType?: InternshipType;
  targetEducationLevel?: EducationLevel;
  targetDepartments?: string[];
  targetGrades?: number[];
  weeklyDays?: number;
  durationWeeks?: number;
  workModel?: WorkModel;
  city?: string;
  district?: string;
  stipendType?: StipendType;
  hasMealAllowance?: boolean;
  hasTransportation?: boolean;
  hasEquipment?: boolean;
  returnOfferProbability?: ReturnOfferProbability;
  requiredSkills?: string[];
  languageRequirements?: string;
  applicationDeadline?: string;
  expectedStartDate?: string;
  quota?: number;

  company?: {
    companyName?: string;
    logoUrl?: string;
  };
}

interface InternshipCardProps {
  internship: InternshipData;
  isOwner?: boolean;
  onApply?: (id: string) => void;
  onEdit?: (internship: InternshipData) => void;
  onDelete?: (id: string) => void;
}

const TYPE_LABELS: Record<InternshipType, string> = {
  MANDATORY: 'Zorunlu Staj',
  VOLUNTARY: 'Gönüllü Staj',
  LONG_TERM: 'Uzun Dönem',
  SUMMER: 'Yaz Stajı',
};

const EDU_LABELS: Record<EducationLevel, string> = {
  HIGH_SCHOOL: 'Lise / Meslek',
  ASSOCIATE: 'Önlisans (MYO)',
  BACHELOR: 'Lisans',
  MASTER_PHD: 'Yüksek Lisans / Doktora',
  ALL: 'Tüm Seviyeler',
};

const STIPEND_LABELS: Record<StipendType, string> = {
  UNPAID: 'Ücretsiz / Deneyim',
  MINIMUM_WAGE: 'Asgari Ücret',
  ABOVE_MINIMUM: 'Asgari Ücret Üstü',
  SCHOLARSHIP: 'Burs Destekli',
};

export const InternshipCard: React.FC<InternshipCardProps> = ({
  internship,
  isOwner = false,
  onApply,
  onEdit,
  onDelete,
}) => {
  const [showDetailModal, setShowDetailModal] = React.useState(false);

  const companyInitial = internship.company?.companyName
    ? internship.company.companyName.charAt(0).toUpperCase()
    : 'Ş';

  const formattedDate = new Date(internship.createdAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <>
      <div className="internship-card">
        <div>
          <div className="card-header">
            <div className="company-info">
              <div className="company-logo-placeholder">{companyInitial}</div>
              <span className="company-name">
                {internship.company?.companyName || 'Anonim Şirket'}
              </span>
            </div>
            <div className="badge-group">
              {internship.internshipType && (
                <span className="badge badge-type">
                  🎓 {TYPE_LABELS[internship.internshipType]}
                </span>
              )}
              <span className="badge badge-location">
                📍 {internship.city || internship.location}
              </span>
              {internship.isRemote && <span className="badge badge-remote">🏠 Remote</span>}
            </div>
          </div>

          <h3 className="card-title" onClick={() => setShowDetailModal(true)}>
            {internship.title}
          </h3>
          <p className="card-description">{internship.description}</p>

          {/* Yan Haklar & Süre Özeti */}
          <div className="perks-row">
            {internship.durationWeeks && (
              <span className="perk-item">
                ⏳ {internship.durationWeeks} Hafta ({internship.weeklyDays || 5} Gün/Hafta)
              </span>
            )}
            {internship.stipendType && (
              <span className="perk-item">💰 {STIPEND_LABELS[internship.stipendType]}</span>
            )}
            {internship.hasMealAllowance && <span className="perk-item">🍲 Yemek Kartı</span>}
            {internship.hasTransportation && <span className="perk-item">🚌 Servis</span>}
            {internship.hasEquipment && <span className="perk-item">💻 Şirket Bilgisayarı</span>}
          </div>

          {/* Yetenek Etiketleri */}
          {((internship.requiredSkills && internship.requiredSkills.length > 0) ||
            (internship.requirements && internship.requirements.length > 0)) && (
            <div className="requirements-list">
              {(internship.requiredSkills?.length
                ? internship.requiredSkills
                : internship.requirements
              ).map((req, idx) => (
                <span key={idx} className="requirement-tag">
                  #{req}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="card-footer">
          <span className="posted-date">Yayınlanma: {formattedDate}</span>

          <div className="action-btns">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowDetailModal(true)}
            >
              Detayları Gör
            </button>
            {isOwner ? (
              <>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => onEdit && onEdit(internship)}
                >
                  Düzenle
                </button>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => onDelete && onDelete(internship.id)}
                >
                  Sil
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn-primary"
                onClick={() => onApply && onApply(internship.id)}
              >
                Başvur
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Detay Modalı */}
      {showDetailModal && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content detail-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{internship.title}</h2>
                <p className="subtitle">{internship.company?.companyName || 'Anonim Şirket'}</p>
              </div>
              <button type="button" className="close-btn" onClick={() => setShowDetailModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body detail-modal-body">
              <div className="detail-grid">
                <div className="detail-box">
                  <span className="detail-label">Staj Tipi</span>
                  <span className="detail-value">
                    {internship.internshipType
                      ? TYPE_LABELS[internship.internshipType]
                      : 'Zorunlu / Gönüllü'}
                  </span>
                </div>
                <div className="detail-box">
                  <span className="detail-label">Eğitim Seviyesi</span>
                  <span className="detail-value">
                    {internship.targetEducationLevel
                      ? EDU_LABELS[internship.targetEducationLevel]
                      : 'Tüm Seviyeler'}
                  </span>
                </div>
                <div className="detail-box">
                  <span className="detail-label">Çalışma Şekli</span>
                  <span className="detail-value">
                    {internship.isRemote ? 'Uzaktan (Remote)' : 'Ofiste / Hibrit'}
                  </span>
                </div>
                <div className="detail-box">
                  <span className="detail-label">Maaş & Ücret</span>
                  <span className="detail-value">
                    {internship.stipendType
                      ? STIPEND_LABELS[internship.stipendType]
                      : 'Belirtilmedi'}
                  </span>
                </div>
                <div className="detail-box">
                  <span className="detail-label">Lokasyon</span>
                  <span className="detail-value">{internship.location}</span>
                </div>
                <div className="detail-box">
                  <span className="detail-label">Kontenjan</span>
                  <span className="detail-value">{internship.quota || 1} Kişi</span>
                </div>
              </div>

              {internship.targetDepartments && internship.targetDepartments.length > 0 && (
                <div className="detail-section">
                  <h4>🎯 Hedef Bölümler</h4>
                  <p>{internship.targetDepartments.join(', ')}</p>
                </div>
              )}

              <div className="detail-section">
                <h4>📄 İlan Açıklaması</h4>
                <p>{internship.description}</p>
              </div>

              {internship.languageRequirements && (
                <div className="detail-section">
                  <h4>🗣️ Yabancı Dil Beklentisi</h4>
                  <p>{internship.languageRequirements}</p>
                </div>
              )}

              <div className="detail-section">
                <h4>🎁 İmkânlar ve Yan Haklar</h4>
                <div className="perks-tags">
                  {internship.hasMealAllowance && (
                    <span className="perk-badge">🍲 Yemek Kartı</span>
                  )}
                  {internship.hasTransportation && (
                    <span className="perk-badge">🚌 Servis / Ulaşım</span>
                  )}
                  {internship.hasEquipment && (
                    <span className="perk-badge">💻 Şirket Bilgisayarı</span>
                  )}
                  {internship.returnOfferProbability === 'HIGH' && (
                    <span className="perk-badge high-return">⭐ Yüksek İşe Alım İmkânı</span>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowDetailModal(false)}
              >
                Kapat
              </button>
              {!isOwner && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    setShowDetailModal(false);
                    onApply && onApply(internship.id);
                  }}
                >
                  Hemen Başvur
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
