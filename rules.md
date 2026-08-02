# Proje Geliştirme Kuralları

## 1. Mimari & Tasarım

- **Clean Architecture** (entity‑use‑case‑adapter) her katmanda uygulanacak.
- Backend: **NestJS** + **Prisma** + **PostgreSQL**.
- Frontend: **React (Vite)**, **vanilla CSS** ile **glassmorphism**, **dark‑mode** ve **mikro‑animasyonlar**.
- Monorepo yapısı (**Nx** ya da **Turborepo**) kullanılacak, ortak paket yönetimi ve kod paylaşımı sağlanacak.

## 2. Kod Kalitesi

- TypeScript **strict** modu zorunlu, derleme sırasında `tsc --noEmit` çalıştırılacak.
- **ESLint + Prettier** kuralları, `husky` pre‑commit hookları ile zorunlu kılınacak.
- Katı derleme kuralları: hiçbir warning geçişe izin verilmeyecek.
- Yeni özellik **birim testi**, **entegrasyon testi** ve mümkünse **e2e testi** ile kapsanmalı.

## 3. Güvenlik

- JWT + Refresh‑Token akışı, kısa token süresi ve güvenli saklama.
- Parola hashing **bcrypt** ile yapılacak.
- Rol‑bazlı erişim kontrolü (`RolesGuard`) tüm korunan uç noktalarda kullanılacak.
- Rate‑limiting, CSP başlıkları ve HTTPS (Let’s Encrypt) zorunlu.
- **a11y‑debugging** skill’i ile WCAG uyumluluğu düzenli kontrol edilecek.

## 4. UI/UX

- Premium tasarım: **glassmorphism**, **mikro‑animasyon**, **dark‑mode toggle**.
- Responsive, mobile‑first yaklaşımla tüm ekran boyutlarında tutarlı görünüm.
- Toast mesajları (`react‑hot‑toast`) ve animasyonlu butonlar kullanılacak.
- Bileşenler yeniden kullanılabilir, dokümantasyonlu ve testlerle korunacak.

## 5. CI/CD & Operasyon

- Backend ve client için **multi‑stage Dockerfile**, `docker‑compose.yml` (Postgres, Redis, MinIO, Nginx).
- **GitHub Actions**: lint → test → build → docker‑push → SSH‑deploy Hetzner.
- Health‑check endpoint ve **Winston** loglama standartları.
- Monitoring: **Prometheus + Grafana** + Docker health‑checks.

## 6. SEO & Analitik

- `react‑helmet‑async` + **JSON‑LD** yapılandırması, `sitemap.xml` ve `robots.txt`.
- Google **Lighthouse** auditı, LCP < 2 s ve INP < 100 ms hedefi.
- Basit analytics (ör. **Plausible**) ve **event schema** tanımlanacak.

## 7. Dokümantasyon

- `README.md` içinde mimari diyagramı, OpenAPI spec ve contribution guide yer alacak.
- Bu **rules.md** dosyası proje içinde referans alınacak, değişiklikler versiyon kontrolüyle izlenecek.
- Kodun her dosyasında gerekli yorum ve docstring bulunmalı.

## 8. Bilgi Öğeleri & Öğrenme

- **Proje Yönetişim & Geliştirici Prensipleri** (Tahmin Et‑Doğrula) her sprintte uygulanacak.
- **Mastery Module**’da tanımlı premium UX standartları takip edilecek.
- **Senior Backend Instructor** profiline uygun temizlik, test ve mentörlük kültürü sürdürülmeli.

## 9. Süreç & İletişim

- Tüm değişiklikler **Pull Request** içinde, reviewer onayı ve CI geçişi zorunlu.
- Haftalık stand‑up’da ilerleme, engeller ve riskler paylaşılacak.
- Her yeni özellik için **Kabul Kriteri** hazırlanacak ve otomatik testlerle doğrulanacak.

## 10. “Unutma” Mekanizması

- Bu dosyada tanımlı kurallar **rules.md** içinde tutulduğu sürece proje içinde her zaman referans alınır.
- CI pipeline’da `npm run lint && npm run test` adımı başarısız olursa **deploy engellenir**.
- Kod incelemesinde **rules.md** kontrol listesi zorunlu bir adım olur.
- Commit mesajları **Conventional Commits** formatına (`feat|fix|chore|docs|style|refactor|test: <açıklama>`) uygun olmalı.

---

_Bu kurallar, projenin tüm yaşam döngüsünde uygulanacak ve hiçbir aşamada ihmal edilmeyecek şekilde tasarlanmıştır._
