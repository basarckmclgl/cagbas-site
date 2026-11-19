# ÇAĞBAŞ — İlk uyarlama paketi

Bu paket, sağlanan Myadasu kaynak projesinin mevcut sayfa düzeni ve görsel varlıkları temel alınarak ÇAĞBAŞ için hazırlanmış ilk uyarlamadır. Türkçe sayfalarda marka adı ve içerik dili tasarım odaklı hizmetlere göre güncellenmiştir.

## Hizmet alanları
- Web tasarım
- Grafik tasarım
- Sosyal medya yönetimi
- Dijital pazarlama

## Klasörler
- `front/`: Statik web arayüzü ve varlıkları
- `back/src/`: Express backend
- `back/locales/`: Dil dosyaları

## Yerel geliştirme
1. `back/src` klasörüne girin.
2. `npm install` çalıştırın.
3. `.env.example` dosyasını `.env` olarak kopyalayıp servis bilgilerini doldurun.
4. `npm start` ile backend'i başlatın.
5. `http://localhost:3000` adresini açın.

## Yayınlama notu
Frontend statik olarak Cloudflare Pages gibi bir statik barındırma hizmetine dağıtılabilir. Express backend ayrı bir Node.js barındırma ortamında çalıştırılmalıdır veya Cloudflare Workers uyumlu olacak şekilde ayrıca taşınmalıdır. Bu paket henüz canlıya dağıtılmış değildir.

## Güvenlik
Kaynak pakette bulunan API anahtarı ve SMTP parolası koddan çıkarılarak ortam değişkenlerine taşınmıştır. Kaynakta yer alan eski anahtar/parola bilgilerini iptal edip yenileyin. `.env` dosyasını GitHub'a yüklemeyin.

## Durum
Bu, marka ve içerik uyarlamasının başlangıç sürümüdür. Formlar, Mailchimp, SMTP, çok dilli içerikler ve tüm sayfa metinleri ayrıca test edilip tamamlanmalıdır.
