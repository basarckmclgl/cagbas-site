# ÇAĞBAŞ – Saklama ve İmha Uygulama Çizelgesi

- **Veri sorumlusu:** Başar Çekmecelioğlu (gerçek kişi)
- **Kayıt türü:** Kurum içi teknik uygulama çizelgesi
- **Son güncelleme:** 24.11.2026

## 1. Amaç ve kapsam

Bu çizelge, VERBİS istisnası nedeniyle zorunlu bir politika olduğu iddiasında bulunmaz. Web sitesi kayıtlarının fiilî saklama sürelerini ve teknik imha durumunu takip eder.

Henüz başlamamış müşteri sözleşmesi, fatura, ödeme, tedarikçi ve personel süreçleri bu sürümün kapsamı dışındadır. Bu faaliyetler başladığında prosedür güncellenir.

## 2. Temel kurallar

1. Kişisel veriler yalnızca belirlenen amaç ve hukuki sebep için gerekli olduğu sürece tutulur.
2. Süre, her veri işleme faaliyeti ve kayıt ortamı için ayrı belirlenir.
3. Birden fazla saklama sebebi varsa, yalnızca ilgili sebep devam eden kayıtlar ayrıştırılır ve gerekli süreyle sınırlı tutulur.
4. Saklama sebebi ortadan kalkınca veri silinir, yok edilir veya anonim hâle getirilir.
5. İmha işlemleri kayıt altına alınır. Yönetmelik m.7/3 uyarınca imha kayıtları, diğer hukuki yükümlülükler saklı kalmak üzere en az üç yıl saklanır.
6. İmha işlemi sağlayıcı sistemleri ve uygulanabilir yedekler bakımından da değerlendirilir; ana sistemden silme, yedeklerden anında silindiği anlamına gelmez.
7. İlgili kişinin silme talebi, KVKK ve ilgili Yönetmelik uyarınca değerlendirilir; şartlar oluşmuşsa talep en geç 30 gün içinde sonuçlandırılır.

## 3. Saklama ve imha tablosu

| Kayıt türü | Süre / tetikleyici | İmha yöntemi | Uygulama durumu |
|---|---|---|---|
| İletişim formu – D1 | Oluşturulma tarihinden itibaren 365 gün. Devam eden uyuşmazlık veya somut hukuki saklama yükümlülüğü varsa ilgili kayıt ayrıştırılır ve yalnızca gerekli süre tutulur. | D1 satırını kalıcı olarak silme; işlem tarihi ve sonucu için kişisel veri içermeyen/minimum imha kaydı tutma | Otomatik silme kodu henüz doğrulanmadı; uygulanmış sayılmaz. |
| Doğrulanmamış e-bülten talebi – D1 | Token 24 saat geçerlidir. Pending satırı oluşturulma tarihinden itibaren 30 gün sonra silinir. | Pending satırını silme; token hash ve e-posta dahil kayıt alanlarını kaldırma | Tokenın süresi dolunca token alanları temizleniyor; satırın silinmesi otomatik değil. 30 günlük iş akışı kurulmalı. |
| Aktif e-bülten kaydı – D1/Brevo | Abonelik aktif olduğu ve gönderim amacı sürdüğü sürece. Ayrılma talebi onaylanınca gönderim derhal durdurulur. | Aktif gönderim listesinden çıkarma; tekrar gönderimi önlemek için zorunlu asgari bastırma kaydı ayrı tutulur. İzin ispatı kaydı gereklilik süresi sonunda silinir/anonimleştirilir. | D1 status alanı unsubscribe olarak güncelleniyor; otomatik nihai silme süresi tanımlı değil. |
| Abonelik izin/ayrılma ispatı | Ayrılma tarihinden itibaren 1095 gün (3 yıl). | E-posta yerine mümkünse asgari kayıt; süre bitiminde silme/anonimleştirme | Otomatik imha doğrulanmadı. |
| Çerez tercih kaydı – tarayıcı | Kullanıcı tercihini değiştirene veya tarayıcı verisini temizleyene kadar; arayüzden geri alma sağlanır. | localStorage ve ilgili birinci taraf tercih çerezini silme/güncelleme | İstemci kodunda tercih yönetimi mevcut; tarayıcılar arası davranış test edilmeli. |
| Google Analytics verileri | GA hesabında seçilen veri saklama süresi doğrulanana kadar süre kesinleştirilmemiştir. Uygun en kısa operasyonel süre seçilmelidir. | GA yönetici ayarlarından veri saklama süresini belirleme; gerekli olduğunda kullanıcı/veri silme araçlarını uygulama | Hesap ayarı görülmedi; henüz doğrulanmadı. |
| API rate-limit kayıtları – D1 | 48 saat; günlük Cron görevi | 24 saatten eski satırları deterministik zamanlanmış görevle silme | Mevcut kodda yalnızca istek başına %2 olasılıklı temizlik var; 24 saat garantisi sağlamaz. Düzeltme ve test gerekli. |
| Gmail iletişim bildirimleri | Talep kapandıktan sonra en çok 365 gün; aylık manuel kontrol. | Gmail'de etiket/arama tabanlı periyodik silme; çöp kutusunun kalıcı boşaltılmasını kontrol etme | Gelen kutusu için otomatik saklama kuralı doğrulanmadı; manuel prosedür gerekli. |
| Brevo transactional logları | 1 ay (kullanıcının bildirdiği ayar; hesap ekranı doğrulanacak) | Brevo retention ayarı üzerinden sağlayıcı silme döngüsü | Kullanıcı Save yaptığını bildirdi; ayarın kalıcılığı ve silme sonucu ekranla doğrulanmalı. |
| Brevo email event kayıtları | Sağlayıcının bu kayıt türü için ayrı açıkladığı süre/ayar doğrulanana kadar belirlenmemiştir. | Brevo hesabındaki event history/log ayarları ve sağlayıcı politikası üzerinden | Transactional log ayarının kapsamına girdiği varsayılmamalı. |
| İmha işlem kayıtları | İmha işlemi tarihinden itibaren en az 3 yıl | Süre sonunda imha kaydını silme/anonimleştirme; başka yasal yükümlülük varsa ayrıca değerlendirme | İmha kayıt defteri oluşturulmalı. |

