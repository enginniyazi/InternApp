import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import type {
  InternshipData,
  InternshipType,
  EducationLevel,
  WorkModel,
  StipendType,
  ReturnOfferProbability,
} from './InternshipCard';
import './InternshipFormModal.css';

const internshipSchema = z.object({
  title: z.string().min(3, 'İlan başlığı en az 3 karakter olmalıdır.'),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalıdır.'),
  location: z.string().min(2, 'Lokasyon alanı boş bırakılamaz.'),
  isRemote: z.boolean(),
  requirements: z.array(z.string()),

  internshipType: z.enum(['MANDATORY', 'VOLUNTARY', 'GRADUATE', 'PART_TIME']),
  targetEducationLevel: z.enum(['HIGH_SCHOOL', 'ASSOCIATE', 'BACHELOR', 'MASTER_PHD', 'ALL']),
  targetDepartments: z.array(z.string()),
  weeklyDays: z.number().min(1).max(7),
  durationWeeks: z.number().min(1),
  workModel: z.enum(['REMOTE', 'HYBRID', 'ON_SITE']),
  city: z.string().min(2),
  stipendType: z.enum(['UNPAID', 'MINIMUM_WAGE', 'ABOVE_MINIMUM']),
  hasMealAllowance: z.boolean(),
  hasTransportation: z.boolean(),
  hasEquipment: z.boolean(),
  returnOfferProbability: z.enum(['HIGH', 'MEDIUM', 'LOW', 'NONE']),
  requiredSkills: z.array(z.string()),
  languageRequirements: z.string().optional(),
  quota: z.number().min(1),
});

export type InternshipFormData = z.infer<typeof internshipSchema>;

interface InternshipFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InternshipFormData) => Promise<void> | void;
  initialData?: InternshipData | null;
  isLoading?: boolean;
}

