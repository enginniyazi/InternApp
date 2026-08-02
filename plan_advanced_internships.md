# 🚀 Gelişmiş İlan Mimarisi & Akıllı Eşleşme Geliştirme Planı

Bu döküman, StajApp platformundaki ilan yönetimi (Internship Entity) yapısını yüzeysel kalmayacak şekilde uçtan uca profesyonel seviyeye taşıma adımlarını içerir.

---

## 1. Veri Modeli Genişletme (Prisma & DB)

İlan şemasına (`schema.prisma`) eklenen yeni alanlar:

### A. Akademik & Eğitim Seviyesi

- `internshipType`: `MANDATORY` (Zorunlu), `VOLUNTARY` (Gönüllü), `LONG_TERM` (Uzun Dönem), `SUMMER` (Yaz Stajı)
- `targetEducationLevel`: `HIGH_SCHOOL` (Lise/Meslek Lisesi), `ASSOCIATE` (Önlisans/MYO), `BACHELOR` (Lisans), `MASTER_PHD` (Yüksek Lisans/Doktora), `ALL` (Tümü)
- `targetDepartments`: `String[]` (Örn: `["Bilgisayar Mühendisliği", "Yazılım Mühendisliği", "YBS"]`)
- `targetGrades`: `Int[]` (Örn: `[3, 4]` -> 3. ve 4. Sınıflar)

### B. Çalışma Lojistiği & Şartlar

- `weeklyDays`: `Int` (Örn: `3` -> Haftada 3 gün)
- `durationWeeks`: `Int` (Örn: `12` -> 12 Hafta / 3 Ay)
- `workModel`: `REMOTE`, `HYBRID`, `ON_SITE`
- `city`: `String` (İl)
- `district`: `String?` (İlçe)

### C. Ücret & Yan Haklar (Compensation & Benefits)

- `stipendType`: `UNPAID` (Ücretsiz), `MINIMUM_WAGE` (Asgari Ücret / Yasal), `ABOVE_MINIMUM` (Asgari Ücret Üstü), `SCHOLARSHIP` (Burs)
- `hasMealAllowance`: `Boolean` (Yemek Kartı / Sodexo vb.)
- `hasTransportation`: `Boolean` (Servis / Ulaşım)
- `hasEquipment`: `Boolean` (Laptop / Ekipman)
- `returnOfferProbability`: `HIGH`, `MEDIUM`, `LOW`, `NONE` (Staj sonrası iş imkanı tahmini)

### D. Beklentiler & Yetenekler

- `requiredSkills`: `String[]` (Örn: `["React", "TypeScript", "Node.js"]`)
- `languageRequirements`: `String?` (Örn: "İngilizce (İleri Düzey)")

### E. Zamanlama & Kontenjan

- `applicationDeadline`: `DateTime?`
- `expectedStartDate`: `DateTime?`
- `quota`: `Int` (Alınacak stajyer sayısı, varsayılan 1)

---

## 2. Fazlar & Uygulama Sırası

- [ ] **FAZ 1: Prisma Şeması & Enums Güncellemesi**
  - Enums (`InternshipType`, `EducationLevel`, `WorkModel`, `StipendType`, `ReturnOfferProbability`) eklenmesi.
  - `schema.prisma` güncellenmesi ve migration oluşturulması.

- [ ] **FAZ 2: Backend Servis Katmanı & DTO'lar (NestJS)**
  - `create-internship.dto.ts` ve `update-internship.dto.ts` DTO'larının class-validator ile eksiksiz güncellenmesi.
  - `filter-internships.dto.ts` filtre DTO'sunun yeni alanlarla (staj tipi, eğitim seviyesi, şehir vb.) genişletilmesi.
  - `internships.service.ts` sorgularının dinamik filtrelere uyarlanması.

- [ ] **FAZ 3: Frontend Tip Tanımları & Servisler (React)**
  - `InternshipCard.tsx` ve `InternshipFormModal.tsx` içindeki arayüz (Interface) tanımlarının güncellenmesi.
  - `internshipService.ts` API çağrılarının yeni parametreleri desteklemesi.

- [ ] **FAZ 4: İlan Ekleme/Düzenleme Form Modalı (`InternshipFormModal.tsx`)**
  - Formun multi-tab / adımlı (Tab 1: Genel & Konum, Tab 2: Akademik & Şartlar, Tab 3: Ücret & Yan Haklar & Yetenekler) olarak yeniden tasarlanması.
  - Tüm yeni alanlar için validation ve girdi elemanları eklenmesi.

- [ ] **FAZ 5: İlan Kartı & Detay Görünümü (`InternshipCard.tsx`)**
  - Rozetler (Badge): Staj Tipi, Yan Haklar (Yemek, Servis, Laptop), Süre, Şehir.
  - Detay Modalı / Açılır Paneli: İlanın tüm şartlarının şık visual kartlarla sunumu.

- [ ] **FAZ 6: Gelişmiş Arama & Filtreleme Barı (`InternshipList.tsx`)**
  - Şehir seçimi, Staj Tipi filtresi, Remote/Hybrid filtresi, Eğitim Seviyesi süzgeci.

- [ ] **FAZ 7: Seed Verilerinin 30 Adet Detaylı İlan ile Güncellenmesi**
  - Tüm bu yeni alanları içeren 30 adet zengin, gerçekçi ilan verisinin seed dosyasına işlenmesi.
