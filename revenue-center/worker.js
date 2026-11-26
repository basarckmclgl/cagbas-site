const SESSION_COOKIE = "rc_session";
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const PBKDF2_ITERATIONS = 100000;
const DASHBOARD_HTML = "<!doctype html>\n<html lang=\"tr\">\n<head>\n<meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n<meta name=\"robots\" content=\"noindex,nofollow\">\n<title>ÇAĞBAŞ Revenue Center — Yönetim Paneli</title>\n<style>\n:root{color-scheme:dark;--bg:#0b0a12;--panel:#13111d;--panel2:#191625;--line:#292438;--text:#f4f0ff;--muted:#a29bb5;--purple:#9b7cff;--purple2:#7452df;--green:#58d6a0;--amber:#f2bd68}\n*{box-sizing:border-box}body{margin:0;background:radial-gradient(ellipse at 75% -10%,#281b48 0,transparent 42%),var(--bg);color:var(--text);font:14px/1.5 Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif}\nbutton{font:inherit}.app{display:grid;grid-template-columns:252px minmax(0,1fr);min-height:100vh}.side{padding:26px 17px;border-right:1px solid var(--line);background:#0e0c16}.brand{display:flex;gap:12px;align-items:center;padding:0 9px 28px}.mark{width:39px;height:39px;border-radius:13px;background:linear-gradient(145deg,#b29aff,#6744d3);display:grid;place-items:center;font-weight:900;color:white;box-shadow:0 8px 25px #7651d644}.brand strong{display:block;letter-spacing:.13em;font-size:13px}.brand small{color:var(--muted);font-size:11px}.navlabel{padding:12px 10px 7px;color:#766e89;font-size:10px;letter-spacing:.14em;text-transform:uppercase}.nav{display:grid;gap:5px}.nav button{border:0;color:#aaa3b9;background:transparent;text-align:left;padding:11px 12px;border-radius:10px;cursor:pointer;display:flex;align-items:center;gap:11px}.nav button:hover,.nav button.active{background:#211a33;color:#fff}.nav button.active{box-shadow:inset 2px 0 var(--purple)}.ico{width:19px;text-align:center;color:#b49bff}.sidefoot{position:sticky;top:calc(100vh - 90px);margin:38px 8px 0;padding-top:18px;border-top:1px solid var(--line);color:var(--muted);font-size:11px}.main{min-width:0;padding:30px clamp(18px,4vw,54px) 50px}.top{display:flex;justify-content:space-between;align-items:center;gap:18px;margin-bottom:30px}.eyebrow{color:var(--purple);font-size:11px;letter-spacing:.16em;text-transform:uppercase;font-weight:700}.top h1{font-size:clamp(24px,3vw,34px);letter-spacing:-.04em;margin:5px 0}.sub{color:var(--muted);margin:0}.topright{display:flex;gap:10px;align-items:center}.pill{border:1px solid #4b3b70;background:#211a32;color:#d5c7ff;padding:7px 11px;border-radius:30px;font-size:11px}.avatar{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:#342750;color:#e5d9ff;font-weight:700}.notice{border:1px solid #574326;background:#251d14;color:#e8c994;border-radius:12px;padding:12px 15px;margin-bottom:22px;font-size:12px}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.card{background:linear-gradient(150deg,#191625,#12101a);border:1px solid var(--line);border-radius:15px;padding:18px;min-width:0}.metrichead{display:flex;justify-content:space-between;color:var(--muted);font-size:12px}.metricicon{width:30px;height:30px;display:grid;place-items:center;border-radius:9px;background:#29203e;color:#c8b5ff}.metric{font-size:27px;font-weight:750;letter-spacing:-.04em;margin:13px 0 3px}.hint{color:#827b91;font-size:11px}.sectionhead{display:flex;justify-content:space-between;align-items:center;margin:28px 0 13px}.sectionhead h2{font-size:16px;margin:0}.sectionhead span{font-size:11px;color:var(--muted)}.lower{display:grid;grid-template-columns:1.4fr 1fr;gap:14px}.bars{height:190px;display:flex;align-items:end;gap:12px;padding:20px 6px 4px;border-bottom:1px solid var(--line)}.barcol{height:100%;flex:1;display:flex;flex-direction:column;justify-content:end;align-items:center;gap:8px;color:var(--muted);font-size:10px}.bar{width:min(34px,70%);border-radius:7px 7px 2px 2px;background:linear-gradient(180deg,#b39aff,#6848ca);opacity:.9}.sources{display:grid;gap:16px;margin-top:18px}.source{display:grid;grid-template-columns:1fr auto;gap:8px;font-size:12px}.track{height:6px;background:#282333;border-radius:9px;grid-column:1/-1;overflow:hidden}.fill{height:100%;background:linear-gradient(90deg,#7050d0,#b49aff);border-radius:9px}.muted{color:var(--muted)}.tablewrap{overflow:auto}.table{width:100%;border-collapse:collapse;font-size:12px}.table th,.table td{text-align:left;padding:13px 10px;border-bottom:1px solid var(--line);white-space:nowrap}.table th{color:var(--muted);font-weight:500}.status{font-size:10px;border-radius:20px;padding:4px 8px;background:#242033;color:#c9b9f5}.status.pending{background:#2b2419;color:#e9c17e}.actions{display:flex;flex-wrap:wrap;gap:9px}.btn{border:1px solid var(--line);background:#211b30;color:#e9e2fa;padding:9px 13px;border-radius:9px;cursor:pointer}.btn.primary{background:var(--purple2);border-color:var(--purple2);color:white}.btn:hover{filter:brightness(1.13)}.page{display:none}.page.active{display:block}.modulegrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.module{min-height:150px}.module h3{font-size:14px;margin:13px 0 5px}.module p{font-size:12px;color:var(--muted);margin:0}.module .tag{font-size:10px;color:#c9b9f5}.empty{padding:28px;text-align:center;color:var(--muted);border:1px dashed #3a334b;border-radius:12px}\n@media(max-width:1050px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.modulegrid{grid-template-columns:repeat(2,minmax(0,1fr))}}\n@media(max-width:720px){.app{grid-template-columns:1fr}.side{padding:14px;border-right:0;border-bottom:1px solid var(--line)}.brand{padding:0 4px 12px}.nav{display:flex;overflow:auto}.navlabel,.sidefoot{display:none}.nav button{white-space:nowrap;padding:9px}.main{padding:22px 15px}.top{align-items:flex-start}.topright .pill{display:none}.lower{grid-template-columns:1fr}.grid{gap:9px}.card{padding:13px}.metric{font-size:22px}.modulegrid{grid-template-columns:1fr}}\n\n/* Authentication gate */\n.app{display:none}.app.ready{display:grid}\n.auth-shell{min-height:100vh;display:grid;place-items:center;padding:24px;background:radial-gradient(ellipse at 50% 0%,#2a1c4b 0,transparent 48%),var(--bg)}\n.auth-card{width:min(100%,460px);padding:30px;background:linear-gradient(150deg,#191625,#12101a);border:1px solid var(--line);border-radius:18px;box-shadow:0 24px 80px #0008}\n.auth-brand{display:flex;align-items:center;gap:12px;margin-bottom:24px}.auth-brand .mark{width:43px;height:43px}\n.auth-card h1{font-size:23px;margin:0 0 6px;letter-spacing:-.04em}.auth-card p{color:var(--muted);font-size:13px;margin:0 0 20px}\n.auth-card label{display:block;font-size:12px;color:#c9c1d8;margin:14px 0 6px}\n.auth-card input{width:100%;padding:12px 13px;border:1px solid #393249;border-radius:9px;background:#0d0b14;color:var(--text);outline:none}\n.auth-card input:focus{border-color:var(--purple)}\n.auth-card .btn{width:100%;margin-top:16px;padding:12px}.auth-card .btn:disabled{opacity:.45;cursor:not-allowed}\n.auth-note{padding:12px;border:1px solid #574326;background:#251d14;color:#e8c994;border-radius:10px;font-size:12px;margin:14px 0}\n.auth-error{color:#ff9b9b;font-size:12px;min-height:18px;margin-top:10px}\n.auth-switch{font-size:12px;color:var(--muted);margin-top:16px}\n.auth-inline{display:flex;gap:8px;align-items:center}.auth-inline input{min-width:0}\n.auth-inline .btn{width:auto;white-space:nowrap;margin:0;padding:10px}\n.topright .logout{font-size:11px;padding:8px 10px}\n@media(max-width:720px){.auth-card{padding:22px}.auth-inline{align-items:stretch;flex-direction:column}.auth-inline .btn{width:100%}}\n\n\n/* Light theme — high contrast for comfortable reading */\n:root{color-scheme:light;--bg:#f5f6fa;--panel:#ffffff;--panel2:#ffffff;--line:#e5e7ef;--text:#252238;--muted:#6d6a7d;--purple:#7652d6;--purple2:#6844cf;--green:#16865e;--amber:#9a650c}\nbody{background:#f5f6fa;color:var(--text)}\n.side{background:#fff;border-right:1px solid #e5e7ef}\n.brand strong{color:#28243a}.brand small{color:#777286}\n.navlabel{color:#8a8498}\n.nav button{color:#5f5a70}\n.nav button:hover,.nav button.active{background:#f0ebff;color:#4f32a7}\n.nav button.active{box-shadow:inset 3px 0 #7955d6}\n.ico{color:#7652d6}\n.sidefoot{border-top-color:#e8e5ee;color:#777286}\n.eyebrow{color:#7652d6}\n.sub,.muted{color:#6d6a7d}\n.pill{border-color:#ddd3f8;background:#f3efff;color:#5c3caf}\n.avatar{background:#eee8ff;color:#5c3caf}\n.notice{border-color:#e7d9b8;background:#fffaf0;color:#76551a}\n.card{background:#fff;border-color:#e5e7ef;box-shadow:0 3px 14px #29204708}\n.metrichead{color:#6d6a7d}\n.metricicon{background:#f0ebff;color:#6844cf}\n.hint{color:#777286}\n.bars{border-bottom-color:#e5e7ef}\n.barcol{color:#777286}\n.track{background:#eceaf1}\n.status{background:#f1edfb;color:#6546ae}\n.status.pending{background:#fff6e6;color:#8a5b0c}\n.btn{border-color:#ddd9e8;background:#fff;color:#373149}\n.btn.primary{background:#6844cf;border-color:#6844cf;color:#fff}\n.module .tag{color:#6546ae}\n.empty{color:#6d6a7d;border-color:#d9d5e2}\n.auth-shell{background:#f5f6fa}\n.auth-card{background:#fff;border-color:#e5e7ef;box-shadow:0 18px 55px #28204412}\n.auth-card h1{color:#252238}\n.auth-card p{color:#6d6a7d}\n.auth-card label{color:#49445a}\n.auth-card input{border-color:#dcd9e5;background:#fff;color:#252238}\n.auth-card input:focus{border-color:#7652d6;box-shadow:0 0 0 3px #7652d61a}\n.auth-note{border-color:#eadcbf;background:#fffaf0;color:#76551a}\n.auth-error{color:#b42318}\n\n</style>\n</head>\n<body>\n<div class=\"auth-shell\" id=\"authGate\">\n <section class=\"auth-card\">\n  <div class=\"auth-brand\"><div class=\"mark\">Ç</div><div><strong>ÇAĞBAŞ</strong><div class=\"muted\" style=\"font-size:11px;letter-spacing:.12em\">REVENUE CENTER</div></div></div>\n  <div id=\"setupPanel\" hidden>\n   <h1>Yönetici kurulumu</h1>\n   <p>İlk yönetici hesabını oluştur. Bu işlem yalnızca bir kez yapılabilir.</p>\n   <div class=\"auth-note\" id=\"setupInstructions\">Kurulum anahtarı henüz tanımlanmadı. Önce Cloudflare'da <b>cagbas-revenue-api</b> Worker'ına <b>BOOTSTRAP_SECRET</b> adlı bir Secret ekle. En az 32 karakterlik rastgele bir değer kullan. Aşağıdaki anahtar alanına aynı değeri gir.</div>\n   <form id=\"setupForm\">\n    <label for=\"setupEmail\">Yönetici e-posta adresi</label>\n    <input id=\"setupEmail\" type=\"email\" value=\"cagbas.2026@gmail.com\" autocomplete=\"username\" required>\n    <label for=\"setupKey\">Kurulum anahtarı</label>\n    <div class=\"auth-inline\"><input id=\"setupKey\" type=\"password\" minlength=\"32\" autocomplete=\"off\" required><button class=\"btn\" type=\"button\" id=\"generateKey\">Anahtar üret</button></div>\n    <label for=\"setupPassword\">Yönetici parolası (en az 12 karakter)</label>\n    <input id=\"setupPassword\" type=\"password\" minlength=\"12\" autocomplete=\"new-password\" required>\n    <label for=\"setupConfirm\">Parolayı tekrar gir</label>\n    <input id=\"setupConfirm\" type=\"password\" minlength=\"12\" autocomplete=\"new-password\" required>\n    <button class=\"btn primary\" type=\"submit\" id=\"setupSubmit\">Yönetici hesabını oluştur</button>\n    <div class=\"auth-error\" id=\"setupError\" role=\"status\"></div>\n   </form>\n  </div>\n  <div id=\"loginPanel\" hidden>\n   <h1>Yönetim paneli girişi</h1>\n   <p>Devam etmek için yönetici hesabınla oturum aç.</p>\n   <form id=\"loginForm\">\n    <label for=\"loginEmail\">E-posta</label>\n    <input id=\"loginEmail\" type=\"email\" value=\"cagbas.2026@gmail.com\" autocomplete=\"username\" required>\n    <label for=\"loginPassword\">Parola</label>\n    <input id=\"loginPassword\" type=\"password\" autocomplete=\"current-password\" required>\n    <button class=\"btn primary\" type=\"submit\">Giriş yap</button>\n    <div class=\"auth-error\" id=\"loginError\" role=\"status\"></div>\n   </form>\n  </div>\n </section>\n</div>\n<div class=\"app\" id=\"panelApp\">\n<aside class=\"side\">\n <div class=\"brand\"><div class=\"mark\">Ç</div><div><strong>ÇAĞBAŞ</strong><small>REVENUE CENTER</small></div></div>\n <div class=\"navlabel\">Yönetim</div>\n <nav class=\"nav\" aria-label=\"Panel menüsü\">\n  <button class=\"active\" data-page=\"overview\"><span class=\"ico\">▦</span>Genel Bakış</button>\n  <button data-page=\"ads\"><span class=\"ico\">▤</span>Reklam Yönetimi</button>\n  <button data-page=\"partners\"><span class=\"ico\">⇄</span>İş Ortaklıkları</button>\n  <button data-page=\"sponsors\"><span class=\"ico\">◇</span>Sponsorlar</button>\n  <button data-page=\"store\"><span class=\"ico\">▣</span>Dijital Mağaza</button>\n  <button data-page=\"leads\"><span class=\"ico\">♧</span>Müşteri Talepleri</button>\n  <button data-page=\"analytics\"><span class=\"ico\">⌁</span>Ziyaretçi Analitiği</button>\n  <button data-page=\"finance\"><span class=\"ico\">₺</span>Finansal Raporlar</button>\n </nav>\n <div class=\"sidefoot\">Bağımsız yönetim arayüzü<br>Önizleme sürümü · 0.1.0</div>\n</aside>\n<main class=\"main\">\n <header class=\"top\"><div><div class=\"eyebrow\">ÇAĞBAŞ / YÖNETİM</div><h1 id=\"pagetitle\">Genel Bakış</h1><p class=\"sub\" id=\"pagesub\">Gelir kanallarının genel performans görünümü.</p></div><div class=\"topright\"><span class=\"pill\" id=\"sessionLabel\">● Güvenli oturum</span><div class=\"avatar\" id=\"userAvatar\">Ç</div><button class=\"btn logout\" id=\"logoutBtn\" type=\"button\">Çıkış</button></div></header>\n <section class=\"page active\" id=\"overview\">\n  <div class=\"notice\">Canlı panel bağlantısı aktif. Entegre edilmemiş reklam, satış ve ödeme kanalları için veri gösterilmez.</div>\n  <div class=\"grid\">\n   <article class=\"card\"><div class=\"metrichead\">Toplam gelir <span class=\"metricicon\">₺</span></div><div class=\"metric\" id=\"metricRevenue\">₺0,00</div><div class=\"hint\">TRY cinsinden kayıtlı gelir</div></article>\n   <article class=\"card\"><div class=\"metrichead\">Ödenen sipariş <span class=\"metricicon\">▣</span></div><div class=\"metric\" id=\"metricOrders\">0</div><div class=\"hint\">Kayıtlı tüm dönem</div></article>\n   <article class=\"card\"><div class=\"metrichead\">Aktif iş ortağı <span class=\"metricicon\">♧</span></div><div class=\"metric\" id=\"metricPartners\">0</div><div class=\"hint\">Kayıtlı aktif ortaklar</div></article>\n   <article class=\"card\"><div class=\"metrichead\">Aktif gelir kanalı <span class=\"metricicon\">⌁</span></div><div class=\"metric\" id=\"metricSources\">0</div><div class=\"hint\">Aktif kaynak kayıtları</div></article>\n  </div>\n  <div class=\"sectionhead\"><h2>Gelir kanalları</h2><span>Bağlantı durumu</span></div>\n  <div class=\"lower\">\n   <article class=\"card\"><h3 style=\"margin:0;font-size:14px\">Aylık gelir görünümü</h3><p class=\"hint\">Gerçek veri bağlantısı kurulduğunda doldurulacak.</p><div class=\"bars\"><div class=\"barcol\"><div class=\"bar\" style=\"height:4%\"></div>Oca</div><div class=\"barcol\"><div class=\"bar\" style=\"height:4%\"></div>Şub</div><div class=\"barcol\"><div class=\"bar\" style=\"height:4%\"></div>Mar</div><div class=\"barcol\"><div class=\"bar\" style=\"height:4%\"></div>Nis</div><div class=\"barcol\"><div class=\"bar\" style=\"height:4%\"></div>May</div><div class=\"barcol\"><div class=\"bar\" style=\"height:4%\"></div>Haz</div><div class=\"barcol\"><div class=\"bar\" style=\"height:4%\"></div>Tem</div><div class=\"barcol\"><div class=\"bar\" style=\"height:4%\"></div>Ağu</div></div></article>\n   <article class=\"card\"><h3 style=\"margin:0;font-size:14px\">Modül hazırlık durumu</h3><div class=\"sources\">\n    <div class=\"source\"><span>Reklam ağı</span><span class=\"status pending\">Bağlantı bekliyor</span><div class=\"track\"><div class=\"fill\" style=\"width:8%\"></div></div></div>\n    <div class=\"source\"><span>Affiliate</span><span class=\"status pending\">Kurulum bekliyor</span><div class=\"track\"><div class=\"fill\" style=\"width:8%\"></div></div></div>\n    <div class=\"source\"><span>Sponsorlar</span><span class=\"status pending\">Kurulum bekliyor</span><div class=\"track\"><div class=\"fill\" style=\"width:8%\"></div></div></div>\n    <div class=\"source\"><span>Dijital mağaza</span><span class=\"status pending\">Kurulum bekliyor</span><div class=\"track\"><div class=\"fill\" style=\"width:8%\"></div></div></div>\n   </div></article>\n  </div>\n  <div class=\"sectionhead\"><h2>Son işlemler</h2><span>Canlı kayıt yok</span></div>\n  <div class=\"card empty\">Henüz işlem kaydı bulunmuyor. Güvenli veri bağlantısı tamamlandığında burada listelenecek.</div>\n </section>\n <section class=\"page\" id=\"ads\"><div class=\"notice\">Reklamlar bu prototipte yayınlanmaz. AdSense hesabı ve yayıncı onayı olmadan reklam kodu eklenmeyecektir.</div><div class=\"modulegrid\"><article class=\"card module\"><span class=\"metricicon\">▤</span><h3>Google AdSense</h3><p>Hesap bağlantısı, onay durumu ve tahmini gelir takibi.</p><div class=\"tag\">Bağlantı bekliyor</div></article><article class=\"card module\"><span class=\"metricicon\">▥</span><h3>Reklam yerleşimleri</h3><p>İzin verilen sayfalarda reklam alanı envanteri ve yerleşim planı.</p><div class=\"tag\">Henüz etkin değil</div></article><article class=\"card module\"><span class=\"metricicon\">⌁</span><h3>Performans</h3><p>Gösterim, RPM, geçerli tıklama ve gelir raporları.</p><div class=\"tag\">Veri bekliyor</div></article></div></section>\n <section class=\"page\" id=\"partners\"><div class=\"sectionhead\"><h2>Satış ortakları</h2><span>Henüz kayıt yok</span></div><div class=\"card\"><div class=\"empty\">İş ortağı hesapları ve takip bağlantıları eklendiğinde burada listelenecek.</div></div></section>\n <section class=\"page\" id=\"sponsors\"><div class=\"sectionhead\"><h2>Sponsor kayıtları</h2><span>Henüz kayıt yok</span></div><div class=\"card\"><div class=\"empty\">Sponsor firmalar, sözleşme dönemi, yayın planı ve tahsilat durumu burada yönetilecek.</div></div></section>\n <section class=\"page\" id=\"store\"><div class=\"sectionhead\"><h2>Dijital ürünler</h2><span>Mağaza henüz satışa açık değil</span></div><div class=\"modulegrid\"><article class=\"card module\"><span class=\"metricicon\">▣</span><h3>Web şablonları</h3><p>Web arayüzü ve hazır site paketleri.</p><div class=\"tag\">Taslak kategori</div></article><article class=\"card module\"><span class=\"metricicon\">✧</span><h3>Tasarım paketleri</h3><p>Grafik, sosyal medya ve marka dosyaları.</p><div class=\"tag\">Taslak kategori</div></article><article class=\"card module\"><span class=\"metricicon\">⌘</span><h3>Dijital araçlar</h3><p>İşletmeler için indirilebilir kaynaklar.</p><div class=\"tag\">Taslak kategori</div></article></div></section>\n <section class=\"page\" id=\"leads\"><div class=\"notice\">Müşteri verileri ancak aydınlatma, uygun hukuki sebep, erişim kontrolü ve saklama politikası belirlendikten sonra işlenecek.</div><div class=\"card\"><div class=\"empty\">Müşteri talepleri için güvenli form ve takip API'si henüz kurulmadı.</div></div></section>\n <section class=\"page\" id=\"analytics\"><div class=\"grid\"><article class=\"card\"><div class=\"metrichead\">Ziyaretçi</div><div class=\"metric\">—</div><div class=\"hint\">GA4 bağlantısı bekleniyor</div></article><article class=\"card\"><div class=\"metrichead\">Sayfa görüntüleme</div><div class=\"metric\">—</div><div class=\"hint\">GA4 bağlantısı bekleniyor</div></article><article class=\"card\"><div class=\"metrichead\">Dönüşüm</div><div class=\"metric\">—</div><div class=\"hint\">Olay tanımları bekleniyor</div></article><article class=\"card\"><div class=\"metrichead\">Tıklama</div><div class=\"metric\">—</div><div class=\"hint\">Olay tanımları bekleniyor</div></article></div><div class=\"card\" style=\"margin-top:14px\"><div class=\"empty\">Analitik entegrasyonu yapılana kadar ziyaretçi verisi gösterilmez.</div></div></section>\n <section class=\"page\" id=\"finance\"><div class=\"notice\">Bu bölüm muhasebe yazılımı değildir. Gerçek tahsilat ve vergi kayıtları yetkili mali müşavir süreçleriyle ayrıca doğrulanmalıdır.</div><div class=\"grid\"><article class=\"card\"><div class=\"metrichead\">Brüt gelir</div><div class=\"metric\">₺0,00</div></article><article class=\"card\"><div class=\"metrichead\">Komisyon</div><div class=\"metric\">₺0,00</div></article><article class=\"card\"><div class=\"metrichead\">Gider</div><div class=\"metric\">₺0,00</div></article><article class=\"card\"><div class=\"metrichead\">Net sonuç</div><div class=\"metric\">₺0,00</div></article></div><div class=\"card\" style=\"margin-top:14px\"><div class=\"empty\">Finansal kayıt tablosu, veri tabanı bağlantısı tamamlandığında açılacak.</div></div></section>\n</main>\n</div>\n<script>\nconst titles={overview:[\"Genel Bakış\",\"Gelir kanallarının genel performans görünümü.\"],ads:[\"Reklam Yönetimi\",\"Reklam ağları ve reklam performansı.\"],partners:[\"İş Ortaklıkları\",\"Affiliate programları ve komisyon kayıtları.\"],sponsors:[\"Sponsorlar\",\"Ticari iş birlikleri ve yayın anlaşmaları.\"],store:[\"Dijital Mağaza\",\"Dijital ürün kataloğu ve sipariş yönetimi.\"],leads:[\"Müşteri Talepleri\",\"Yönlendirilen müşteri taleplerinin takibi.\"],analytics:[\"Ziyaretçi Analitiği\",\"Ziyaret, görüntüleme ve dönüşüm ölçümü.\"],finance:[\"Finansal Raporlar\",\"Gelir, komisyon, gider ve net sonuç.\"]};\nconst authGate=document.getElementById(\"authGate\"),panelApp=document.getElementById(\"panelApp\");\nconst setupPanel=document.getElementById(\"setupPanel\"),loginPanel=document.getElementById(\"loginPanel\");\nfunction showError(id,message){document.getElementById(id).textContent=message||\"\"}\nasync function api(path,options={}){const response=await fetch(path,{...options,credentials:\"same-origin\",headers:{\"content-type\":\"application/json\",...(options.headers||{})}});let data={};try{data=await response.json()}catch{}if(!response.ok)throw new Error(data.detail?`${data.error||\"SERVER_ERROR\"}: ${data.detail}`:(data.error||\"İstek tamamlanamadı.\"));return data}\nfunction showPanel(user){authGate.hidden=true;panelApp.classList.add(\"ready\");document.getElementById(\"sessionLabel\").textContent=\"● \"+user.role;document.getElementById(\"userAvatar\").textContent=(user.email||\"Ç\").slice(0,1).toUpperCase();loadSummary()}\nfunction formatTry(minor){return new Intl.NumberFormat(\"tr-TR\",{style:\"currency\",currency:\"TRY\"}).format((Number(minor)||0)/100)}\nasync function loadSummary(){try{const s=await api(\"/api/summary\");document.getElementById(\"metricRevenue\").textContent=formatTry(s.revenueTotalMinor);document.getElementById(\"metricOrders\").textContent=s.paidOrders;document.getElementById(\"metricPartners\").textContent=s.activePartners;document.getElementById(\"metricSources\").textContent=s.activeSources}catch(e){console.warn(\"Özet verisi alınamadı:\",e.message)}}\nasync function initAuth(){try{const status=await api(\"/api/setup/status\");if(status.initialized){loginPanel.hidden=false;setupPanel.hidden=true}else{setupPanel.hidden=false;loginPanel.hidden=true;if(status.setupConfigured){document.getElementById(\"setupInstructions\").textContent=\"Kurulum anahtarı sunucuda tanımlı. Aşağıdaki alanlara aynı anahtarı ve yönetici bilgilerini gir.\"}}}catch(e){loginPanel.hidden=false;setupPanel.hidden=true;showError(\"loginError\",\"Sunucuya bağlanılamadı. Biraz sonra tekrar dene.\")}}\ndocument.getElementById(\"generateKey\").addEventListener(\"click\",()=>{const bytes=crypto.getRandomValues(new Uint8Array(32));const key=Array.from(bytes,b=>b.toString(16).padStart(2,\"0\")).join(\"\");document.getElementById(\"setupKey\").value=key;document.getElementById(\"setupKey\").type=\"text\";document.getElementById(\"setupInstructions\").textContent=\"Üretilen anahtarı kopyala. Cloudflare > Workers & Pages > cagbas-revenue-api > Settings > Variables and Secrets bölümünde BOOTSTRAP_SECRET adıyla Secret olarak kaydet. Ardından bu ekrana dönüp kurulumu tamamla.\"});\ndocument.getElementById(\"setupForm\").addEventListener(\"submit\",async e=>{e.preventDefault();showError(\"setupError\",\"\");const password=document.getElementById(\"setupPassword\").value;if(password!==document.getElementById(\"setupConfirm\").value){showError(\"setupError\",\"Parolalar eşleşmiyor.\");return}const key=document.getElementById(\"setupKey\").value;try{await api(\"/api/setup\",{method:\"POST\",headers:{\"X-Setup-Key\":key},body:JSON.stringify({email:document.getElementById(\"setupEmail\").value,password})});setupPanel.hidden=true;loginPanel.hidden=false;document.getElementById(\"loginEmail\").value=document.getElementById(\"setupEmail\").value;document.getElementById(\"setupKey\").value=\"\";document.getElementById(\"setupPassword\").value=\"\";document.getElementById(\"setupConfirm\").value=\"\";showError(\"loginError\",\"Yönetici hesabı oluşturuldu. Şimdi giriş yapabilirsin.\")}catch(err){showError(\"setupError\",err.message===\"SETUP_NOT_CONFIGURED\"?\"Önce BOOTSTRAP_SECRET değerini Cloudflare'da Secret olarak kaydet.\":err.message===\"UNAUTHORIZED\"?\"Kurulum anahtarı doğru değil.\":err.message===\"SETUP_ALREADY_COMPLETED\"?\"Kurulum daha önce tamamlanmış. Giriş yap.\":err.message)}});\ndocument.getElementById(\"loginForm\").addEventListener(\"submit\",async e=>{e.preventDefault();showError(\"loginError\",\"\");try{const result=await api(\"/api/login\",{method:\"POST\",body:JSON.stringify({email:document.getElementById(\"loginEmail\").value,password:document.getElementById(\"loginPassword\").value})});showPanel(result.user)}catch(err){showError(\"loginError\",err.message===\"INVALID_CREDENTIALS\"?\"E-posta veya parola hatalı.\":err.message===\"TOO_MANY_ATTEMPTS\"?\"Çok fazla başarısız deneme. 15 dakika sonra tekrar dene.\":err.message)}});\ndocument.getElementById(\"logoutBtn\").addEventListener(\"click\",async()=>{try{await api(\"/api/logout\",{method:\"POST\"})}finally{panelApp.classList.remove(\"ready\");authGate.hidden=false;document.getElementById(\"loginPassword\").value=\"\";initAuth()}});\ndocument.querySelectorAll(\"[data-page]\").forEach(btn=>btn.addEventListener(\"click\",()=>{document.querySelectorAll(\"[data-page]\").forEach(x=>x.classList.toggle(\"active\",x===btn));document.querySelectorAll(\".page\").forEach(x=>x.classList.toggle(\"active\",x.id===btn.dataset.page));document.getElementById(\"pagetitle\").textContent=titles[btn.dataset.page][0];document.getElementById(\"pagesub\").textContent=titles[btn.dataset.page][1]}));\n(async()=>{try{const me=await api(\"/api/me\");if(me.authenticated)showPanel(me.user);else await initAuth()}catch{await initAuth()}})();\n</script>\n</body></html>";

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      ...extraHeaders
    }
  });
}