export const InternshipFormModal: React.FC<InternshipFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'academic' | 'perks'>('basic');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isRemote, setIsRemote] = useState(false);
  const [city, setCity] = useState('İstanbul');
  const [requirementsInput, setRequirementsInput] = useState('');

  const [internshipType, setInternshipType] = useState<InternshipType>('MANDATORY');
  const [targetEducationLevel, setTargetEducationLevel] = useState<EducationLevel>('BACHELOR');
  const [targetDepartmentsInput, setTargetDepartmentsInput] = useState('');
  const [weeklyDays, setWeeklyDays] = useState(5);
  const [durationWeeks, setDurationWeeks] = useState(12);
  const [workModel, setWorkModel] = useState<WorkModel>('HYBRID');

  const [stipendType, setStipendType] = useState<StipendType>('MINIMUM_WAGE');
  const [hasMealAllowance, setHasMealAllowance] = useState(true);
  const [hasTransportation, setHasTransportation] = useState(true);
  const [hasEquipment, setHasEquipment] = useState(true);
  const [returnOfferProbability, setReturnOfferProbability] =
    useState<ReturnOfferProbability>('MEDIUM');
  const [requiredSkillsInput, setRequiredSkillsInput] = useState('');
  const [languageRequirements, setLanguageRequirements] = useState('');
  const [quota, setQuota] = useState(1);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setLocation(initialData.location || '');
      setIsRemote(initialData.isRemote ?? false);
      setCity(initialData.city || 'İstanbul');
      setRequirementsInput(initialData.requirements ? initialData.requirements.join(', ') : '');

      let mappedType = initialData.internshipType as string;
      if (mappedType === 'LONG_TERM' || mappedType === 'SUMMER' || !mappedType) {
        mappedType = 'MANDATORY';
      }
      setInternshipType(mappedType as InternshipType);

      let mappedStipend = initialData.stipendType as string;
      if (mappedStipend === 'SCHOLARSHIP' || !mappedStipend) {
        mappedStipend = 'MINIMUM_WAGE';
      }
      setStipendType(mappedStipend as StipendType);
      setHasMealAllowance(initialData.hasMealAllowance ?? true);
      setHasTransportation(initialData.hasTransportation ?? true);
      setHasEquipment(initialData.hasEquipment ?? true);
      setReturnOfferProbability(initialData.returnOfferProbability || 'MEDIUM');
      setRequiredSkillsInput(
        initialData.requiredSkills ? initialData.requiredSkills.join(', ') : ''
      );
      setLanguageRequirements(initialData.languageRequirements || '');
      setQuota(initialData.quota || 1);
    } else {
      setTitle('');
      setDescription('');
      setLocation('İstanbul');
      setIsRemote(false);
      setCity('İstanbul');
      setRequirementsInput('');
      setInternshipType('MANDATORY');
      setTargetEducationLevel('BACHELOR');
      setTargetDepartmentsInput('');
      setWeeklyDays(5);
      setDurationWeeks(12);
      setWorkModel('HYBRID');
      setStipendType('MINIMUM_WAGE');
      setHasMealAllowance(true);
      setHasTransportation(true);
      setHasEquipment(true);
      setReturnOfferProbability('MEDIUM');
      setRequiredSkillsInput('');
      setLanguageRequirements('');
      setQuota(1);
    }
    setErrors({});
    setActiveTab('basic');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const reqArray = requirementsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const skillsArray = requiredSkillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const deptArray = targetDepartmentsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const result = internshipSchema.safeParse({
      title,
      description,
      location: location || city,
      isRemote,
      requirements: reqArray,
      internshipType,
      targetEducationLevel,
      targetDepartments: deptArray,
      weeklyDays: Number(weeklyDays),
      durationWeeks: Number(durationWeeks),
      workModel,
      city,
      stipendType,
      hasMealAllowance,
      hasTransportation,
      hasEquipment,
      returnOfferProbability,
      requiredSkills: skillsArray,
      languageRequirements,
      quota: Number(quota),
    });

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    await onSubmit(result.data);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card advanced-modal-card">
        <div className="modal-header">
          <h3 className="modal-title">
            {initialData ? 'Staj İlanını Düzenle' : 'Yeni Staj İlanı Yayınla'}
          </h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Sekme Butonları */}
        <div className="form-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            1. Temel & Lokasyon
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'academic' ? 'active' : ''}`}
            onClick={() => setActiveTab('academic')}
          >
            2. Akademik & Şartlar
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'perks' ? 'active' : ''}`}
            onClick={() => setActiveTab('perks')}
          >
            3. Ücret & Yan Haklar
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {activeTab === 'basic' && (
            <div className="tab-content">
              <div className="form-group">
                <label className="form-label" htmlFor="modal-title">
                  İlan Başlığı *
                </label>
                <input
                  id="modal-title"
                  type="text"
                  className={`form-input ${errors.title ? 'has-error' : ''}`}
                  placeholder="Örn: Frontend Developer Stajyeri"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="modal-description">
                  İlan Açıklaması *
                </label>
                <textarea
                  id="modal-description"
                  className={`form-textarea ${errors.description ? 'has-error' : ''}`}
                  placeholder="Staj rolü, sorumluluklar ve aranan nitelikler..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="modal-city">
                    Şehir / İl
                  </label>
                  <input
                    id="modal-city"
                    type="text"
                    className="form-input"
                    placeholder="Örn: İstanbul"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (!location) setLocation(e.target.value);
                    }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="modal-location">
                    Detay Adres / Ofis Konumu
                  </label>
                  <input
                    id="modal-location"
                    type="text"
                    className="form-input"
                    placeholder="Örn: Maslak / Teknokent"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Çalışma Modeli</label>
                  <select
                    className="form-input"
                    value={workModel}
                    onChange={(e) => {
                      const val = e.target.value as WorkModel;
                      setWorkModel(val);
                      setIsRemote(val === 'REMOTE');
                    }}
                  >
                    <option value="HYBRID">Hibrit (Ofis + Ev)</option>
                    <option value="REMOTE">Uzaktan (Remote)</option>
                    <option value="ON_SITE">Ofiste (Yerinde)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Kontenjan (Stajyer Sayısı)</label>
                  <input
                    type="number"
                    className="form-input"
                    min={1}
                    value={quota}
                    onChange={(e) => setQuota(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="tab-content">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Staj Tipi</label>
                  <select
                    className="form-input"
                    value={internshipType}
                    onChange={(e) => setInternshipType(e.target.value as InternshipType)}
                  >
                    <option value="MANDATORY">Zorunlu Okul Stajı</option>
                    <option value="VOLUNTARY">Gönüllü Staj</option>
                    <option value="GRADUATE">Mezuniyet Stajı</option>
                    <option value="PART_TIME">Yarı Zamanlı (Part-Time)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Hedef Eğitim Seviyesi</label>
                  <select
                    className="form-input"
                    value={targetEducationLevel}
                    onChange={(e) => setTargetEducationLevel(e.target.value as EducationLevel)}
                  >
                    <option value="BACHELOR">Lisans Öğrencileri</option>
                    <option value="ASSOCIATE">Önlisans (MYO)</option>
                    <option value="HIGH_SCHOOL">Lise / Meslek Lisesi</option>
                    <option value="MASTER_PHD">Yüksek Lisans / Doktora</option>
                    <option value="ALL">Tüm Seviyeler</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="modal-depts">
                  Hedef Bölümler (Virgülle ayırın)
                </label>
                <input
                  id="modal-depts"
                  type="text"
                  className="form-input"
                  placeholder="Bilgisayar Mühendisliği, Yazılım Mühendisliği, YBS"
                  value={targetDepartmentsInput}
                  onChange={(e) => setTargetDepartmentsInput(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Haftalık Katılım (Gün)</label>
                  <input
                    type="number"
                    className="form-input"
                    min={1}
                    max={7}
                    value={weeklyDays}
                    onChange={(e) => setWeeklyDays(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Staj Süresi (Hafta)</label>
                  <input
                    type="number"
                    className="form-input"
                    min={1}
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="modal-lang">
                  Yabancı Dil Beklentisi
                </label>
                <input
                  id="modal-lang"
                  type="text"
                  className="form-input"
                  placeholder="Örn: İngilizce (İleri Düzey Okuma & Yazma)"
                  value={languageRequirements}
                  onChange={(e) => setLanguageRequirements(e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === 'perks' && (
            <div className="tab-content">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Maaş / Ücret Durumu</label>
                  <select
                    className="form-input"
                    value={stipendType}
                    onChange={(e) => setStipendType(e.target.value as StipendType)}
                  >
                    <option value="MINIMUM_WAGE">Asgari Ücret (Yasal Staj Ücreti)</option>
                    <option value="ABOVE_MINIMUM">Asgari Ücret Üstü Maaş</option>
                    <option value="SCHOLARSHIP">Burs / Eğitim Desteği</option>
                    <option value="UNPAID">Ücretsiz (Deneyim Odaklı)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Staj Sonrası İşe Alım İmkânı</label>
                  <select
                    className="form-input"
                    value={returnOfferProbability}
                    onChange={(e) =>
                      setReturnOfferProbability(e.target.value as ReturnOfferProbability)
                    }
                  >
                    <option value="HIGH">⭐ Yüksek İhtimal (Başarılı Stajyerler İşe Alınır)</option>
                    <option value="MEDIUM">Orta Seviye (Kadro Açığına Bağlı)</option>
                    <option value="LOW">Düşük</option>
                    <option value="NONE">Yok (Sadece Staj Programı)</option>
                  </select>
                </div>
              </div>

              <div className="form-group checkboxes-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={hasMealAllowance}
                    onChange={(e) => setHasMealAllowance(e.target.checked)}
                  />
                  🍲 Yemek Kartı / Sodexo / Multinet Sağlanıyor
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={hasTransportation}
                    onChange={(e) => setHasTransportation(e.target.checked)}
                  />
                  🚌 Servis / Ulaşım Desteği Sağlanıyor
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={hasEquipment}
                    onChange={(e) => setHasEquipment(e.target.checked)}
                  />
                  💻 Şirket Bilgisayarı / Ekipman Desteği Veriliyor
                </label>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="modal-skills">
                  Aranan Yetenekler (Virgülle ayırın)
                </label>
                <input
                  id="modal-skills"
                  type="text"
                  className="form-input"
                  placeholder="React, TypeScript, Node.js, Git, Figma"
                  value={requiredSkillsInput}
                  onChange={(e) => setRequiredSkillsInput(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isLoading}>
              İptal
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Kaydediliyor...' : 'Kaydet ve Yayınla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
