# Brevo – Transactional Email Log Saklama Kararı

- **Proje:** ÇAĞBAŞ
- **Kayıt tarihi:** 22.11.2026
- **Hizmet:** Brevo – Transactional Emails
- **Ayar bölümü:** Settings → Transactional emails → Retention rules
- **Durum:** Kullanıcı Save işlemini yaptığını bildirdi. Sonradan sayfayı yenileyerek ayarların kalıcı kaldığının ekran görüntüsüyle doğrulanması ve silme döngüsünün kontrolü bekleniyor.

## 1. Alınan teknik karar

| Ayar | Seçilen değer |
|---|---|
| Which senders' logs? | All senders |
| Transactional log retention | 1 month |
| Email previews | Never store previews |

Bu karar yalnızca Brevo **transactional email logs** ve bunlara ait e-posta önizlemeleri içindir. Brevo hesabındaki tüm kişi kayıtlarını, kampanya verilerini, SMS kayıtlarını, event logs/webhook kayıtlarını veya Gmail'deki e-postaları kapsadığı varsayılmamalıdır.

## 2. Brevo'nun resmî teknik dayanağı

Brevo'nun “Configure a custom retention period for your transactional logs and email previews” başlıklı yardım belgesine göre:

- Transactional loglar ve e-posta önizlemeleri, özel bir saklama kuralı tanımlanmazsa varsayılan olarak süresiz saklanır.
- Transactional log saklama süresi 1–24 ay arasında seçilebilir; 1 ay, Brevo'nun spam tespiti ve gönderici itibarını hesaplaması için belirttiği asgari süredir.
- Yeni saklama kuralı mevcut loglara geriye dönük ve bundan sonra oluşacak loglara ileriye dönük uygulanır.
- Saklama süresi dolduğunda loglar kalıcı olarak silinir; silme işlemi süre bitiminden sonra 24 saate kadar gecikebilir.
- “Never store previews” seçimi, kayıttan sonra gönderilen e-postaların önizleme içeriklerinin saklanmamasını sağlar. Bu tercih geçmişte oluşturulmuş önizlemeleri geriye dönük silmez.

Kaynak: https://help.brevo.com/hc/en-us/articles/4415743225746-Configure-a-custom-retention-period-for-your-transactional-logs-and-email-previews

Brevo'nun logları yönetme belgesi: https://help.brevo.com/hc/en-us/articles/360021533839-Manage-your-transactional-logs-and-email-previews

**Kapsam uyarısı:** Brevo'nun genel email event logs/event history kayıtları, transactional log retention ayarından ayrı olabilir. Brevo, 10 milyondan fazla email event bulunan hesaplarda 24 aydan eski eventler için ayrıca platform politikası uyguladığını açıklıyor. Bu kayıt türleri ayrıca envantere alınmalıdır: https://help.brevo.com/hc/en-us/articles/19317424653586-FAQs-About-the-data-retention-policy-for-email-events

## 3. Hukuki dayanak ve gerekçe

### 6698 sayılı Kişisel Verilerin Korunması Kanunu

- **Madde 4/2(d) – Amaçla bağlantılı, sınırlı ve ölçülü olma:** Kişisel veriler, ilgili mevzuatta öngörülen veya işlendikleri amaç için gerekli olan süre kadar muhafaza edilmelidir.
- **Madde 7 – Silme, yok etme veya anonim hâle getirme:** İşlenmesini gerektiren sebepler ortadan kalktığında kişisel veriler resen veya talep üzerine silinmeli, yok edilmeli veya anonim hâle getirilmelidir.

Resmî mevzuat metni: https://www.kvkk.gov.tr/Icerik/2038/kisisel-verilerin-silinmesi-yok-edilmesi-veya-anonim-hale-getirilmesi

### Kişisel Verilerin Silinmesi, Yok Edilmesi veya Anonim Hâle Getirilmesi Hakkında Yönetmelik

- **Madde 7:** Silme, yok etme ve anonim hâle getirme işlemlerinin mevzuata ve ilgili politikalara uygun yürütülmesini; yapılan işlemlerin kayıt altına alınmasını düzenler. İmha işlemlerine ilişkin kayıtların, diğer hukuki yükümlülükler saklı kalmak üzere en az üç yıl saklanması hükmü de dikkate alınmalıdır.

Resmî kaynak: https://www.kvkk.gov.tr/Icerik/5441/KISISEL-VERILERIN-SILINMESI-YOK-EDILMESI-VEYA-ANONIM-HALE-GETIRILMESI-HAKKINDA-YONETMELIK

## 4. Kararın anlamı ve sınırları

Bir aylık süre, KVKK tarafından tüm e-posta kayıtları için belirlenmiş genel bir zorunlu süre değildir. Bu, ÇAĞBAŞ'ın transactional loglar bakımından seçtiği, Brevo'nun izin verdiği en kısa teknik saklama süresidir. Seçim; logların operasyonel izleme, hata giderme ve gönderici itibarı amaçları için gerekli olabilecek süreyi sınırlı tutma yaklaşımına dayanır.

“Süresiz saklama” KVKK bakımından otomatik olarak her durumda hukuka aykırı diye nitelendirilemez; ancak saklama amacı ve gerekliliği devam etmiyorsa verilerin tutulması, amaçla sınırlılık ve gerekli süre kadar muhafaza ilkeleriyle bağdaşmaz. Bu nedenle burada süresiz saklama yerine bir aylık süre tercih edilmiştir.

Bu kayıt tek başına tüm ÇAĞBAŞ veri işleme faaliyetlerinin KVKK'ya uygun olduğunu veya yurt dışına veri aktarımının hukuki şartlarının tamamlandığını kanıtlamaz. Brevo'nun veri işleyen rolü, alt işleyenleri, veri lokasyonu ve yurt dışına aktarım mekanizması ayrıca değerlendirilmelidir.

## 5. Uygulama ve doğrulama kaydı

- Kullanıcı, 22.11.2026 tarihinde Save düğmesine bastığını bildirdi.
- **Bekleyen doğrulama:** Retention rules sayfasını yenileyip All senders / 1 month / Never store previews değerlerinin korunduğunu ekran görüntüsüyle doğrula.
- **Bekleyen kontrol:** Saklama süresi dolmuş kayıtların silinme işleminin Brevo'nun açıkladığı 24 saatlik gecikme penceresinde tamamlandığını, uygun log kayıtları üzerinden kontrol et. Yeni ayar geriye dönük uygulandığından eski loglar da kapsamda olabilir.
- **Önizleme notu:** Never store previews seçimi geçmiş önizlemeleri silmez; yalnızca kayıttan sonra gönderilecek e-postalara uygulanır.
- **Kanıt dosyaları:** Ayar öncesi ve sonrası ekran görüntülerini bu klasöre ekle. Henüz eklenmedi.

## 6. Değişiklik geçmişi

| Tarih | İşlem | Durum |
|---|---|---|
| 22.11.2026 | All senders, 1 month, Never store previews seçildi ve kullanıcı Save işlemini yaptığını bildirdi. | Son ekran doğrulaması bekliyor |

---
Bu belge, teknik ayar kararının ve kullanılan kaynakların izlenebilir kaydıdır; hukuki görüş veya tüm sistem için uygunluk sertifikası değildir. İşleme amaçları, veri kategorileri, saklama süreleri ve yurt dışı aktarım şartları veri envanteri kapsamında ayrıca değerlendirilmelidir.
