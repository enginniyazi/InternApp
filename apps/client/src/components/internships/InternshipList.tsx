import React, { useState } from 'react';
import { InternshipCard } from './InternshipCard';
import type { InternshipData } from './InternshipCard';
import './InternshipList.css';

interface InternshipListProps {
  internships: InternshipData[];
  isCompany?: boolean;
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

  const filteredInternships = internships.filter((item) => {
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
            className={`smart-match-btn ${selectedEdu === 'BACHELOR' ? 'active' : ''}`}
            onClick={() => {
              if (selectedEdu === 'BACHELOR') {
                setSelectedEdu('ALL');
              } else {
                setSelectedEdu('BACHELOR');
              }
            }}
            title="Profil eğitim seviyenize en uygun ilanları süzün"
          >
            ✨ Bana Uygun İlanlar
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
