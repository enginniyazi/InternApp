import React, { useState } from 'react';
import { InternshipCard } from './InternshipCard';
import type { InternshipData } from './InternshipCard';
import './InternshipList.css';

interface InternshipListProps {
  internships: InternshipData[];
  isCompany?: boolean;
  studentProfile?: {
    educationLevel?: string;
    department?: string;
    internshipStatus?: string;
    skills?: string[];
  };
  onApply?: (id: string) => void;
  onEdit?: (internship: InternshipData) => void;
  onDelete?: (id: string) => void;
  onCreateNew?: () => void;
  onSearchChange?: (term: string) => void;
  onRemoteToggle?: (remote: boolean) => void;
}

export const InternshipList: React.FC<InternshipListProps> = ({
  internships,
  isCompany = false,
  studentProfile,
  onApply,
  onEdit,
  onDelete,
  onCreateNew,
  onSearchChange,
  onRemoteToggle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyRemote, setOnlyRemote] = useState(false);
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedEdu, setSelectedEdu] = useState('ALL');
  const [isSmartMatchActive, setIsSmartMatchActive] = useState(false);

  // ─── AKILLI EŞLEŞME FİLTRELEME & PUANLAMA ALGORİTMASI ───
  let processList = internships;

  if (isSmartMatchActive && studentProfile) {
    const studentEdu = studentProfile.educationLevel || 'BACHELOR';
    const studentDept = (studentProfile.department || '').toLowerCase();
    const studentStatus = studentProfile.internshipStatus;
    const studentSkills = (studentProfile.skills || []).map((s) => s.toLowerCase());

    processList = processList
      .filter((item) => {
        const itemTitle = item.title.toLowerCase();

        // Öğrenci Lisans / Yüksek Lisans ise: Başlığında "meslek lisesi" veya "lise" geçen ilanları KESİNLİKLE ele.
        if (studentEdu === 'BACHELOR' || studentEdu === 'MASTER_PHD') {
          if (
            itemTitle.includes('meslek lisesi') ||
            itemTitle.includes('lise stajyeri') ||
            itemTitle.includes('lise stajı')
          ) {
            return false;
          }
          if (
            item.targetEducationLevel === 'HIGH_SCHOOL' ||
            item.targetEducationLevel === 'ASSOCIATE'
          ) {
            return false;
          }
        }

        // Öğrenci Lise ise: Lisans/Yüksek Lisans ilanlarını ele.
        if (studentEdu === 'HIGH_SCHOOL') {
          if (
            item.targetEducationLevel === 'BACHELOR' ||
            item.targetEducationLevel === 'MASTER_PHD'
          ) {
            return false;
          }
        }

        // Eğer ilan belirli bir eğitim seviyesini hedefliyorsa ve öğrencininkiyle uyuşmuyorsa ele.
        if (
          item.targetEducationLevel &&
          item.targetEducationLevel !== 'ALL' &&
          item.targetEducationLevel !== studentEdu
        ) {
          return false;
        }

        return true;
      })
      .map((item) => {
        let score = 0;

        // a) Eğitim Seviyesi Tam Eşleşmesi
        if (item.targetEducationLevel === studentEdu) {
          score += 40;
        }

        // b) Staj Tipi (Zorunlu/Gönüllü) Eşleşmesi
        if (studentStatus && item.internshipType === studentStatus) {
          score += 25;
        }

        // c) Bölüm Eşleşmesi
        if (
          studentDept &&
          item.targetDepartments &&
          item.targetDepartments.some(
            (d) => d.toLowerCase().includes(studentDept) || studentDept.includes(d.toLowerCase())
          )
        ) {
          score += 25;
        }

        // d) Teknik Yetenek (Skills) Eşleşmesi
        if (studentSkills.length > 0 && item.requiredSkills) {
          item.requiredSkills.forEach((skill) => {
            if (
              studentSkills.some(
                (sSkill) =>
                  sSkill.includes(skill.toLowerCase()) || skill.toLowerCase().includes(sSkill)
              )
            ) {
              score += 15;
            }
          });
        }

        return { item, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);
  }

  const filteredInternships = processList.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.location.toLowerCase().includes(term) ||
      (item.requiredSkills && item.requiredSkills.some((s) => s.toLowerCase().includes(term)));

    const matchesRemote = onlyRemote ? item.isRemote === true : true;
    const matchesType = selectedType === 'ALL' ? true : item.internshipType === selectedType;
    const matchesEdu = selectedEdu === 'ALL' ? true : item.targetEducationLevel === selectedEdu;

    return matchesSearch && matchesRemote && matchesType && matchesEdu;
  });

  const handleSmartMatchToggle = () => {
    if (isSmartMatchActive) {
      setIsSmartMatchActive(false);
      setSelectedEdu('ALL');
    } else {
      setIsSmartMatchActive(true);
      const studentEdu = studentProfile?.educationLevel || 'BACHELOR';
      setSelectedEdu(studentEdu);
    }
  };

  return (
    <div className="internship-list-container">
      <div className="list-header">
        <h2 className="list-title">
          {isCompany ? 'Şirketime Ait İlanlar' : 'Güncel Staj İlanları'}
        </h2>
        {isCompany && onCreateNew && (
          <button type="button" className="btn-primary" onClick={onCreateNew}>
            + Yeni İlan Ekle
          </button>
        )}
      </div>

      <div className="filter-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Pozisyon, yetenek, açıklama veya şehir ara..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onSearchChange?.(e.target.value);
          }}
        />

        <select
          className="filter-select"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="ALL">Tüm Staj Tipleri</option>
          <option value="MANDATORY">Zorunlu Staj</option>
          <option value="VOLUNTARY">Gönüllü Staj</option>
          <option value="LONG_TERM">Uzun Dönem</option>
          <option value="SUMMER">Yaz Stajı</option>
        </select>

        <select
          className="filter-select"
          value={selectedEdu}
          onChange={(e) => setSelectedEdu(e.target.value)}
        >
          <option value="ALL">Tüm Eğitim Seviyeleri</option>
          <option value="BACHELOR">Lisans</option>
          <option value="ASSOCIATE">Önlisans (MYO)</option>
          <option value="HIGH_SCHOOL">Lise / Meslek</option>
          <option value="MASTER_PHD">Yüksek Lisans / Doktora</option>
        </select>

        <label className="remote-toggle">
          <input
            type="checkbox"
            checked={onlyRemote}
            onChange={(e) => {
              setOnlyRemote(e.target.checked);
              onRemoteToggle?.(e.target.checked);
            }}
          />
          Remote
        </label>

        {!isCompany && (
          <button
            type="button"
            className={`smart-match-btn ${isSmartMatchActive ? 'active' : ''}`}
            onClick={handleSmartMatchToggle}
            title="Profil eğitim seviyenize en uygun ilanları süzün"
          >
            {isSmartMatchActive ? '✨ Tüm İlanları Göster' : '✨ Bana Uygun İlanlar'}
          </button>
        )}
      </div>

      {filteredInternships.length > 0 ? (
        <div className="internships-grid">
          {filteredInternships.map((internship) => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              isOwner={isCompany}
              onApply={onApply}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>Henüz İlan Bulunamadı</h3>
          <p>Arama kriterlerinizi değiştirerek tekrar deneyebilirsiniz.</p>
        </div>
      )}
    </div>
  );
};
