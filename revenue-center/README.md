# ÇAĞBAŞ Revenue Center

Bağımsız gelir yönetim paneli ve API.

## Yayın sınırları
- Revenue Center, mevcut ÇAĞBAŞ kurumsal web sitesinden bağımsız bir Worker olarak çalışır.
- Kaynak kod yalnızca `feature/revenue-center-foundation` dalındadır.
- Mevcut `cagbas-site` Pages projesi, `front/` klasörü ve üretim dağıtımı değiştirilmemiştir.
- Yönetim paneli kendi Workers.dev adresinde sunulur; mevcut site menülerine bağlantı eklenmemiştir.
- Panel giriş ekranı ve ilk yönetici kurulum akışı vardır. İlk yönetici oluşturulana kadar panel içeriği gösterilmez.
- İlk yönetici e-postası: `cagbas.2026@gmail.com`. Parola GitHub'a veya kaynak koda yazılmaz; ilk kurulum ekranında kullanıcı tarafından belirlenir.

## Cloudflare altyapısı
- Worker: `cagbas-revenue-api`
- Worker adresi: https://cagbas-revenue-api.basarcekmecelioglu6-0f8.workers.dev
- D1 veritabanı: `cagbas-revenue-center`
- D1 ID: `f2e8bec2-71c0-492c-8da9-24bd596c58af`
- Worker'ın `DB` binding'i yalnızca bu yeni D1 veritabanına bağlıdır.
- D1 şeması uygulandı; yönetici/işletme kayıtları henüz oluşturulmadı.
- D1 bölgesi EEUR. Kişisel veri işlemeye başlamadan önce KVKK yurt dışına aktarım şartları değerlendirilmelidir.
- Mevcut `bascag-reviews`, `cagbas-contact` ve `cagbas-preview-db` veritabanlarına dokunulmamıştır.

## Dosyalar
- `index.html`: Giriş ekranı, ilk yönetici kurulum arayüzü ve panel prototipi.
- `schema.sql`: Yönetici hesapları, oturumlar, giriş denemeleri, denetim kayıtları ve gelir modülleri için D1 şeması.
- `worker.js`: İlk yönetici kurulumu, PBKDF2 parola doğrulama, güvenli oturum çerezi, oturum kapatma ve korumalı özet API'si.

## İlk kurulum — kullanıcı tarafından tamamlanacak güvenli adım
1. Worker adresini aç.
2. Ekrandaki **Anahtar üret** düğmesiyle 32 baytlık rastgele kurulum anahtarı oluştur.
3. Cloudflare Dashboard > Workers & Pages > `cagbas-revenue-api` > Settings > Variables and Secrets bölümünde `BOOTSTRAP_SECRET` adıyla **Secret** ekle ve aynı değeri kaydet.
4. Panel kurulum ekranına dön; oluşturduğun anahtarı, yönetici e-postasını ve en az 12 karakterlik parolanı gir.
5. Yönetici hesabı oluşturulduktan sonra kurulum tek seferlik olarak kapanır. Daha sonra normal giriş ekranı kullanılır.
6. Kurulum tamamlanınca Cloudflare'daki `BOOTSTRAP_SECRET` Secret'ını sil; tekrar ihtiyaç duyulmaz.

Kurulum anahtarı veya yönetici parolası sohbet mesajına, GitHub'a ya da düz metin değişkenine yazılmamalıdır.

## Şu anki kapsam ve sınırlamalar
- Giriş, ilk yönetici kurulumu, oturum çerezi, oturum kapatma ve özet API'si hazırdır.
- Reklam ağları, affiliate programları, sponsor tahsilatları, dijital mağaza ödemeleri ve GA4 henüz entegre edilmemiştir.
- Diğer modüllerin CRUD işlemleri henüz tamamlanmamıştır; örnek/uydurma gelir verisi gösterilmez.
- Canlı ticari kullanımdan önce rol bazlı yazma yetkileri, denetim kayıtları, KVKK metinleri, veri saklama/silme politikası, ödeme sağlayıcıları ve muhasebe süreçleri ayrıca tamamlanmalıdır.
