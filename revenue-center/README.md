# ÇAĞBAŞ Revenue Center

Bağımsız gelir yönetim paneli başlangıç paketi.

## Güvenlik ve yayın sınırları
- Bu klasör mevcut `front/` web sitesinden bağımsızdır.
- Bu çalışma yalnızca `feature/revenue-center-foundation` dalındadır.
- Canlı siteye, mevcut Pages projesine ve üretim dağıtım ayarlarına müdahale edilmemiştir.
- `index.html` şu an yalnızca arayüz prototipidir. Gerçek oturum açma, yetkilendirme, veri kaydı veya ödeme işlemi yapmaz.
- Gerçek kullanıma açılmadan önce Worker API, sunucu taraflı kimlik doğrulama, oturum güvenliği, erişim kontrolleri ve KVKK değerlendirmesi tamamlanmalıdır.
- Veritabanı henüz gerçek kullanıcı, müşteri veya gelir kaydı içermemektedir.

## Altyapı durumu
- Bağımsız D1 veritabanı: `cagbas-revenue-center`
- D1 ID: `f2e8bec2-71c0-492c-8da9-24bd596c58af`
- Şema uygulandı ve tablolar doğrulandı.
- Veritabanı Cloudflare tarafından EEUR bölgesinde oluşturuldu. Kişisel veri aktarımı başlamadan önce KVKK yurt dışına aktarım şartları ayrıca değerlendirilmelidir.
- Mevcut `bascag-reviews`, `cagbas-contact` ve `cagbas-preview-db` veritabanlarına dokunulmamıştır.

## İçerik
- `index.html`: Duyarlı yönetim paneli arayüz prototipi.
- `schema.sql`: Yönetici hesapları, oturumlar, giriş denemeleri, denetim kayıtları ve gelir modülleri için uygulanmış D1 şeması.\n- `worker.js`: İlk yönetici kurulumu, parola doğrulama, güvenli oturum çerezi, oturum kapatma ve korumalı özet API'si için Worker kaynak kodu. Henüz dağıtılmamıştır.

## Sonraki adımlar
1. Worker API kaynağı eklendi; şimdi Cloudflare üzerinde ayrı Worker olarak yapılandırılıp test edilmelidir.
2. API'yi ayrı bir Worker olarak yapılandırmak ve D1 bağlantısını yalnızca bu Worker'a vermek.
3. Paneli ayrı bir Cloudflare projesinde yayınlamak; mevcut `cagbas-site` projesine bağlamamak.
4. Gerçek yönetici e-postası ve parolasını Cloudflare Secrets üzerinden tanımlamak; GitHub'a hiçbir gizli bilgi koymamak.
5. AdSense, affiliate, sponsor ve ödeme entegrasyonlarını ayrı ayrı kurmak.
6. KVKK, çerez ve ticari mevzuat kontrolleri tamamlanmadan ziyaretçi verisi toplamamak veya ticari faaliyeti başlatmamak.
