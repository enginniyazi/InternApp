# StajApp — Mevcut Durum Analizi ve Yol Haritası

> Son güncelleme: 2026-08-01

---

## 1. Mevcut Durumun Dürüst Özeti

### Backend (NestJS) — ✅ İskelet Hazır

Backend tarafında modüller, controller'lar, service'ler, DTO'lar, guard'lar ve
Prisma şeması yazılmış durumda. Yapısal olarak aşağıdakiler mevcut:

| Modül            | Endpointler                                                     | Durum      |
| ---------------- | --------------------------------------------------------------- | ---------- |
| **Auth**         | `POST /auth/register`, `login`, `refresh`, `logout`, `GET /me`  | ✅ Yazıldı |
| **Internships**  | `CRUD /internships`, `GET /internships/my`                      | ✅ Yazıldı |
| **Applications** | `POST /applications`, `GET student/company`, `PATCH :id/status` | ✅ Yazıldı |
| **Profiles**     | `GET/PATCH student/company`, `POST student/cv`                  | ✅ Yazıldı |
| **Admin**        | `GET /admin/stats`, `GET /admin/companies`, `PATCH approve`     | ✅ Yazıldı |
| **Mail**         | Nodemailer ile başvuru ve durum bildirimi                       | ✅ Yazıldı |
| **Storage**      | PDF CV yükleme (5MB limit, UUID dosya adı)                      | ✅ Yazıldı |
| **Health**       | `GET /health`                                                   | ✅ Yazıldı |

### Frontend (React/Vite) — ⚠️ Tamamen Sahte (Mock)

> [!CAUTION]
> Frontend'te **hiçbir backend bağlantısı yok.** Projenin hiçbir dosyasında
> `fetch()`, `axios` veya herhangi bir HTTP çağrısı bulunmuyor.

| Bileşen                    | Backend Bağlantısı | Mock Veri | Kalıcı Veri                    |
| -------------------------- | ------------------ | --------- | ------------------------------ |
| `App.tsx`                  | ❌ Yok             | ✅ Evet   | Sadece tema, rol, sekme        |
| `AuthForm.tsx`             | ❌ Yok             | ❌        | ❌                             |
| `InternshipList.tsx`       | ❌ Yok             | ❌        | ❌                             |
| `InternshipCard.tsx`       | ❌ Yok             | ❌        | ❌                             |
| `InternshipFormModal.tsx`  | ❌ Yok             | ❌        | ❌                             |
| `ProfileWizard.tsx`        | ❌ Yok             | ❌        | ❌ (CV upload prop geçilmemiş) |
| `StudentApplicationsList`  | ❌ Yok             | ❌        | ❌                             |
| `CompanyApplicationsModal` | ❌ Yok             | ❌        | ❌ (internshipTitle hardcoded) |
| `AdminDashboard.tsx`       | ❌ Yok             | ✅ Evet   | ❌ (istatistikler sabit sayı)  |
| `ToastContainer.tsx`       | ❌ Yok             | ❌        | ❌                             |

**Sonuç:** Kullanıcı herhangi bir işlem yapıp sayfayı yenilediğinde
(ilan ekleme, başvuru yapma, durum güncelleme) her şey sıfırlanıyor.
Uygulama şu an bir **interaktif demo/mockup**, çalışan bir ürün değil.

### Altyapı — ✅ Hazır ama Test Edilmemiş

- Docker Compose: Postgres + Mailpit + Server + Client tanımlı
- CI/CD: lint, format, reuse, test, build adımları tanımlı
- Prisma seed: 4 kullanıcı, 2 ilan, 1 başvuru hazır
- `.env` dosyası var ama `.env.example` şablonu yok

---

## 2. Temel Sorunlar Listesi

### Kritik (Uygulama çalışmıyor)

| #   | Sorun                                                | Etki                                       |
| --- | ---------------------------------------------------- | ------------------------------------------ |
| K1  | Frontend'te hiçbir API çağrısı yok                   | Tüm veriler sahte, hiçbir şey kalıcı değil |
| K2  | Gerçek auth akışı yok (login her zaman başarılı)     | Kimlik doğrulama çalışmıyor                |
| K3  | JWT token yönetimi yok (saklama, gönderme, yenileme) | Korumalı endpointlere erişim mümkün değil  |
| K4  | İlan CRUD işlemleri backend'e gitmiyor               | İlanlar kaybolur                           |
| K5  | Başvuru işlemleri backend'e gitmiyor                 | Başvurular kaybolur                        |
| K6  | Profil/CV güncelleme backend'e gitmiyor              | Profil bilgileri kaybolur                  |
| K7  | Admin dashboard sabit sayılar gösteriyor             | Gerçek istatistik yok                      |

### Önemli (Kullanılabilirlik)

| #   | Sorun                                                 | Etki                                             |
| --- | ----------------------------------------------------- | ------------------------------------------------ |
| Ö1  | Vite proxy ayarı yok                                  | Frontend → Backend iletişim kurulamaz            |
| Ö2  | HTTP istemci kütüphanesi yok (axios/fetch wrapper)    | API çağrıları için altyapı eksik                 |
| Ö3  | Global hata yakalama yok                              | API hataları kullanıcıya gösterilmiyor           |
| Ö4  | Loading state'leri eksik                              | API çağrıları sırasında UI donuk kalıyor         |
| Ö5  | `.env.example` şablonu yok                            | Yeni geliştiriciler ortam kurulumunda kaybolur   |
| Ö6  | Rol seçici (select) hâlâ header'da duruyor            | Kullanıcı rolünü değiştirebilir (güvenlik açığı) |
| Ö7  | CompanyApplicationsModal'da hardcoded internshipTitle | Sadece tek bir ilan başlığı gösteriyor           |

