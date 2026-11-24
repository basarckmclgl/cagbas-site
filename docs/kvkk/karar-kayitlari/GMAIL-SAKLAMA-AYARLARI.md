# Gmail – Saklama ve Silme Ayarları İnceleme Kaydı

- **Proje:** ÇAĞBAŞ
- **Hesap:** ÇAĞBAŞ tarafından kullanılan Gmail hesabı (adres bu belgede güvenlik ve mahremiyet nedeniyle tekrar edilmemiştir)
- **İnceleme tarihi:** 22.11.2026
- **Hesap türü:** Kullanıcı tarafından kişisel Gmail hesabı olarak belirtilmiştir.
- **Durum:** Gmail ayarları incelendi; bu incelemede ayar değişikliği yapılmadı.

## 1. İncelenen Gmail ayarları

Kullanıcının 22.11.2026 tarihinde paylaştığı “Yönlendirme ve POP/IMAP” ekran görüntüsüne göre:

| Ayar | Ekranda görülen durum | İnceleme notu |
|---|---|---|
| POP erişimi | POP devre dışı | POP üzerinden başka bir istemcinin posta indirmesi etkin değil. |
| IMAP erişimi | IMAP erişimi açık | Harici bir e-posta istemcisi hesaba IMAP ile bağlanabilir. Bu nedenle bağlı istemcilerin kendi silme davranışları ayrıca kontrol edilmelidir. |
| IMAP'ta ileti silindi olarak işaretlendiğinde | Otomatik kaldırma kapalı – istemcinin sunucuyu güncellemesini bekle | Silme işaretinin otomatik olarak hemen sunucudan temizlenmesi kapalı. |
| Son görünür IMAP klasöründen kaldırıldığında | İletiyi arşivle (varsayılan) | Kalıcı silme seçeneği seçili değil; ileti arşivlenir. |
| IMAP klasör boyutu | Sınırsız (varsayılan) | Saklama/imha süresi belirlemez. |

**Uygulama kararı:** İncelenen seçenekler mevcut haliyle bırakıldı. “Değişiklikleri Kaydet” düğmesine basılmadı; ekranda değişiklik yapılmadı.

## 2. Gmail'in yerleşik silme davranışı

Google'ın resmî yardımına göre Gmail'in Çöp Kutusu ve Spam klasöründeki iletiler, kullanıcı daha önce manuel olarak boşaltmadıysa, 30 gün sonra kalıcı olarak silinir. Bu, gelen kutusundaki tüm e-postalara uygulanan 30 günlük genel saklama politikası değildir.

Kaynak: https://support.google.com/mail/answer/7015314

Gmail'de kişisel hesap kullanıcısının gelen kutusundaki bütün iletileri belirli bir yaşa göre otomatik olarak silen genel bir saklama kuralı bu ayar ekranında bulunmamaktadır. Filtreler belirli ölçütlere göre gelen iletileri yönetebilir; bunlar genel bir kurumsal saklama/imha politikası yerine geçmez.

## 3. POP ve IMAP bakımından dikkat edilmesi gerekenler

- POP şu anda kapalıdır.
- IMAP açıktır. Gmail hesabına bağlı Outlook, Apple Mail, Thunderbird, telefon uygulaması veya başka bir istemci varsa, o istemcideki silme işlemleri Gmail hesabındaki iletiyi de etkileyebilir.
- Google, IMAP istemcilerinin silme davranışlarının ve eşitleme ayarlarının kontrol edilmesini önerir.

Google kaynağı: https://support.google.com/mail/answer/78892

Bu nedenle kullanılmayan üçüncü taraf uygulama erişimleri ve bağlı e-posta istemcileri ayrıca gözden geçirilmelidir. Bu belge, hesaba bağlı tüm uygulamaların denetlendiğini iddia etmez.

## 4. Hukuki çerçeve

### 6698 sayılı Kişisel Verilerin Korunması Kanunu

- **Madde 4/2(d):** Kişisel veriler, ilgili mevzuatta öngörülen veya işlendikleri amaç için gerekli olan süre kadar muhafaza edilmelidir.
- **Madde 7:** İşlenmesini gerektiren sebepler ortadan kalktığında kişisel veriler resen veya ilgili kişinin talebi üzerine silinmeli, yok edilmeli veya anonim hâle getirilmelidir.
- **Madde 9:** Kişisel verilerin yurt dışına aktarımı için kanunda belirtilen aktarım şartları ve uygun güvence mekanizmaları değerlendirilmelidir.

Resmî kaynaklar:
- KVKK – Yurt Dışına Aktarım: https://www.kvkk.gov.tr/Icerik/2053/Yurtdisina-Aktarim
- KVKK – Standart Sözleşme Bildirim Modülü hakkında duyuru: https://www.kvkk.gov.tr/Icerik/8043/Standart-Sozlesme-Bildirim-Modulu-Hakkinda-Kamuoyu-Duyurusu

## 5. Bu incelemenin sonucu ve sınırları

1. Gmail ayar ekranında tüm e-postalara uygulanmış bir otomatik silme/saklama süresi belirlenmedi.
2. POP kapalı; IMAP açık ve silme davranışı arşivleme yönünde görünüyor. Mevcut seçenekler korunmuştur.
3. Çöp Kutusu ve Spam'deki iletilerin 30 gün sonra silinmesi, Gmail gelen kutusundaki tüm e-postaların 30 gün sonra silineceği anlamına gelmez.
4. Gmail'in kişisel hesap ayarları, KVKK bakımından tek başına saklama politikası oluşturmaz. ÇAĞBAŞ; e-posta türlerine, işleme amaçlarına ve varsa yasal saklama yükümlülüklerine göre kendi saklama ve imha prosedürünü belirlemelidir.
5. Google hizmetlerinin veri işleme/aktarım koşulları ve yurt dışına aktarım için uygulanacak hukuki mekanizma ayrıca incelenmelidir. Bu belge, Google ile ilgili aktarım mekanizmasının hukuka uygun olduğunu teyit etmez.
6. Bu kayıt teknik ayar incelemesidir; hukuki uygunluk sertifikası veya avukat görüşü değildir.

## 6. Bekleyen işler

- [ ] Gmail hesabına erişimi olan üçüncü taraf uygulama ve e-posta istemcilerini kontrol et.
- [ ] Gmail üzerinden işlenen veri kategorileri ve saklama amaçlarını ÇAĞBAŞ veri envanteriyle eşleştir.
- [ ] Google hizmetleri bakımından veri işleme şartları, veri lokasyonu ve yurt dışına aktarım mekanizmasını değerlendir.
- [ ] Veri kategorileri için saklama ve imha sürelerini belirle; süre sonunda uygulanacak silme prosedürünü yazılı hale getir.
- [ ] İlgili prosedürü uyguladıktan sonra kanıt ve kontrol tarihini bu dosyanın değişiklik geçmişine ekle.

## 7. Değişiklik geçmişi

| Tarih | İşlem | Durum |
|---|---|---|
| 22.11.2026 | Kullanıcının paylaştığı Gmail “Yönlendirme ve POP/IMAP” ekranı incelendi. POP kapalı, IMAP açık, IMAP otomatik kaldırma kapalı ve son görünür klasörden kaldırıldığında arşivleme seçiliydi. | İnceleme kaydedildi; ayar değişikliği yapılmadı. |

---
Bu belge, görülen ekran ve belirtilen resmî kaynaklarla sınırlıdır. Hesapta başka istemciler, filtreler, yönlendirmeler veya bağlı uygulamalar bulunup bulunmadığı ayrıca doğrulanmalıdır.
