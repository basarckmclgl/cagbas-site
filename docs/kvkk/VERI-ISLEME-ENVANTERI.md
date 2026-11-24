# ÇAĞBAŞ – Kişisel Veri İşleme Envanteri

- **Veri sorumlusu:** Başar Çekmecelioğlu (gerçek kişi)
- **Faaliyet:** ÇAĞBAŞ Creative Studio – web sitesi üzerinden iletişim ve e-bülten süreçleri
- **Sürüm:** 0.1 – çalışma taslağı
- **Hazırlanma tarihi:** 24.11.2026
- **Durum:** Teknik incelemeye dayalı taslak; hesap ayarları, veri aktarımı ve süreler doğrulanmadan nihai/uyum belgesi olarak kullanılmamalıdır.

## 1. Kapsam ve yöntem

Bu envanter, mevcut web sitesi ve incelenen sunucu kodunda görülen veri işleme faaliyetleriyle sınırlıdır. Henüz müşteri işi, teklif, sözleşme, fatura, ödeme veya tedarikçi süreci oluşmadığı için bunlar mevcut faaliyet olarak gösterilmemiştir. Bu süreçler başladığında envanter güncellenmelidir.

## 2. Veri işleme faaliyetleri

| Süreç / veri konusu kişi | Veri kategorisi ve veri türleri | İşleme amacı | Hukuki sebep (somut olaya göre) | Alıcı / hizmet sağlayıcı | Kayıt ortamı ve aktarım | Saklama / imha yaklaşımı |
|---|---|---|---|---|---|---|
| İletişim formu – ziyaretçi / potansiyel müşteri | Kimlik: ad-soyad. İletişim: e-posta, telefon. Müşteri işlem / talep içeriği: konu ve mesaj | Talebi almak, yanıtlamak, talep kapsamında ön görüşme yürütmek; gerekli hâllerde bir hakkın tesisi veya korunması | Talebin niteliğine göre KVKK m.5/2(c) sözleşmenin kurulmasıyla doğrudan ilgili olma; m.5/2(e) bir hakkın tesisi, kullanılması veya korunması. Her başvuru için somut değerlendirme gerekir. | Cloudflare (D1/veritabanı ve site altyapısı); Google (Gmail bildirimi) | Web formundan elektronik ortamda alınır; D1'e kaydedilir, bildirim içeriği Gmail'e iletilir. Yurt dışı aktarım mekanizması ayrıca doğrulanmalı. | Talep kapanınca gereklilik değerlendirmesi yapılır. Taslak azami süre: son işlemden itibaren 12 ay; uyuşmazlık/hukuki yükümlülük varsa ilgili kayıt ayrıştırılarak gerekli süreyle sınırlı tutulur. Otomatik silme henüz doğrulanmadı. |
| E-bülten – abone / abonelik talep eden | İletişim: e-posta. İşlem güvenliği/izin kaydı: izin durumu, izin tarihi, doğrulama ve abonelikten ayrılma zamanları, durum; doğrulama token özeti ve son kullanma zamanı | Açık tercih doğrultusunda e-bülten göndermek; aboneliği doğrulamak ve iptal talebini uygulamak; izin ve işlem kayıtlarını ispatlamak | Gönderim için KVKK m.5/1 açık rıza (ayrı pazarlama izni); teknik doğrulama ve kayıtlar bakımından somut ihtiyaca göre m.5/2(c) veya m.5/2(e) ayrıca değerlendirilir. | Cloudflare D1; Brevo (doğrulama/işlem e-postası) | Web formu → D1; doğrulama e-postası Brevo üzerinden. Yurt dışı aktarım mekanizması ayrıca doğrulanmalı. | Bekleyen doğrulama kaydı için sistemde 24 saatlik token süresi vardır; bu, satırın otomatik silindiği anlamına gelmez. Aktif kayıt abonelik sürdükçe. İptal sonrası gönderim listesinde tutulmamalı; tekrar gönderimi önlemek için gereken asgari bastırma/izin ispat verisi ayrı ve sınırlı tutulmalı. Kesin üst sınır ve otomatik imha doğrulanmalı. |
| Çerez tercihleri – site ziyaretçisi | Tercih bilgisi: analitik çerez izni/ret tercihi; tarayıcıda çerez ve localStorage anahtarı | Analitik iznini yönetmek, tercihi hatırlamak | Zorunlu olmayan analitik çerezler için açık rıza; zorunlu teknolojiler için ilgili hukuki şart ve gereklilik ayrıca değerlendirilir | Tarayıcı; analitik izin verilirse Google Analytics | Tercih tarayıcı çerezi/localStorage'da; izin sonrası GA etiketi yüklenir. Google'a olası aktarım için m.9 mekanizması ayrıca doğrulanmalı. | Tercih, kullanıcı tarafından değiştirilene veya tarayıcı verisi temizlenene kadar tutulabilir; arayüzden geri alma ve silme mümkün olmalı. GA veri saklama ayarı hesap üzerinden doğrulanmalı. |
| Web analitiği – izin veren ziyaretçi | Çevrimiçi tanımlayıcılar ve kullanım/ziyaret olayları; tam veri kapsamı GA ayarlarından teyit edilecek | Site kullanım istatistiklerini ölçmek ve siteyi geliştirmek | Analitik çerezleri için önceden verilmiş açık rıza | Google Analytics / Google | İzin sonrası tarayıcıdan Google altyapısına aktarım. Veri lokasyonu, hesap ayarları ve KVKK m.9 aktarım mekanizması teyit edilmeli. | GA hesabındaki veri saklama süresi henüz doğrulanmadı; ayar doğrulanmadan kesin süre beyan edilmemeli. |
| Teknik güvenlik / hız sınırı – form ve API isteği yapan ziyaretçi | IP adresinden SHA-256 ile türetilen kapsam anahtarı; istek sayısı ve zaman penceresi. Ham IP'nin bu tabloda tutulduğu görülmedi. | Kötüye kullanım, otomatik istek ve aşırı istekleri sınırlamak | KVKK m.5/2(f) meşru menfaat; gereklilik ve denge testi yapılmalı | Cloudflare D1 | API isteği sırasında IP, kapsam bilgisiyle hash'lenerek rate-limit anahtarı oluşturulur ve D1'e yazılır. | Kod, 24 saatten eski kayıtları yalnızca her istekte %2 olasılıkla çalışan temizlik bloğunda siliyor. Bu deterministik bir 24 saatlik silme garantisi değildir. Otomatik temizlik görevi/TTL kurulup test edilmeden süre kesinleşmiş sayılmaz. |
| E-posta bildirimi – iletişim formu gönderen | Formun ad-soyad, e-posta, telefon, konu ve mesaj alanları | Form başvurusunun veri sorumlusuna iletilmesi ve yanıtlanması | Ana iletişim formu işlemiyle aynı hukuki sebep; e-posta bildirimi ayrı pazarlama amacı değildir | Google Gmail | D1 kaydı sonrası form içeriği Gmail API ile bildirim e-postasına eklenir. Gmail hesabı kişisel hesap olarak belirtilmiştir; IMAP açık ve gelen kutusu için genel otomatik silme kuralı doğrulanmamıştır. | Gmail posta kutusu için otomatik süre belirlenmiş değil. İlgili bildirimler iş ihtiyacı bittiğinde manuel olarak gözden geçirilmeli; silme ve çöp kutusu süreci belgelenmeli. |
| Transactional e-posta logları – alıcı | E-posta adresi, gönderim/teslimat/hata metaverileri; önizleme içerikleri ayara bağlı | E-posta gönderimini izlemek, hata ve teslimat sorunlarını gidermek | Ana e-bülten/işlem amacıyla bağlantılı, gerekli ve ölçülü teknik işlem; hizmet sağlayıcı rolü ve hukuki şartlar teyit edilmeli | Brevo | Brevo Transactional Emails | Kullanıcı 1 ay log saklama ve yeni önizlemeleri saklamama ayarını seçtiğini bildirdi. Ayar ekranı yenilenerek kalıcılığı doğrulanmadı; genel event logları bu ayardan ayrı olabilir. |