function base64(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(value) {
  const binary = atob(value);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return base64(new Uint8Array(digest));
}

async function derivePassword(password, salt) {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    material,
    256
  );
  return base64(new Uint8Array(bits));
}

function equalText(a, b) {
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  let diff = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let i = 0; i < length; i++) diff |= (left[i] || 0) ^ (right[i] || 0);
  return diff === 0;
}

function getCookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  const pair = header.split(";").map(v => v.trim()).find(v => v.startsWith(name + "="));
  return pair ? decodeURIComponent(pair.slice(name.length + 1)) : null;
}

function cookie(value, maxAge) {
  return `${SESSION_COOKIE}=${encodeURIComponent(value)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;
}

function clearCookie() {
  return `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

function sameOrigin(request) {
  const origin = request.headers.get("Origin");
  // Browser POST requests must carry an exact same-origin Origin header.
  // Reject missing Origin as well as cross-origin requests to prevent CSRF.
  if (request.method === "POST" && !origin) return false;
  if (!origin) return true; // Read-only GET requests may omit Origin.
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

async function readJson(request) {
  if (!(request.headers.get("content-type") || "").toLowerCase().includes("application/json")) {
    throw new Error("JSON_CONTENT_TYPE_REQUIRED");
  }
  return await request.json();
}

async function getSession(request, env) {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token || token.length < 40) return null;
  const tokenHash = await sha256(token);
  const row = await env.DB.prepare(
    `SELECT u.id, u.email, u.role, u.status, s.id AS session_id
     FROM admin_sessions s JOIN admin_users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > ? AND u.status = 'active'
     LIMIT 1`
  ).bind(tokenHash, new Date().toISOString()).first();
  if (!row) return null;
  await env.DB.prepare("UPDATE admin_sessions SET last_seen_at = ? WHERE id = ?")
    .bind(new Date().toISOString(), row.session_id).run();
  return row;
}

async function requireSession(request, env) {
  return await getSession(request, env);
}

async function setup(request, env) {
  try {
    if (!env.BOOTSTRAP_SECRET || env.BOOTSTRAP_SECRET.length < 32) {
      return json({ error: "SETUP_NOT_CONFIGURED" }, 503);
    }
    const supplied = request.headers.get("X-Setup-Key") || "";
    const [expectedHash, suppliedHash] = await Promise.all([
      sha256(env.BOOTSTRAP_SECRET),
      sha256(supplied)
    ]);
    if (!equalText(expectedHash, suppliedHash)) return json({ error: "UNAUTHORIZED" }, 401);

    let body;
    try { body = await readJson(request); } catch { return json({ error: "INVALID_REQUEST" }, 400); }
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 12 || password.length > 256) {
      return json({ error: "VALID_EMAIL_AND_PASSWORD_MIN_12_REQUIRED" }, 400);
    }

    const existing = await env.DB.prepare("SELECT COUNT(*) AS count FROM admin_users").first();
    if (Number(existing?.count || 0) !== 0) return json({ error: "SETUP_ALREADY_COMPLETED" }, 409);

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const passwordHash = await derivePassword(password, salt);
    const userId = crypto.randomUUID();
    await env.DB.prepare(
      "INSERT INTO admin_users (id,email,password_hash,password_salt,role,status) VALUES (?,?,?,?, 'owner','active')"
    ).bind(userId, email, passwordHash, base64(salt)).run();

    await env.DB.prepare(
      "INSERT INTO audit_logs (id,user_id,action,resource_type,resource_id) VALUES (?,?,?,?,?)"
    ).bind(crypto.randomUUID(), userId, "owner_account_created", "admin_user", userId).run();

    return json({ success: true, message: "OWNER_CREATED" }, 201);
  } catch (error) {
    console.error("Revenue Center setup failed:", error);
    return json({ error: "INTERNAL_SERVER_ERROR", detail: String(error?.message || error).slice(0, 240) }, 500);
  }
}
async function login(request, env) {
  let body;
  try { body = await readJson(request); } catch { return json({ error: "INVALID_REQUEST" }, 400); }
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (email.length > 254 || password.length > 256) return json({ error: "INVALID_CREDENTIALS" }, 401);

  const recent = await env.DB.prepare(
    "SELECT COUNT(*) AS count FROM login_attempts WHERE email_key = ? AND attempted_at > datetime('now','-15 minutes') AND succeeded = 0"
  ).bind(email).first();
  if (Number(recent?.count || 0) >= 8) return json({ error: "TOO_MANY_ATTEMPTS" }, 429);

  const user = await env.DB.prepare(
    "SELECT id,email,password_hash,password_salt,role,status FROM admin_users WHERE email = ? LIMIT 1"
  ).bind(email).first();

  let valid = false;
  if (user && user.status === "active") {
    const candidate = await derivePassword(password, fromBase64(user.password_salt));
    valid = equalText(candidate, user.password_hash);
  }

  await env.DB.prepare(
    "INSERT INTO login_attempts (id,email_key,succeeded) VALUES (?,?,?)"
  ).bind(crypto.randomUUID(), email || "invalid", valid ? 1 : 0).run();

  if (!valid) return json({ error: "INVALID_CREDENTIALS" }, 401);

  const tokenBytes = crypto.getRandomValues(new Uint8Array(32));
  const token = base64(tokenBytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  const tokenHash = await sha256(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();
  await env.DB.prepare(
    "INSERT INTO admin_sessions (id,user_id,token_hash,expires_at) VALUES (?,?,?,?)"
  ).bind(crypto.randomUUID(), user.id, tokenHash, expiresAt).run();
  await env.DB.prepare("UPDATE admin_users SET last_login_at = ? WHERE id = ?")
    .bind(new Date().toISOString(), user.id).run();
  await env.DB.prepare("DELETE FROM admin_sessions WHERE expires_at <= ?")
    .bind(new Date().toISOString()).run();

  return json(
    { success: true, user: { email: user.email, role: user.role } },
    200,
    { "set-cookie": cookie(token, SESSION_TTL_SECONDS) }
  );
}

async function logout(request, env) {
  const token = getCookie(request, SESSION_COOKIE);
  if (token) {
    const tokenHash = await sha256(token);
    await env.DB.prepare("DELETE FROM admin_sessions WHERE token_hash = ?").bind(tokenHash).run();
  }
  return json({ success: true }, 200, { "set-cookie": clearCookie() });
}

async function handle(request, env) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/")) {
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(DASHBOARD_HTML, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
          "x-content-type-options": "nosniff",
          "x-frame-options": "DENY",
          "referrer-policy": "same-origin",
          "content-security-policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; form-action 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'"
        }
      });
    }
    if (url.pathname === "/robots.txt") {
      return new Response("User-agent: *\nDisallow: /", {
        headers: { "content-type": "text/plain; charset=utf-8", "x-content-type-options": "nosniff" }
      });
    }
    return new Response("Not Found", { status: 404, headers: { "x-content-type-options": "nosniff" } });
  }
  if (!sameOrigin(request)) return json({ error: "CROSS_ORIGIN_REQUEST_BLOCKED" }, 403);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { "allow": "GET, POST, OPTIONS" } });

  if (url.pathname === "/api/setup/status" && request.method === "GET") {
    const row = await env.DB.prepare("SELECT COUNT(*) AS count FROM admin_users").first();
    return json({
      setupConfigured: Boolean(env.BOOTSTRAP_SECRET && env.BOOTSTRAP_SECRET.length >= 32),
      initialized: Number(row?.count || 0) > 0
    });
  }

  if (url.pathname === "/api/setup" && request.method === "POST") return await setup(request, env);
  if (url.pathname === "/api/login" && request.method === "POST") return await login(request, env);
  if (url.pathname === "/api/logout" && request.method === "POST") return await logout(request, env);

  if (url.pathname === "/api/me" && request.method === "GET") {
    const session = await requireSession(request, env);
    if (!session) return json({ authenticated: false }, 401);
    return json({ authenticated: true, user: { email: session.email, role: session.role } });
  }

  if (url.pathname === "/api/summary" && request.method === "GET") {
    const session = await requireSession(request, env);
    if (!session) return json({ error: "UNAUTHENTICATED" }, 401);
    if (!["owner", "admin"].includes(session.role)) return json({ error: "FORBIDDEN" }, 403);

    const [revenue, sources, products, partners, sponsors, orders] = await Promise.all([
      env.DB.prepare(`SELECT COALESCE(SUM(CASE
        WHEN entry_type IN ('earning','commission') THEN amount_minor
        WHEN entry_type IN ('expense','refund') THEN -ABS(amount_minor)
        ELSE amount_minor END),0) AS total_minor
        FROM revenue_entries WHERE currency = 'TRY'`).first(),
      env.DB.prepare("SELECT COUNT(*) AS count FROM revenue_sources WHERE status = 'active'").first(),
      env.DB.prepare("SELECT COUNT(*) AS count FROM digital_products WHERE status = 'active'").first(),
      env.DB.prepare("SELECT COUNT(*) AS count FROM partners WHERE status = 'active'").first(),
      env.DB.prepare("SELECT COUNT(*) AS count FROM sponsor_campaigns WHERE status IN ('scheduled','published')").first(),
      env.DB.prepare("SELECT COUNT(*) AS count FROM orders WHERE payment_status = 'paid'").first()
    ]);
    return json({
      revenueTotalMinor: Number(revenue?.total_minor || 0),
      activeSources: Number(sources?.count || 0),
      activeProducts: Number(products?.count || 0),
      activePartners: Number(partners?.count || 0),
      liveSponsorCampaigns: Number(sponsors?.count || 0),
      paidOrders: Number(orders?.count || 0)
    });
  }

  return json({ error: "NOT_FOUND" }, 404);
}

export default {
  async fetch(request, env) {
    if (!env.DB) return json({ error: "DATABASE_BINDING_MISSING" }, 503);
    try {
      return await handle(request, env);
    } catch {
      return json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  }
};
