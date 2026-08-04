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
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

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

  // Sayfalama (Pagination) Hesaplamaları
  const totalCount = filteredInternships.length;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedInternships = filteredInternships.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSmartMatchToggle = () => {
    setCurrentPage(1);
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
      <div
        className="list-header"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 className="list-title" style={{ margin: 0 }}>
            {isCompany ? 'Şirketime Ait İlanlar' : 'Güncel Staj İlanları'}
          </h2>
          {/* Canlı İlan Sayısı Rozeti */}
          <span
            style={{
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#818cf8',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            {totalCount} İlan Bulundu
          </span>
        </div>
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
            setCurrentPage(1);
            setSearchTerm(e.target.value);
            onSearchChange?.(e.target.value);
          }}
        />

        <select
          className="filter-select"
          value={selectedType}
          onChange={(e) => {
            setCurrentPage(1);
            setSelectedType(e.target.value);
          }}
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
          onChange={(e) => {
            setCurrentPage(1);
            setSelectedEdu(e.target.value);
          }}
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
              setCurrentPage(1);
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

        {/* 🔄 Filtreleri Temizle Butonu (Filtrelerden biri değiştirildiğinde belirir) */}
        {(searchTerm ||
          selectedType !== 'ALL' ||
          selectedEdu !== 'ALL' ||
          onlyRemote ||
          isSmartMatchActive) && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setSearchTerm('');
              setSelectedType('ALL');
              setSelectedEdu('ALL');
              setOnlyRemote(false);
              setIsSmartMatchActive(false);
              setCurrentPage(1);
              onSearchChange?.('');
              onRemoteToggle?.(false);
            }}
            style={{
              padding: '6px 12px',
              fontSize: '13px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            🔄 Filtreleri Temizle
          </button>
        )}
      </div>

      {paginatedInternships.length > 0 ? (
        <>
          <div className="internships-grid">
            {paginatedInternships.map((internship) => (
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

          {/* Sayfalama (Pagination) Düğmeleri */}
          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                marginTop: '32px',
              }}
            >
              <button
                type="button"
                className="btn-secondary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                style={{ padding: '8px 14px', fontSize: '13px', borderRadius: '8px' }}
              >
                ← Önceki
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  style={{
                    padding: '8px 14px',
                    fontSize: '13px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: currentPage === pageNum ? '#4f46e5' : 'var(--bg-card)',
                    color: currentPage === pageNum ? '#ffffff' : 'var(--text-main)',
                    fontWeight: currentPage === pageNum ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                className="btn-secondary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                style={{ padding: '8px 14px', fontSize: '13px', borderRadius: '8px' }}
              >
                Sonraki →
              </button>
            </div>
          )}
        </>
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