## 3. Veri güvenliği ve erişim

- İletişim ve abonelik kayıtları D1 veritabanında tutulur.
- Form bildirimleri Gmail; e-bülten doğrulama/iptal e-postaları Brevo üzerinden gönderilir.
- Analitik etiketi, mevcut istemci koduna göre açık analitik tercihi olmadan yüklenmemelidir.
- Rate-limit anahtarları IP'nin kendisi yerine SHA-256 özeti olarak oluşturulur; hash işlemi veriyi otomatik olarak anonim hâle getirmez.
- D1, Gmail, Brevo ve Google Analytics için hesap erişimleri, MFA, yetkili kullanıcılar, alt işleyenler, veri lokasyonu ve yurt dışı aktarım şartları ayrıca kayıt altına alınmalıdır.

## 4. Kapsam dışı / henüz başlamamış süreçler

Aşağıdaki süreçler mevcut envantere aktif veri işleme faaliyeti olarak dahil edilmemiştir:
- Müşteri teklifleri ve sözleşmeleri
- Fatura, tahsilat ve ödeme kayıtları
- Tedarikçi ve tedarikçi çalışanı kayıtları
- Personel/özlük kayıtları

Bu faaliyetler başladığında ilgili veri kategorileri, hukuki sebepler, saklama yükümlülükleri, alıcı grupları ve süreler ayrıca eklenmelidir.

