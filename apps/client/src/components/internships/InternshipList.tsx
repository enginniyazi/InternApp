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

  const filteredInternships = internships.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRemote = onlyRemote ? item.isRemote === true : true;

    return matchesSearch && matchesRemote;
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
          placeholder="Pozisyon, açıklama veya şehir ara..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onSearchChange?.(e.target.value);
          }}
        />
        <label className="remote-toggle">
          <input
            type="checkbox"
            checked={onlyRemote}
            onChange={(e) => {
              setOnlyRemote(e.target.checked);
              onRemoteToggle?.(e.target.checked);
            }}
          />
          Sadece Uzaktan (Remote)
        </label>
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
