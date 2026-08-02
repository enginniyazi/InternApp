# MVP Plan Revize

## Genel Bakış

- **Hedef**: Öğrencinin staj ilanlarını görmesi, başvurması ve şirketin başvuruyu değerlendirmesi döngüsünü hızlı ve kararlı şekilde hayata geçirmek.
- **Başarı Kriterleri**:
  - 10.000+ aktif öğrenci kullanıcı.
  - Ortalama yanıt süresi < 2 s.
  - %99+ API uptime.
- **Mimari**: Clean Architecture (entity‑use‑case‑adapter), NestJS (Node.js) + Prisma + PostgreSQL, React (Vite) + Vanilla CSS (glassmorphism, dark‑mode, mikro‑animasyonlar).
- **Kalite**: Katı derleme (`tsc --noEmit`), ESLint + Prettier, unit / integration / e2e testleri, CI/CD otomasyonu.

---

## Aşamalı Revize Plan (Hafta 1‑10)

### 1. Hafta – Mimari & Proje Kurulumu

- Monorepo (Nx/Turborepo) oluştur.
- NestJS `nest new server --package-manager npm` ve Vite React `npm create vite@latest client --template react-ts`.
- Prisma şeması oluştur, ilk migration.
- ESLint, Prettier, Husky pre‑commit hookları.
- Dockerfile & docker‑compose temel yapı.

### 2. Hafta – Kimlik Doğrulama & Kullanıcı Yönetimi

- JWT + Refresh‑Token akışı, `RolesGuard` ile rol‑bazlı erişim.
- DTO + class‑validator ile sunucu tarafı doğrulama.
- Zod ile istemci tarafı form doğrulama, yeniden kullanılabilir `AuthForm` komponenti.

### 3. Hafta – Şirket Paneli (İlan Yönetimi)

- Use‑case katmanı: `CreateInternship`, `UpdateInternship`, `DeleteInternship`.
- Swagger UI üzerinden API dokümantasyonu.
- Front‑end: kart‑stili ilan listesi, glassmorphism CSS.

### 4. Hafta – Öğrenci Profili & CV Yükleme

- Multer + MinIO (lokal S3) entegrasyonu, PDF upload.
- Dosya boyutu & MIME tipi kontrolü.
- Profil sihirbazı (step‑by‑step) mikro‑animasyonlar.

### 5. Hafta – Başvuru Akışı & E‑posta Bildirimleri

- `applyToInternship` servisi (tek başvuru kontrolü).
- Nodemailer + Mailpit test SMTP.
- MJML ile responsive e‑posta şablonu.

### 6. Hafta – Admin Paneli & Manuel Onay

- Admin guard (admin rolü).
- Şirket onay modal‑i, audit log tablosu.
- Basit istatistikler (kullanıcı/ilan sayısı).

### 7. Hafta – UI/UX Cilalama & Erişilebilirlik

- `a11y‑debugging` skill’i ile WCAG kontrolü, ARIA ve odak yönetimi.
- Dark‑mode toggle (CSS custom properties).
- Toast mesajları (`react-hot-toast`).
- Mikro‑animasyonlu butonlar, hover efektleri.

### 8. Hafta – Docker, CI/CD & Deployment

- Backend ve client için multi‑stage Dockerfile.
- `docker-compose.yml` (Postgres, Redis, MinIO, backend, client, Nginx).
- GitHub Actions: lint → test → build → docker‑push → SSH‑deploy Hetzner.
- Winston loglama, health‑check endpoint.

### 9. Hafta – Veri Girişi & Beta Testi

- Prisma seed script’iyle örnek şirket/ilan verisi.
- Cypress e2e testleri (tam öğrenci‑şirket akışı).
- Beta kullanıcılar (10‑20 kişi) ile geribildirim toplama.

### 10. Hafta – Lansman Hazırlığı

- `react-helmet-async` + JSON‑LD yapılandırması, sitemap.xml, robots.txt.
- Google Lighthouse auditı, LCP/INP iyileştirmeleri.
- Release notes, kısa demo video (browser‑subagent ile kaydedilebilir).

---

## Ek Hızlı Kazanımlar

- **Statik tip güvenliği**: `tsconfig.json` `strict` modu.
- **GitHub Issue Templates**: `.github/ISSUE_TEMPLATE/*.md`.
- **Feature Flags**: `react-feature-flags` ile yeni UI parçalarını kontrol.
- **Performans Bütçesi**: `vite-plugin-performance-budget`.
- **Analytics Event Schema**: JSON şeması + `analytics.ts`.

---

## Sonraki Adımlar

1. Bu revize planı onaylayın; gerekiyorsa haftalık teslimatları yeniden ayarlayabiliriz.
2. Örnek kod (NestJS Guard, Prisma şeması, glass‑morphism CSS) ya da başlangıç repo yapısı ister misiniz?
3. Premium UI mock‑up ihtiyacınız varsa `generate_image` aracıyla oluşturabiliriz.

**Başarılar!**
