Harika! MVP (Minimum Uygulanabilir Ürün) aşamasında en büyük hatamız her şeyi aynı anda yapmaya çalışmaktır. MVP'nin amacı **"Öğrencinin staj ilanı görmesi ve başvurması, şirketin de bu başvuruyu değerlendirmesi"** döngüsünü en hızlı ve en kararlı şekilde çalıştırmaktır.

İşte 8-10 haftalık, adım adım **MVP Proje Planı**:

---

### 1. HAFTA: Temel Mimari ve Veritabanı Tasarımı

Bu hafta projenin iskeletini kuruyoruz.

- **Veritabanı (PostgreSQL):**
  - `Users` tablosu (Email, Şifre, Rol: ogrenci/sirket/admin).
  - `Profiles` tablosu (Öğrenci bilgileri, Okul, Bölüm, CV linki).
  - `Companies` tablosu (Şirket adı, Web sitesi, Vergi No/Doğrulama durumu).
  - `Internships` tablosu (Başlık, Açıklama, Şehir, Tip, Son Başvuru).
  - `Applications` tablosu (Ogrenci_id, Ilan_id, Durum: Beklemede/Red/Kabul).
- **Backend Başlangıç (Node.js/NestJS):** Proje klasör yapısının oluşturulması, Prisma veya TypeORM entegrasyonu.
- **Frontend Başlangıç (React):** Vite ile projenin kurulması, Tailwind CSS entegrasyonu.

### 2. HAFTA: Kimlik Doğrulama ve Kullanıcı Yönetimi (Auth)

Güvenli giriş-çıkış sistemini hallediyoruz.

- **Backend:** JWT tabanlı login/register sistemi. (Öğrenci ve Şirket için ayrı kayıt formları).
- **Frontend:** Giriş yap, Kayıt ol, Şifremi unuttum sayfalarının kodlanması.
- **Middleware:** "Sadece şirketler ilan verebilir" veya "Sadece öğrenciler ilanlara başvurabilir" koruma katmanlarının yazılması.

### 3. HAFTA: Şirket Paneli ve İlan Yönetimi

Şirketlerin ilan girmesini sağlamalıyız ki içerik oluşsun.

- **Backend:** İlan oluşturma, silme, güncelleme ve kendi ilanlarını listeleme API’ları.
- **Frontend (Şirket Dashboard):**
  - Yeni Staj İlanı Oluştur formu (İş tanımı, aranan özellikler).
  - Aktif ilanlarım listesi.
  - Gelen Başvuruları Görüntüleme ekranı (Basit liste).

### 4. HAFTA: Öğrenci Paneli ve Profil Oluşturma

Öğrencilerin kendilerini tanıtması ve ilan görmesi aşaması.

- **Backend:** Öğrenci profil güncelleme API'sı. CV (PDF) yükleme için **AWS S3** veya muadili bir depolama entegrasyonu (Veya başlangıçta sunucu içinde klasörleme).
- **Frontend (Öğrenci Dashboard):**
  - Profil düzenleme (Eğitim bilgileri, yetenekler).
  - Staj İlanları Listeleme (Filtreleme: Şehir, Bölüm).
  - İlan Detay Sayfası.

### 5. HAFTA: Başvuru Akışı ve Bildirimler

Sistemin kalbi olan "Başvur" butonunu çalıştırıyoruz.

- **Backend:** `applyToInternship` fonksiyonu. (Bir öğrenci aynı ilana 1 kez başvurabilir kontrolü).
- **Durum Güncelleme:** Şirketin bir başvuruyu "İncelemeye Alındı" veya "Reddedildi" olarak işaretleyebilmesi.
- **Email Bildirimi:** (Nodemailer ile) "Başvurunuz alındı" veya "Yeni bir başvurunuz var" şeklinde basit e-posta bildirimleri.

### 6. HAFTA: Admin Paneli ve Manuel Onay Sistemi

MVP aşamasında güvenliği manuel sağlıyoruz.

- **Admin Dashboard:**
  - Yeni kayıt olan şirketleri listeleme ve "Onayla" butonu (Şirket onaylanmadan ilanları yayına girmemeli).
  - Şikayet edilen ilanları kaldırma yetkisi.
  - Basit istatistikler (Kaç öğrenci, kaç ilan?).

### 7. HAFTA: Cilalama (UI/UX) ve Hata Denetimi

Kullanıcı deneyimini iyileştirme.

- **Validasyonlar:** Boş form gönderilmesini engelleme, hata mesajlarını (Toast messages) kullanıcıya gösterme.
- **Responsive Tasarım:** Sitenin mobilden (tarayıcıdan) düzgün görünmesini sağlama (Çünkü mobil uygulama henüz yok).
- **Arama Optimizasyonu:** İlan başlığına göre arama yapma özelliği.

### 8. HAFTA: Hetzner Sunucu Kurulumu ve Deployment

Dünyaya açılıyoruz.

- **Hetzner Cloud:** Ubuntu Server kurulumu.
- **Docker:** `Dockerfile` ve `docker-compose.yml` dosyalarının hazırlanması (Node.js, Postgres, Nginx).
- **Nginx & SSL:** Ters proxy ayarları ve Let's Encrypt ile ücretsiz SSL (HTTPS).
- **CI/CD:** GitHub Actions ile kod `main` branch'ine atıldığında sunucuda otomatik güncellenmesi.

### 9. HAFTA: Veri Girişi ve Beta Testi

Sistem boş görünmemeli.

- **Manuel Veri:** Tanıdık birkaç şirketten ilan alıp sisteme girmek veya popüler ilanları (kaynak belirterek) eklemek.
- **Beta Testi:** 10-20 öğrenci arkadaşına sistemi denetip hataları toplamak.

---

### MVP İçin "Olmazsa Olmaz" Teknik Detaylar:

1.  **Öğrenci CV'si:** İlk aşamada gelişmiş bir CV oluşturucu yerine, öğrencilerin var olan PDF CV'lerini sisteme yüklemelerini sağla. Bu çok zaman kazandırır.
2.  **Şirket Doğrulama:** MVP'de otomatik bir vergi dairesi entegrasyonuyla uğraşma. Şirket kayıt olur, admin paneline düşer, sen manuel kontrol edip (Web sitesine bakıp vs.) "Onayla" dersin.
3.  **SEO:** React tarafında `react-helmet-async` kullanarak ilan sayfalarının Google'da indekslenmesini sağla. "X Şirketi Stajyer Arıyor" aramalarında üstte çıkmak öğrenci trafiği çeker.

### Bir Sonraki Adım (MVP Sonrası):

Bu 9 haftalık plan sonunda elinde çalışan, Hetzner üzerinde canlıda olan ve öğrencilerin/şirketlerin kayıt olabildiği bir platform olacak. Bu noktadan sonra 4. Fazda bahsettiğim **Tanıtım** aşamasına geçebilirsin.

Başlamak için ilk adım olarak bir **GitHub Repo'su** açıp, **Veritabanı Şemasını** (SQL veya Prisma şeması olarak) tasarlamanı öneririm. Şema hazır olduğunda bana sorarsan üzerinden beraber geçebiliriz.