## 5. Açık doğrulama maddeleri

1. D1 tabloları ve mevcut kayıtlar: iletişim, abonelik ve rate-limit tabloları; satır sayısı ve veri alanları.
2. D1 için otomatik saklama/imha: iletişim başvuruları, doğrulanmamış abonelikler, iptal kayıtları ve rate-limit satırları.
3. Gmail: iletişim bildirimleri için klasör/etiket, saklama ve silme prosedürü; bağlı istemciler.
4. Brevo: 1 aylık transactional log ve “Never store previews” ayarının kalıcılığı; genel email event loglarının ayrı saklama koşulları.
5. Google Analytics: veri saklama ayarı, Google Signals/advertising özellikleri, veri paylaşım ayarları ve izin entegrasyonu.
6. Cloudflare, Google ve Brevo bakımından veri işleyen sözleşmeleri, alt işleyenler, veri lokasyonu ve KVKK m.9 aktarım mekanizması.
7. Yedekler, dışa aktarımlar ve sağlayıcı tarafındaki silme gecikmeleri.

## 6. Hukuki not

Bu belge teknik incelemeye dayalı operasyonel envanter taslağıdır; avukat görüşü, VERBİS kaydı veya uygunluk sertifikası değildir. Hukuki sebep ve saklama süreleri gerçek işlem türü, uygulanabilir mevzuat ve ilgili kişiyle kurulan ilişkinin niteliği dikkate alınarak son kez doğrulanmalıdır.

## 7. Resmî dayanaklar

- 6698 sayılı Kanun: https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6698.pdf
- KVKK Kişisel Veri İşleme Envanteri Hazırlama Rehberi: https://www.kvkk.gov.tr/SharedFolderServer/CMSFiles/224af10e-ff71-4cc9-9e18-c6c142f8da05.pdf
- Veri Sorumluları Sicili Hakkında Yönetmelik: https://www.kvkk.gov.tr/Icerik/5442/VERI-SORUMLULARI-SICILI-HAKKINDA-YONETMELIK
- Kişisel Verilerin Silinmesi, Yok Edilmesi veya Anonim Hale Getirilmesi Hakkında Yönetmelik: https://www.kvkk.gov.tr/Icerik/5441/KISISEL-VERILERIN-SILINMESI-YOK-EDILMESI-VEYA-ANONIM-HALE-GETIRILMESI-HAKKINDA-YONETMELIK
