---
name: reuse-check
description: Bileşen yeniden kullanılabilirliği, illegal import ve döngüsel bağımlılık kontrolleri.
---

# Reuse‑Check Skill

Bu skill, `scripts/check-reusability.ts` dosyasını çalıştırarak aşağıdaki denetimleri yapar:

1. **Duplicate Component Files** – aynı içeriğe sahip iki `.tsx`/`.ts` dosyası varsa hata verir.
2. **Import Restrictions** – `src/components/**` dosyaları `src/pages/**` dosyalarına import yapamaz (import‑kısıtlama).
3. **Circular Imports** – proje içinde döngüsel import tespiti yapar.

## Kullanım

```bash
npm run check:reuse
```

Bu komut script’i (TS‑Node) çalıştırır. Çıkış kodu `0` ise denetimler başarılıdır; `1` ise bir veya daha fazla ihlal bulunmuş ve commit/CI abort edilir.

## Beklenen Çıktı

- **Başarılı:** `✅ Reusability and architectural checks passed.`
- **Hata:** `🚫 Duplicate component implementations found:` ya da `🚫 Import violation:` gibi mesajlar.

## Entegrasyon

- **Husky pre‑commit hook** ve **GitHub Actions CI** otomatik olarak bu skill’i çalıştırır (`npm run check:reuse`).
- **AGENTS.md** içinde tanımlı kurallara uyumu garantiler.