**Not:** Bu süreler ÇAĞBAŞ'ın mevcut düşük hacimli web sitesi süreçleri için belirlenmiş işletme süreleridir; KVKK'nın bütün veri türleri için doğrudan belirlediği genel süreler değildir. Somut bir uyuşmazlık veya kanuni saklama yükümlülüğü varsa ilgili kayıt ayrıştırılır.

## 4. Periyodik kontrol ve imha takvimi

- Her ay: D1'de süresi dolan pending abonelikler ve rate-limit kayıtları kontrol edilir; otomatik imha görevlerinin çalıştığı doğrulanır.
- Her üç ayda: İletişim formu kayıtları ve Gmail bildirimleri gözden geçirilir; saklama sebebi kalmayanlar imha edilir.
- Her yıl: Veri envanteri, sağlayıcılar, hukuki sebepler, saklama süreleri, erişim yetkileri ve yurt dışı aktarım mekanizmaları gözden geçirilir.
- İlgili kişi talebi: Talep kayıt altına alınır; işleme şartları sona ermişse Yönetmelik'teki süre içinde silme/yok etme/anonimleştirme işlemi tamamlanır.
- İmha işlemi: Yapılan işlem, tarih, kayıt sistemi, veri kategorisi, yöntem ve sorumlu kişiyle birlikte imha kayıt defterine yazılır.

Bu takvim operasyonel kontrol önerisidir. Saklama ve imha politikası hazırlama yükümlülüğünün kapsamı, veri sorumlusunun VERBİS kayıt yükümlülüğü durumuna göre ayrıca belirlenmelidir. Politika hazırlama yükümlülüğü bulunmasa dahi Kanun ve Yönetmelik kapsamındaki silme/yok etme yükümlülükleri devam eder.

## 5. İmha kayıt şablonu

| İşlem tarihi | Kayıt sistemi | Veri kategorisi | İmha nedeni | Yöntem | İşlemi yapan | Kontrol / kanıt |
|---|---|---|---|---|---|---|
|  |  |  | Saklama süresi doldu / amaç sona erdi / ilgili kişi talebi | Silme / yok etme / anonimleştirme |  |  |

## 6. Uygulama durumu ve kalan kontroller

- [x] D1 tabloları ve alanları doğrulandı.
- [x] D1'de 9 test iletişim kaydı silindi; son sorgu 0 kayıt gösterdi.
- [x] Worker günlük Cron ve saklama değişkenleri yapılandırıldı.
- [x] Gmail'de 7 test bildirimi Çöp Kutusu'na taşındı.
- [ ] Worker'ın ilk Cron çalışmasının logu kontrol edilecek.
- [ ] Brevo retention ayarının kalıcılığı ve genel event logları doğrulanacak.
- [ ] Google Analytics veri saklama ayarı 2 ay olarak seçilecek.
- [ ] Cloudflare, Google ve Brevo için KVKK m.9 aktarım mekanizması belgelenecek.
- [ ] Gmail aylık kontrolü sürdürülecek.

## 7. Mevzuat dayanağı

- 6698 sayılı Kanun m.4, m.5, m.7, m.9, m.10, m.11 ve m.12.
- Kişisel Verilerin Silinmesi, Yok Edilmesi veya Anonim Hale Getirilmesi Hakkında Yönetmelik m.5–12.
- Veri Sorumluları Sicili Hakkında Yönetmelik m.9.

Resmî kaynaklar:
- https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6698.pdf
- https://www.kvkk.gov.tr/Icerik/5441/KISISEL-VERILERIN-SILINMESI-YOK-EDILMESI-VEYA-ANONIM-HALE-GETIRILMESI-HAKKINDA-YONETMELIK
- https://www.kvkk.gov.tr/Icerik/5442/VERI-SORUMLULARI-SICILI-HAKKINDA-YONETMELIK
- https://www.kvkk.gov.tr/SharedFolderServer/CMSFiles/224af10e-ff71-4cc9-9e18-c6c142f8da05.pdf

---

Bu çizelge, uygulama kanıtı ile tamamlanmamış kontrolleri birbirinden ayırır. Cron kurulumu ilk silme çalışmasının başarılı olduğunu tek başına kanıtlamaz.