---

## 3. Yol Haritası

### Faz 1 — API İstemci Altyapısı (Ön koşul)

> Bu faz tamamlanmadan diğer fazlara geçilmez.

- [x] **1.1** `vite.config.ts`'ye proxy ayarı ekle (`/api` → `http://localhost:3000`)
- [x] **1.2** `apps/client/src/lib/api.ts` oluştur — merkezi fetch wrapper
- [x] **1.3** `apps/client/src/lib/auth.ts` oluştur — token yönetimi
- [x] **1.4** `.env.example` dosyası oluştur (backend için)

### Faz 2 — Gerçek Kimlik Doğrulama

- [x] **2.1** `AuthForm.tsx` → `POST /auth/register` ve `POST /auth/login` çağrıları
- [x] **2.2** Başarılı login'de token'ları localStorage'a kaydet
- [x] **2.3** `App.tsx`'te uygulama açılışında `GET /auth/me` ile oturum doğrulama
- [x] **2.4** Oturum yoksa veya token geçersizse `GUEST` ekranına düşür
- [x] **2.5** Logout butonu ekle → `POST /auth/logout` çağrısı + token temizliği
- [x] **2.6** Header'daki test amaçlı rol seçiciyi (select) kaldır

### Faz 3 — İlan Yönetimi Entegrasyonu

- [x] **3.1** İlan listesini `GET /internships` ile çek (arama/filtre parametreleri dahil)
- [x] **3.2** Şirket ilanlarını `GET /internships/my` ile çek
- [x] **3.3** Yeni ilan oluşturma → `POST /internships`
- [x] **3.4** İlan güncelleme → `PATCH /internships/:id`
- [x] **3.5** İlan silme → `DELETE /internships/:id`
- [x] **3.6** Tüm mock ilan verilerini (`MOCK_INTERNSHIPS`) kaldır

### Faz 4 — Başvuru Akışı Entegrasyonu

- [x] **4.1** Staja başvur → `POST /applications`
- [x] **4.2** Öğrenci başvurularını listele → `GET /applications/student`
- [x] **4.3** Şirkete gelen başvuruları listele → `GET /applications/company`
- [x] **4.4** Başvuru durumu güncelle → `PATCH /applications/:id/status`
- [x] **4.5** Tüm mock başvuru verilerini (`MOCK_APPLICATIONS`, `MOCK_COMPANY_APPLICANTS`) kaldır
- [x] **4.6** `CompanyApplicationsModal`'daki hardcoded `internshipTitle`'ı düzelt

### Faz 5 — Profil ve CV Entegrasyonu

- [x] **5.1** Öğrenci profili getir → `GET /profiles/student`
- [x] **5.2** Öğrenci profili güncelle → `PATCH /profiles/student`
- [x] **5.3** CV yükle → `POST /profiles/student/cv` (multipart/form-data)
- [x] **5.4** Şirket profili getir/güncelle → `GET/PATCH /profiles/company`
- [x] **5.5** Mock profil verilerini kaldır

### Faz 6 — Admin Panel Entegrasyonu

- [x] **6.1** Gerçek istatistikler → `GET /admin/stats`
- [x] **6.2** Şirket listesi → `GET /admin/companies`
- [x] **6.3** Şirket onaylama → `PATCH /admin/companies/:id/approve`
- [x] **6.4** Mock istatistik ve şirket verilerini kaldır

### Faz 7 — UX İyileştirmeleri

- [x] **7.1** Tüm API çağrılarına loading spinner/skeleton ekle
- [x] **7.2** API hata mesajlarını Toast ile kullanıcıya göster
- [x] **7.3** Form submit sırasında butonları disable et (çift tıklama engeli)
- [x] **7.4** Sayfalama (pagination) / canlı filtreleme desteği
- [x] **7.5** Light mode'daki tüm renk/kontrast sorunlarını kontrol et ve düzelt

### Faz 8 — Uçtan Uca Test ve Doğrulama

- [x] **8.1** Docker Compose ile tüm sistemi ayağa kaldır
- [x] **8.2** `npx prisma migrate dev` ve `npx prisma db seed` çalıştır
- [x] **8.3** Kayıt → Giriş → İlan oluştur → Başvuru yap → Durum güncelle akışını test et
- [x] **8.4** Sayfa yenilemede verilerin kaybolmadığını doğrula
- [x] **8.5** Mail bildirimlerinin Mailpit'te göründüğünü doğrula
- [x] **8.6** CV yükleme ve indirme akışını test et

---

## 4. Öncelik Sırası

```
Faz 1 (API altyapısı) → Faz 2 (Auth) → Faz 3 (İlanlar) → Faz 4 (Başvurular)
→ Faz 5 (Profil/CV) → Faz 6 (Admin) → Faz 7 (UX) → Faz 8 (Test)
```

Her faz tamamlandığında:

1. `npm run lint && npm run format:check && npm run check:reuse` → 0 hata
2. `npm --prefix apps/server run test` → tüm testler geçer
3. `npm --prefix apps/client run build` → derleme başarılı

---

## 5. Notlar

- Backend endpointleri Swagger UI'dan test edilebilir: `http://localhost:3000/api/docs`
- Geliştirme sırasında backend `npm --prefix apps/server run start:dev`,
  frontend `npm --prefix apps/client run dev` ile çalıştırılır
- Veritabanı için PostgreSQL gerekli (Docker ile veya yerel kurulum)
- Mailpit web arayüzü: `http://localhost:8025`
