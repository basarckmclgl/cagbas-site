# ÇAĞBAŞ Revenue Center

Bağımsız gelir yönetim paneli başlangıç paketi.

## Güvenlik ve yayın sınırları
- Bu klasör mevcut `front/` web sitesinden bağımsızdır.
- Bu çalışma yalnızca `feature/revenue-center-foundation` dalındadır.
- Canlı siteye, Cloudflare Pages üretim ayarlarına veya mevcut D1 veritabanına müdahale edilmemiştir.
- `index.html` şu an yalnızca arayüz prototipidir. Gerçek oturum açma, yetkilendirme, veri kaydı veya ödeme işlemi yapmaz.
- Gerçek kullanıma açılmadan önce sunucu taraflı kimlik doğrulama, oturum güvenliği, erişim kontrolleri, denetim kayıtları ve KVKK değerlendirmesi zorunludur.

## İçerik
- `index.html`: Duyarlı yönetim paneli arayüz prototipi.
- `schema.sql`: Ayrı D1 veritabanı için başlangıç şeması taslağı; henüz uygulanmamıştır.

## Önerilen sonraki adımlar
1. Cloudflare Pages üzerinde ayrı bir proje oluşturup bu klasörü kök dizin olarak tanımlamak.
2. Ayrı bir D1 veritabanı oluşturmak; mevcut `bascag-reviews` veritabanına dokunmamak.
3. Cloudflare Worker API geliştirmek.
4. Yönetici kimlik doğrulamasını ve rol kontrollerini sunucu tarafında kurmak.
5. Gerçek AdSense, affiliate, sponsor ve ödeme entegrasyonlarını ayrı ayrı doğrulamak.
6. KVKK, çerez ve ticari mevzuat kontrolleri tamamlanmadan ziyaretçi verisi toplamamak veya ticari faaliyeti başlatmamak.
