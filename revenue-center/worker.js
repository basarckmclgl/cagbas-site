const SESSION_COOKIE = "rc_session";
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const PBKDF2_ITERATIONS = 100000;
const DASHBOARD_HTML = "<!doctype html>\n<html lang=\"tr\">\n<head>\n<meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n<meta name=\"robots\" content=\"noindex,nofollow\">\n<title>ÇAĞBAŞ Revenue Center — Yönetim Paneli</title>\n<style>\n.header-logo{display:block;width:42px;height:42px;object-fit:contain;object-position:left center;margin:0 0 8px;border-radius:50%}\n\n[hidden]{display:none!important}\n\n:root{color-scheme:dark;--bg:#0b0a12;--panel:#13111d;--panel2:#191625;--line:#292438;--text:#f4f0ff;--muted:#a29bb5;--purple:#9b7cff;--purple2:#7452df;--green:#58d6a0;--amber:#f2bd68}\n*{box-sizing:border-box}body{margin:0;background:radial-gradient(ellipse at 75% -10%,#281b48 0,transparent 42%),var(--bg);color:var(--text);font:14px/1.5 Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif}\nbutton{font:inherit}.app{display:grid;grid-template-columns:252px minmax(0,1fr);min-height:100vh}.side{padding:26px 17px;border-right:1px solid var(--line);background:#0e0c16}.brand{display:flex;gap:12px;align-items:center;padding:0 9px 28px}.mark{width:39px;height:39px;border-radius:50%;display:block;object-fit:contain;background:#fff;border:1px solid #ece8f2;padding:2px;box-shadow:0 4px 14px #29204712}.brand strong{display:block;letter-spacing:.13em;font-size:13px}.brand small{color:var(--muted);font-size:11px}.navlabel{padding:12px 10px 7px;color:#766e89;font-size:10px;letter-spacing:.14em;text-transform:uppercase}.nav{display:grid;gap:5px}.nav button{border:0;color:#aaa3b9;background:transparent;text-align:left;padding:11px 12px;border-radius:10px;cursor:pointer;display:flex;align-items:center;gap:11px}.nav button:hover,.nav button.active{background:#211a33;color:#fff}.nav button.active{box-shadow:inset 2px 0 var(--purple)}.ico{width:19px;text-align:center;color:#b49bff}.sidefoot{position:sticky;top:calc(100vh - 90px);margin:38px 8px 0;padding-top:18px;border-top:1px solid var(--line);color:var(--muted);font-size:11px}.main{min-width:0;padding:30px clamp(18px,4vw,54px) 50px}.top{display:flex;justify-content:space-between;align-items:center;gap:18px;margin-bottom:30px}.eyebrow{color:var(--purple);font-size:11px;letter-spacing:.16em;text-transform:uppercase;font-weight:700}.top h1{font-size:clamp(24px,3vw,34px);letter-spacing:-.04em;margin:5px 0}.sub{color:var(--muted);margin:0}.topright{display:flex;gap:10px;align-items:center}.pill{border:1px solid #4b3b70;background:#211a32;color:#d5c7ff;padding:7px 11px;border-radius:30px;font-size:11px}.avatar{width:36px;height:36px;border-radius:50%;display:block;object-fit:contain;background:#fff;border:1px solid #ece8f2;padding:2px}.notice{border:1px solid #574326;background:#251d14;color:#e8c994;border-radius:12px;padding:12px 15px;margin-bottom:22px;font-size:12px}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.card{background:linear-gradient(150deg,#191625,#12101a);border:1px solid var(--line);border-radius:15px;padding:18px;min-width:0}.metrichead{display:flex;justify-content:space-between;color:var(--muted);font-size:12px}.metricicon{width:30px;height:30px;display:grid;place-items:center;border-radius:9px;background:#29203e;color:#c8b5ff}.metric{font-size:27px;font-weight:750;letter-spacing:-.04em;margin:13px 0 3px}.hint{color:#827b91;font-size:11px}.sectionhead{display:flex;justify-content:space-between;align-items:center;margin:28px 0 13px}.sectionhead h2{font-size:16px;margin:0}.sectionhead span{font-size:11px;color:var(--muted)}.lower{display:grid;grid-template-columns:1.4fr 1fr;gap:14px}.bars{height:190px;display:flex;align-items:end;gap:12px;padding:20px 6px 4px;border-bottom:1px solid var(--line)}.barcol{height:100%;flex:1;display:flex;flex-direction:column;justify-content:end;align-items:center;gap:8px;color:var(--muted);font-size:10px}.bar{width:min(34px,70%);border-radius:7px 7px 2px 2px;background:linear-gradient(180deg,#b39aff,#6848ca);opacity:.9}.sources{display:grid;gap:16px;margin-top:18px}.source{display:grid;grid-template-columns:1fr auto;gap:8px;font-size:12px}.track{height:6px;background:#282333;border-radius:9px;grid-column:1/-1;overflow:hidden}.fill{height:100%;background:linear-gradient(90deg,#7050d0,#b49aff);border-radius:9px}.muted{color:var(--muted)}.tablewrap{overflow:auto}.table{width:100%;border-collapse:collapse;font-size:12px}.table th,.table td{text-align:left;padding:13px 10px;border-bottom:1px solid var(--line);white-space:nowrap}.table th{color:var(--muted);font-weight:500}.status{font-size:10px;border-radius:20px;padding:4px 8px;background:#242033;color:#c9b9f5}.status.pending{background:#2b2419;color:#e9c17e}.actions{display:flex;flex-wrap:wrap;gap:9px}.btn{border:1px solid var(--line);background:#211b30;color:#e9e2fa;padding:9px 13px;border-radius:9px;cursor:pointer}.btn.primary{background:var(--purple2);border-color:var(--purple2);color:white}.btn:hover{filter:brightness(1.13)}.page{display:none}.page.active{display:block}.modulegrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.module{min-height:150px}.module h3{font-size:14px;margin:13px 0 5px}.module p{font-size:12px;color:var(--muted);margin:0}.module .tag{font-size:10px;color:#c9b9f5}.empty{padding:28px;text-align:center;color:var(--muted);border:1px dashed #3a334b;border-radius:12px}\n@media(max-width:1050px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.modulegrid{grid-template-columns:repeat(2,minmax(0,1fr))}}\n@media(max-width:720px){.app{grid-template-columns:1fr}.side{padding:14px;border-right:0;border-bottom:1px solid var(--line)}.brand{padding:0 4px 12px}.nav{display:flex;overflow:auto}.navlabel,.sidefoot{display:none}.nav button{white-space:nowrap;padding:9px}.main{padding:22px 15px}.top{align-items:flex-start}.topright .pill{display:none}.lower{grid-template-columns:1fr}.grid{gap:9px}.card{padding:13px}.metric{font-size:22px}.modulegrid{grid-template-columns:1fr}}\n\n/* Authentication gate */\n.app{display:none}.app.ready{display:grid}\n.auth-shell{min-height:100vh;display:grid;place-items:center;padding:24px;background:radial-gradient(ellipse at 50% 0%,#2a1c4b 0,transparent 48%),var(--bg)}\n.auth-card{width:min(100%,460px);padding:30px;background:linear-gradient(150deg,#191625,#12101a);border:1px solid var(--line);border-radius:18px;box-shadow:0 24px 80px #0008}\n.auth-brand{display:flex;align-items:center;gap:12px;margin-bottom:24px}.auth-brand .mark{width:43px;height:43px}\n.auth-card h1{font-size:23px;margin:0 0 6px;letter-spacing:-.04em}.auth-card p{color:var(--muted);font-size:13px;margin:0 0 20px}\n.auth-card label{display:block;font-size:12px;color:#c9c1d8;margin:14px 0 6px}\n.auth-card input{width:100%;padding:12px 13px;border:1px solid #393249;border-radius:9px;background:#0d0b14;color:var(--text);outline:none}\n.auth-card input:focus{border-color:var(--purple)}\n.auth-card .btn{width:100%;margin-top:16px;padding:12px}.auth-card .btn:disabled{opacity:.45;cursor:not-allowed}\n.auth-note{padding:12px;border:1px solid #574326;background:#251d14;color:#e8c994;border-radius:10px;font-size:12px;margin:14px 0}\n.auth-error{color:#ff9b9b;font-size:12px;min-height:18px;margin-top:10px}\n.auth-switch{font-size:12px;color:var(--muted);margin-top:16px}\n.auth-inline{display:flex;gap:8px;align-items:center}.auth-inline input{min-width:0}\n.auth-inline .btn{width:auto;white-space:nowrap;margin:0;padding:10px}\n.topright .logout{font-size:11px;padding:8px 10px}\n@media(max-width:720px){.auth-card{padding:22px}.auth-inline{align-items:stretch;flex-direction:column}.auth-inline .btn{width:100%}}\n\n\n.crud-wrap{display:grid;gap:14px}.crud-form{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;align-items:end}.crud-field{display:grid;gap:5px;font-size:11px;color:#6d6a7d}.crud-field input,.crud-field select,.crud-field textarea{width:100%;min-width:0;padding:10px;border:1px solid #dcd9e5;border-radius:8px;background:#fff;color:#252238;font:inherit}.crud-field textarea{min-height:40px;resize:vertical}.crud-actions{display:flex;gap:8px;align-items:center}.crud-table{width:100%;border-collapse:collapse;font-size:12px}.crud-table th,.crud-table td{text-align:left;padding:11px 9px;border-bottom:1px solid #e8e5ee;vertical-align:middle}.crud-table th{color:#777286;font-weight:600}.crud-table td:last-child{white-space:nowrap}.crud-table .btn{padding:6px 9px;font-size:11px}.crud-head{display:flex;justify-content:space-between;align-items:center;margin:0 0 12px}.crud-head h2{font-size:16px;margin:0}.crud-msg{font-size:12px;color:#6844cf;min-height:18px}.crud-table-wrap{overflow:auto}.crud-empty{padding:22px;text-align:center;color:#777286}.crud-form .wide{grid-column:span 2}@media(max-width:850px){.crud-form{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.crud-form{grid-template-columns:1fr}.crud-form .wide{grid-column:auto}}\n/* Light theme — high contrast for comfortable reading */\n:root{color-scheme:light;--bg:#f5f6fa;--panel:#ffffff;--panel2:#ffffff;--line:#e5e7ef;--text:#252238;--muted:#6d6a7d;--purple:#7652d6;--purple2:#6844cf;--green:#16865e;--amber:#9a650c}\nbody{background:#f5f6fa;color:var(--text)}\n.side{background:#fff;border-right:1px solid #e5e7ef}\n.brand strong{color:#28243a}.brand small{color:#777286}\n.navlabel{color:#8a8498}\n.nav button{color:#5f5a70}\n.nav button:hover,.nav button.active{background:#f0ebff;color:#4f32a7}\n.nav button.active{box-shadow:inset 3px 0 #7955d6}\n.ico{color:#7652d6}\n.sidefoot{border-top-color:#e8e5ee;color:#777286}\n.eyebrow{color:#7652d6}\n.sub,.muted{color:#6d6a7d}\n.pill{border-color:#ddd3f8;background:#f3efff;color:#5c3caf}\n.avatar{background:#eee8ff;color:#5c3caf}\n.notice{border-color:#e7d9b8;background:#fffaf0;color:#76551a}\n.card{background:#fff;border-color:#e5e7ef;box-shadow:0 3px 14px #29204708}\n.metrichead{color:#6d6a7d}\n.metricicon{background:#f0ebff;color:#6844cf}\n.hint{color:#777286}\n.bars{border-bottom-color:#e5e7ef}\n.barcol{color:#777286}\n.track{background:#eceaf1}\n.status{background:#f1edfb;color:#6546ae}\n.status.pending{background:#fff6e6;color:#8a5b0c}\n.btn{border-color:#ddd9e8;background:#fff;color:#373149}\n.btn.primary{background:#6844cf;border-color:#6844cf;color:#fff}\n.module .tag{color:#6546ae}\n.empty{color:#6d6a7d;border-color:#d9d5e2}\n.auth-shell{background:#f5f6fa}\n.auth-card{background:#fff;border-color:#e5e7ef;box-shadow:0 18px 55px #28204412}\n.auth-card h1{color:#252238}\n.auth-card p{color:#6d6a7d}\n.auth-card label{color:#49445a}\n.auth-card input{border-color:#dcd9e5;background:#fff;color:#252238}\n.auth-card input:focus{border-color:#7652d6;box-shadow:0 0 0 3px #7652d61a}\n.auth-note{border-color:#eadcbf;background:#fffaf0;color:#76551a}\n.auth-error{color:#b42318}\n\n.site-intro{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px}.site-intro h2{margin:0 0 5px;font-size:20px}.site-intro p{margin:0;color:var(--muted);font-size:13px}.site-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.site-tile{border:1px solid #e2dfeb;border-radius:15px;background:#fff;padding:22px;min-height:190px;display:flex;flex-direction:column;gap:12px;box-shadow:0 5px 18px #25204408}.site-tile:hover{border-color:#8a68ed;box-shadow:0 8px 24px #6744d318}.site-tile-head{display:flex;align-items:center;gap:12px}.site-logo{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:#f3efff;color:#6844d3;font-weight:800}.site-tile h3{margin:0;font-size:17px}.site-tile p{margin:3px 0 0;color:#777286;font-size:12px;overflow-wrap:anywhere}.site-meta{display:flex;gap:7px;flex-wrap:wrap;margin-top:auto}.site-tag{font-size:10px;padding:5px 8px;border-radius:20px;background:#f4f1fb;color:#66538d}.site-tile .btn{align-self:flex-start}.site-add-card{margin-top:18px;padding:20px}.site-form{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.site-form .crud-actions{grid-column:1/-1}.site-form .crud-field input,.site-form .crud-field select{width:100%;padding:10px;border:1px solid #dcd9e5;border-radius:8px;background:#fff;color:#252238;font:inherit}@media(max-width:850px){.site-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.site-form{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.site-grid,.site-form{grid-template-columns:1fr}.site-intro{align-items:flex-start;flex-direction:column}}\n</style>\n</head>\n<body>\n<div class=\"auth-shell\" id=\"authGate\">\n <section class=\"auth-card\">\n  <div class=\"auth-brand\"><div class=\"mark\">Ç</div><div><strong>ÇAĞBAŞ</strong><div class=\"muted\" style=\"font-size:11px;letter-spacing:.12em\">REVENUE CENTER</div></div></div>\n  <div id=\"setupPanel\" hidden>\n   <h1>Yönetici kurulumu</h1>\n   <p>İlk yönetici hesabını oluştur. Bu işlem yalnızca bir kez yapılabilir.</p>\n   <div class=\"auth-note\" id=\"setupInstructions\">Kurulum anahtarı henüz tanımlanmadı. Önce Cloudflare'da <b>cagbas-revenue-api</b> Worker'ına <b>BOOTSTRAP_SECRET</b> adlı bir Secret ekle. En az 32 karakterlik rastgele bir değer kullan. Aşağıdaki anahtar alanına aynı değeri gir.</div>\n   <form id=\"setupForm\">\n    <label for=\"setupEmail\">Yönetici e-posta adresi</label>\n    <input id=\"setupEmail\" type=\"email\" value=\"cagbas.2026@gmail.com\" autocomplete=\"username\" required>\n    <label for=\"setupKey\">Kurulum anahtarı</label>\n    <div class=\"auth-inline\"><input id=\"setupKey\" type=\"password\" minlength=\"32\" autocomplete=\"off\" required><button class=\"btn\" type=\"button\" id=\"generateKey\">Anahtar üret</button></div>\n    <label for=\"setupPassword\">Yönetici parolası (en az 12 karakter)</label>\n    <input id=\"setupPassword\" type=\"password\" minlength=\"12\" autocomplete=\"new-password\" required>\n    <label for=\"setupConfirm\">Parolayı tekrar gir</label>\n    <input id=\"setupConfirm\" type=\"password\" minlength=\"12\" autocomplete=\"new-password\" required>\n    <button class=\"btn primary\" type=\"submit\" id=\"setupSubmit\">Yönetici hesabını oluştur</button>\n    <div class=\"auth-error\" id=\"setupError\" role=\"status\"></div>\n   </form>\n  </div>\n  <div id=\"loginPanel\" hidden>\n   <h1>Yönetim paneli girişi</h1>\n   <p>Devam etmek için yönetici hesabınla oturum aç.</p>\n   <form id=\"loginForm\">\n    <label for=\"loginEmail\">E-posta</label>\n    <input id=\"loginEmail\" type=\"email\" value=\"cagbas.2026@gmail.com\" autocomplete=\"username\" required>\n    <label for=\"loginPassword\">Parola</label>\n    <input id=\"loginPassword\" type=\"password\" autocomplete=\"current-password\" required>\n    <div id=\"otpStep\" hidden><label for=\"loginOtp\">SMS kodu</label><input id=\"loginOtp\" inputmode=\"numeric\" maxlength=\"6\"><button class=\"btn primary\" id=\"verifyOtpBtn\" type=\"button\">Kodu doğrula</button></div>\n    <button class=\"btn primary\" id=\"loginSubmit\" type=\"submit\">Giriş yap</button>\n    <div class=\"auth-error\" id=\"loginError\" role=\"status\"></div>\n   </form>\n  </div>\n </section>\n</div>\n<div class=\"app\" id=\"panelApp\">\n<aside class=\"side\">\n <div class=\"brand\"><img class=\"mark brand-emblem\" src=\"data:image/png;base64,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\" alt=\"ÇAĞBAŞ amblemi\"><div><strong>ÇAĞBAŞ</strong><small>REVENUE CENTER</small></div></div>\n <div class=\"navlabel\">Yönetim</div>\n <nav class=\"nav\" aria-label=\"Panel menüsü\">\n  <button class=\"active\" data-page=\"sites\"><span class=\"ico\">▦</span>Sitelerim</button>\n  <button data-page=\"shared\"><span class=\"ico\">◎</span>Ortak Merkez</button>\n  <div class=\"navlabel\">SEÇİLİ SİTE</div>\n  <button data-page=\"overview\" data-site-page=\"true\"><span class=\"ico\">▦</span>Genel Bakış</button>\n  <button data-page=\"ads\" data-site-page=\"true\"><span class=\"ico\">▤</span>Reklam Yönetimi</button>\n  <button data-page=\"partners\" data-site-page=\"true\"><span class=\"ico\">⇄</span>İş Ortaklıkları</button>\n  <button data-page=\"sponsors\" data-site-page=\"true\"><span class=\"ico\">◇</span>Sponsorlar</button>\n  <button data-page=\"store\" data-site-page=\"true\"><span class=\"ico\">▣</span>Dijital Mağaza</button>\n  <button data-page=\"leads\" data-site-page=\"true\"><span class=\"ico\">♧</span>Müşteri Talepleri</button>\n  <button data-page=\"analytics\" data-site-page=\"true\"><span class=\"ico\">⌁</span>Ziyaretçi Analitiği</button>\n  <button data-page=\"finance\" data-site-page=\"true\"><span class=\"ico\">₺</span>Finansal Raporlar</button>\n </nav>\n <div class=\"sidefoot\">Bağımsız yönetim arayüzü<br>Önizleme sürümü · 0.1.0</div>\n</aside>\n<main class=\"main\">\n <header class=\"top\"><div><img class=\"header-logo\" src=\"data:image/png;base64,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\" alt=\"ÇAĞBAŞ sembolü\" width=\"42\" height=\"42\"><h1 id=\"pagetitle\">Genel Bakış</h1><p class=\"sub\" id=\"pagesub\">Gelir kanallarının genel performans görünümü.</p></div><div class=\"topright\"><span class=\"pill\" id=\"activeSitePill\" hidden>Site seçilmedi</span><span class=\"pill\" id=\"sessionLabel\">● Güvenli oturum</span><img class=\"avatar\" id=\"userAvatar\" src=\"data:image/png;base64,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\" alt=\"ÇAĞBAŞ amblemi\"><button class=\"btn logout\" id=\"logoutBtn\" type=\"button\">Çıkış</button></div></header>\n <section class=\"page active\" id=\"sites\">\n  <div class=\"site-intro\"><div><h2>Yönetim alanı seç</h2><p>İşletme veya internet sitesi seçerek kendi verilerine geç.</p></div><button class=\"btn primary\" id=\"showAddSite\">＋ Yeni Site Ekle</button></div>\n  <div class=\"site-grid\" id=\"siteGrid\"></div>\n  <div class=\"card site-add-card\" id=\"addSiteCard\" hidden>\n   <div class=\"crud-head\"><h2>Yeni internet sitesi ekle</h2><button class=\"btn\" type=\"button\" id=\"hideAddSite\">Kapat</button></div>\n   <form class=\"site-form\" id=\"siteForm\">\n    <label class=\"crud-field\">Site / işletme adı<input name=\"name\" required placeholder=\"Örn. Yeni İşletme\"></label>\n    <label class=\"crud-field\">Alan adı<input name=\"domain\" type=\"url\" required placeholder=\"https://ornek.com\"></label>\n    <label class=\"crud-field\">Müşteri / işletme sahibi<input name=\"client_name\" placeholder=\"İşletme adı veya yetkili\"></label>\n    <label class=\"crud-field\">Site türü<select name=\"site_type\"><option value=\"client\">Müşteri sitesi</option><option value=\"own\">Kendi sitem</option></select></label>\n    <label class=\"crud-field\">GA4 Ölçüm Kimliği (G-...)<input name=\"ga4_measurement_id\" placeholder=\"G-XXXXXXXXXX\"></label>\n    <label class=\"crud-field\">GA4 Mülk Kimliği<input name=\"ga4_property_id\" placeholder=\"Örn. 123456789\"></label>\n    <div class=\"crud-actions\"><button class=\"btn primary\" type=\"submit\">Siteyi kaydet</button><span class=\"crud-msg\" id=\"siteFormMsg\"></span></div>\n   </form>\n   <p class=\"hint\">Site kaydı oluşturulur. Ziyaretçi verilerinin otomatik alınması için ayrıca Google Analytics yetkilendirmesi gerekir.</p>\n  </div>\n </section>\n <section class=\"page\" id=\"shared\">\n  <div class=\"notice\">Ortak Merkez bütün kayıtlı sitelerin toplam performansını gösterir. Her sitenin ayrıntılı işlemleri kendi alanında tutulur.</div>\n  <div class=\"grid\">\n   <article class=\"card\"><div class=\"metrichead\">Toplam gelir</div><div class=\"metric\" id=\"sharedRevenue\">₺0,00</div><div class=\"hint\">Bütün siteler · TRY</div></article>\n   <article class=\"card\"><div class=\"metrichead\">Ödenen sipariş</div><div class=\"metric\" id=\"sharedOrders\">0</div><div class=\"hint\">Bütün siteler</div></article>\n   <article class=\"card\"><div class=\"metrichead\">Aktif iş ortağı</div><div class=\"metric\" id=\"sharedPartners\">0</div><div class=\"hint\">Bütün siteler</div></article>\n   <article class=\"card\"><div class=\"metrichead\">Aktif gelir kanalı</div><div class=\"metric\" id=\"sharedSources\">0</div><div class=\"hint\">Bütün siteler</div></article>\n  </div>\n  <div class=\"sectionhead\"><h2>Yönetilen siteler</h2><span>Site bazlı çalışma alanları</span></div>\n  <div class=\"site-grid\" id=\"sharedSiteGrid\"></div>\n </section>\n <section class=\"page\" id=\"overview\">\n  <div class=\"notice\">Canlı panel bağlantısı aktif. Entegre edilmemiş reklam, satış ve ödeme kanalları için veri gösterilmez.</div>\n  <div class=\"grid\">\n   <article class=\"card\"><div class=\"metrichead\">Toplam gelir <span class=\"metricicon\">₺</span></div><div class=\"metric\" id=\"metricRevenue\">₺0,00</div><div class=\"hint\">TRY cinsinden kayıtlı gelir</div></article>\n   <article class=\"card\"><div class=\"metrichead\">Ödenen sipariş <span class=\"metricicon\">▣</span></div><div class=\"metric\" id=\"metricOrders\">0</div><div class=\"hint\">Kayıtlı tüm dönem</div></article>\n   <article class=\"card\"><div class=\"metrichead\">Aktif iş ortağı <span class=\"metricicon\">♧</span></div><div class=\"metric\" id=\"metricPartners\">0</div><div class=\"hint\">Kayıtlı aktif ortaklar</div></article>\n   <article class=\"card\"><div class=\"metrichead\">Aktif gelir kanalı <span class=\"metricicon\">⌁</span></div><div class=\"metric\" id=\"metricSources\">0</div><div class=\"hint\">Aktif kaynak kayıtları</div></article>\n  </div>\n  <div class=\"sectionhead\"><h2>Gelir kanalları</h2><span>Bağlantı durumu</span></div>\n  <div class=\"lower\">\n   <article class=\"card\"><h3 style=\"margin:0;font-size:14px\">Aylık gelir görünümü</h3><p class=\"hint\">Gerçek veri bağlantısı kurulduğunda doldurulacak.</p><div class=\"bars\"><div class=\"barcol\"><div class=\"bar\" style=\"height:4%\"></div>Oca</div><div class=\"barcol\"><div class=\"bar\" style=\"height:4%\"></div>Şub</div><div class=\"barcol\"><div class=\"bar\" style=\"height:4%\"></div>Mar</div><div class=\"barcol\"><div class=\"bar\" style=\"height:4%\"></div>Nis</div><div class=\"barcol\"><div class=\"bar\" style=\"height:4%\"></div>May</div><div class=\"barcol\"><div class=\"bar\" style=\"height:4%\"></div>Haz</div><div class=\"barcol\"><div class=\"bar\" style=\"height:4%\"></div>Tem</div><div class=\"barcol\"><div class=\"bar\" style=\"height:4%\"></div>Ağu</div></div></article>\n   <article class=\"card\"><h3 style=\"margin:0;font-size:14px\">Modül hazırlık durumu</h3><div class=\"sources\">\n    <div class=\"source\"><span>Reklam ağı</span><span class=\"status pending\">Bağlantı bekliyor</span><div class=\"track\"><div class=\"fill\" style=\"width:8%\"></div></div></div>\n    <div class=\"source\"><span>Affiliate</span><span class=\"status pending\">Kurulum bekliyor</span><div class=\"track\"><div class=\"fill\" style=\"width:8%\"></div></div></div>\n    <div class=\"source\"><span>Sponsorlar</span><span class=\"status pending\">Kurulum bekliyor</span><div class=\"track\"><div class=\"fill\" style=\"width:8%\"></div></div></div>\n    <div class=\"source\"><span>Dijital mağaza</span><span class=\"status pending\">Kurulum bekliyor</span><div class=\"track\"><div class=\"fill\" style=\"width:8%\"></div></div></div>\n   </div></article>\n  </div>\n  <div class=\"sectionhead\"><h2>Son işlemler</h2><span>Canlı kayıt yok</span></div>\n  <div class=\"card empty\">Henüz işlem kaydı bulunmuyor. Güvenli veri bağlantısı tamamlandığında burada listelenecek.</div>\n </section>\n <section class=\"page\" id=\"ads\">\n  <div class=\"card\" style=\"margin-bottom:16px\">\n   <div class=\"crud-head\"><h2>Google AdSense bağlantısı</h2><span class=\"status pending\" id=\"adsenseConnectionBadge\">Durum kontrol ediliyor</span></div>\n   <p class=\"muted\" style=\"font-size:13px;margin:0 0 14px\">ÇAĞBAŞ AdSense hesabı salt okunur Google yetkilendirmesiyle bağlanır. Bu panel hesabınızda değişiklik yapmaz.</p>\n   <div class=\"actions\"><button class=\"btn primary\" type=\"button\" id=\"connectAdsenseBtn\">Google AdSense'i yeniden bağla</button><button class=\"btn\" type=\"button\" id=\"loadAdsenseReportBtn\" disabled>Son 7 gün raporunu getir</button></div>\n   <p class=\"hint\" id=\"adsenseConnectionNote\" style=\"margin:12px 0 0\">Bağlantı durumu kontrol ediliyor.</p>\n  </div>\n  <div class=\"grid\" id=\"adsenseMetrics\" style=\"margin-bottom:16px\">\n   <article class=\"card\"><div class=\"metrichead\">Tahmini kazanç</div><div class=\"metric\" id=\"adsenseEarnings\">—</div><div class=\"hint\">Son 7 gün</div></article>\n   <article class=\"card\"><div class=\"metrichead\">Sayfa görüntüleme</div><div class=\"metric\" id=\"adsensePageViews\">—</div><div class=\"hint\">Son 7 gün</div></article>\n   <article class=\"card\"><div class=\"metrichead\">Tıklamalar</div><div class=\"metric\" id=\"adsenseClicks\">—</div><div class=\"hint\">Son 7 gün</div></article>\n   <article class=\"card\"><div class=\"metrichead\">Reklam gösterimleri</div><div class=\"metric\" id=\"adsenseImpressions\">—</div><div class=\"hint\">Son 7 gün</div></article>\n  </div>\n  <div class=\"notice\" id=\"adsenseReportNote\">Rapor verileri Google AdSense hesabından doğrudan okunur; gelir kayıtlarına otomatik veya mükerrer kayıt eklenmez.</div>\n  <div class=\"card\" style=\"margin:14px 0\"><div class=\"sectionhead\" style=\"margin:0 0 10px\"><h2>AdSense Ödeme İşlemleri</h2><span>Google ödeme merkezi</span></div><p class=\"muted\" style=\"margin:0 0 14px;font-size:12px\">AdSense ödemeleri, ödeme eşiği ve hesap koşulları tamamlandığında Google tarafından kayıtlı banka hesabına gönderilir. Bu bağlantı Google ödeme ayarlarını açar; panelden doğrudan para transferi yapılmaz.</p><a class=\"btn primary\" href=\"https://adsense.google.com/adsense/login?authuser=2\" target=\"_blank\" rel=\"noopener noreferrer\">Para Çek / Aktar</a></div>\n  <div id=\"sourcesMount\"></div>\n </section>\n <section class=\"page\" id=\"partners\"><div id=\"partnersMount\"></div></section>\n <section class=\"page\" id=\"sponsors\"><div id=\"sponsorsMount\"></div></section>\n <section class=\"page\" id=\"store\"><div id=\"productsMount\"></div><div class=\"sectionhead\"><h2>Siparişler</h2><span>Manuel sipariş kaydı</span></div><div id=\"ordersMount\"></div></section>\n <section class=\"page\" id=\"leads\"><div class=\"notice\">Müşteri verileri ancak aydınlatma, uygun hukuki sebep, erişim kontrolü ve saklama politikası belirlendikten sonra işlenecek.</div><div class=\"card\"><div class=\"empty\">Müşteri talepleri için güvenli form ve takip API'si henüz kurulmadı.</div></div></section>\n <section class=\"page\" id=\"analytics\"><div class=\"grid\"><article class=\"card\"><div class=\"metrichead\">Ziyaretçi</div><div class=\"metric\">—</div><div class=\"hint\">GA4 bağlantısı bekleniyor</div></article><article class=\"card\"><div class=\"metrichead\">Sayfa görüntüleme</div><div class=\"metric\">—</div><div class=\"hint\">GA4 bağlantısı bekleniyor</div></article><article class=\"card\"><div class=\"metrichead\">Dönüşüm</div><div class=\"metric\">—</div><div class=\"hint\">Olay tanımları bekleniyor</div></article><article class=\"card\"><div class=\"metrichead\">Tıklama</div><div class=\"metric\">—</div><div class=\"hint\">Olay tanımları bekleniyor</div></article></div><div class=\"card\" style=\"margin-top:14px\"><div class=\"empty\">Analitik entegrasyonu yapılana kadar ziyaretçi verisi gösterilmez.</div></div></section>\n <section class=\"page\" id=\"finance\"><div class=\"notice\">Finansal kayıtlar gerçek veri tabanından hesaplanır. Bu bölüm muhasebe yazılımı değildir.</div><div id=\"entriesMount\"></div><div class=\"sectionhead\"><h2>Finansal özet</h2><span>Gerçek kayıtlar</span></div><div id=\"financeSummary\" class=\"grid\"></div></section>\n </main>\n</div>\n<script>\nconst titles={sites:[\"Sitelerim\",\"Yönetilecek internet sitelerini seç veya yeni site ekle.\"],shared:[\"Ortak Merkez\",\"Bütün sitelerin ortak performans görünümü.\"],overview:[\"Genel Bakış\",\"Gelir kanallarının genel performans görünümü.\"],ads:[\"Reklam Yönetimi\",\"Reklam ağları ve reklam performansı.\"],partners:[\"İş Ortaklıkları\",\"Affiliate programları ve komisyon kayıtları.\"],sponsors:[\"Sponsorlar\",\"Ticari iş birlikleri ve yayın anlaşmaları.\"],store:[\"Dijital Mağaza\",\"Dijital ürün kataloğu ve sipariş yönetimi.\"],leads:[\"Müşteri Talepleri\",\"Yönlendirilen müşteri taleplerinin takibi.\"],analytics:[\"Ziyaretçi Analitiği\",\"Ziyaret, görüntüleme ve dönüşüm ölçümü.\"],finance:[\"Finansal Raporlar\",\"Gelir, komisyon, gider ve net sonuç.\"]};\nconst authGate=document.getElementById(\"authGate\"),panelApp=document.getElementById(\"panelApp\");\nconst setupPanel=document.getElementById(\"setupPanel\"),loginPanel=document.getElementById(\"loginPanel\");\nfunction showError(id,message){document.getElementById(id).textContent=message||\"\"}\nlet currentSiteId=null,currentSiteName=\"\",managedSites=[];\nasync function api(path,options={}){if(currentSiteId&&/^\\/api\\/(summary|partners|sponsors|products|sources|entries|orders)(?:\\/|$)/.test(path))path+=(path.includes(\"?\")?\"&\":\"?\")+\"site_id=\"+encodeURIComponent(currentSiteId);const response=await fetch(path,{...options,credentials:\"same-origin\",headers:{\"content-type\":\"application/json\",...(options.headers||{})}});let data={};try{data=await response.json()}catch{}if(!response.ok)throw new Error(data.detail?`${data.error||\"SERVER_ERROR\"}: ${data.detail}`:(data.error||\"İstek tamamlanamadı.\"));return data}\nfunction showPanel(user){authGate.hidden=true;panelApp.classList.add(\"ready\");document.getElementById(\"sessionLabel\").textContent=\"● \"+user.role;currentSiteId=null;currentSiteName=\"\";document.getElementById(\"activeSitePill\").hidden=true;activatePage(\"sites\");loadSites()}\nfunction formatTry(minor){return new Intl.NumberFormat(\"tr-TR\",{style:\"currency\",currency:\"TRY\"}).format((Number(minor)||0)/100)}\nasync function loadSummary(){try{const s=await api(\"/api/summary\");document.getElementById(\"metricRevenue\").textContent=formatTry(s.revenueTotalMinor);document.getElementById(\"metricOrders\").textContent=s.paidOrders;document.getElementById(\"metricPartners\").textContent=s.activePartners;document.getElementById(\"metricSources\").textContent=s.activeSources}catch(e){console.warn(\"Özet verisi alınamadı:\",e.message)}}\nasync function initAuth(){try{const status=await api(\"/api/setup/status\");if(status.initialized){loginPanel.hidden=false;setupPanel.hidden=true}else{setupPanel.hidden=false;loginPanel.hidden=true;if(status.setupConfigured){document.getElementById(\"setupInstructions\").textContent=\"Kurulum anahtarı sunucuda tanımlı. Aşağıdaki alanlara aynı anahtarı ve yönetici bilgilerini gir.\"}}}catch(e){loginPanel.hidden=false;setupPanel.hidden=true;showError(\"loginError\",\"Sunucuya bağlanılamadı. Biraz sonra tekrar dene.\")}}\ndocument.getElementById(\"generateKey\").addEventListener(\"click\",()=>{const bytes=crypto.getRandomValues(new Uint8Array(32));const key=Array.from(bytes,b=>b.toString(16).padStart(2,\"0\")).join(\"\");document.getElementById(\"setupKey\").value=key;document.getElementById(\"setupKey\").type=\"text\";document.getElementById(\"setupInstructions\").textContent=\"Üretilen anahtarı kopyala. Cloudflare > Workers & Pages > cagbas-revenue-api > Settings > Variables and Secrets bölümünde BOOTSTRAP_SECRET adıyla Secret olarak kaydet. Ardından bu ekrana dönüp kurulumu tamamla.\"});\ndocument.getElementById(\"setupForm\").addEventListener(\"submit\",async e=>{e.preventDefault();showError(\"setupError\",\"\");const password=document.getElementById(\"setupPassword\").value;if(password!==document.getElementById(\"setupConfirm\").value){showError(\"setupError\",\"Parolalar eşleşmiyor.\");return}const key=document.getElementById(\"setupKey\").value;try{await api(\"/api/setup\",{method:\"POST\",headers:{\"X-Setup-Key\":key},body:JSON.stringify({email:document.getElementById(\"setupEmail\").value,password})});setupPanel.hidden=true;loginPanel.hidden=false;document.getElementById(\"loginEmail\").value=document.getElementById(\"setupEmail\").value;document.getElementById(\"setupKey\").value=\"\";document.getElementById(\"setupPassword\").value=\"\";document.getElementById(\"setupConfirm\").value=\"\";showError(\"loginError\",\"Yönetici hesabı oluşturuldu. Şimdi giriş yapabilirsin.\")}catch(err){showError(\"setupError\",err.message===\"SETUP_NOT_CONFIGURED\"?\"Önce BOOTSTRAP_SECRET değerini Cloudflare'da Secret olarak kaydet.\":err.message===\"UNAUTHORIZED\"?\"Kurulum anahtarı doğru değil.\":err.message===\"SETUP_ALREADY_COMPLETED\"?\"Kurulum daha önce tamamlanmış. Giriş yap.\":err.message)}});\nlet otpChallenge=null;document.getElementById(\"loginForm\").addEventListener(\"submit\",async e=>{e.preventDefault();showError(\"loginError\",\"\");try{const r=await api(\"/api/login\",{method:\"POST\",body:JSON.stringify({email:document.getElementById(\"loginEmail\").value,password:document.getElementById(\"loginPassword\").value})});otpChallenge=r.challenge_id;document.getElementById(\"otpStep\").hidden=false;document.getElementById(\"loginSubmit\").hidden=true;showError(\"loginError\",\"Kod SMS ile gönderildi: \"+r.masked_phone)}catch(err){showError(\"loginError\",err.message)}});document.getElementById(\"verifyOtpBtn\").addEventListener(\"click\",async()=>{try{const r=await api(\"/api/login/verify-otp\",{method:\"POST\",body:JSON.stringify({challenge_id:otpChallenge,code:document.getElementById(\"loginOtp\").value})});showPanel(r.user)}catch(err){showError(\"loginError\",err.message)}});\ndocument.getElementById(\"connectAdsenseBtn\").addEventListener(\"click\",()=>{if(!currentSiteId){alert(\"Önce Sitelerim bölümünden ÇAĞBAŞ sitesini seç.\");return}if(currentSiteId!==\"site-cagbas\"){alert(\"Google AdSense bağlantısı şu anda yalnızca ÇAĞBAŞ için etkin.\");return}window.location.href=\"/oauth/google/start\"});\n\nasync function loadAdsenseStatus(){\n const badge=document.getElementById(\"adsenseConnectionBadge\"),note=document.getElementById(\"adsenseConnectionNote\"),reportBtn=document.getElementById(\"loadAdsenseReportBtn\");\n try{\n  const status=await api(\"/api/adsense/status\");\n  badge.textContent=status.connected?\"Bağlandı\":\"Bağlantı bekliyor\";\n  badge.classList.toggle(\"pending\",!status.connected);\n  reportBtn.disabled=!status.connected;\n  note.textContent=status.connected?\"Google AdSense hesabı güvenli şekilde bağlı. Son bağlantı: \"+new Date(status.connectedAt).toLocaleString(\"tr-TR\"):\"AdSense hesabı henüz bağlanmadı.\";\n  document.getElementById(\"connectAdsenseBtn\").hidden=status.connected;\n }catch(err){badge.textContent=\"Kontrol edilemedi\";note.textContent=\"Bağlantı durumu alınamadı: \"+err.message}\n}\nasync function loadAdsenseReport(){\n const button=document.getElementById(\"loadAdsenseReportBtn\"),note=document.getElementById(\"adsenseReportNote\");\n button.disabled=true;button.textContent=\"Rapor alınıyor…\";note.textContent=\"Google AdSense raporu isteniyor.\";\n try{\n  const r=await api(\"/api/adsense/report\");\n  const money=new Intl.NumberFormat(\"tr-TR\",{style:\"currency\",currency:r.currencyCode||\"USD\"}).format(Number(r.estimatedEarnings||0));\n  document.getElementById(\"adsenseEarnings\").textContent=money;\n  document.getElementById(\"adsensePageViews\").textContent=Number(r.pageViews||0).toLocaleString(\"tr-TR\");\n  document.getElementById(\"adsenseClicks\").textContent=Number(r.clicks||0).toLocaleString(\"tr-TR\");\n  document.getElementById(\"adsenseImpressions\").textContent=Number(r.impressions||0).toLocaleString(\"tr-TR\");\n  note.textContent=\"Hesap: \"+r.accountName+\" · Rapor dönemi: Son 7 gün · Son güncelleme: \"+new Date(r.reportDate).toLocaleString(\"tr-TR\");\n }catch(err){note.textContent=\"Rapor alınamadı: \"+err.message}\n finally{button.disabled=false;button.textContent=\"Son 7 gün raporunu getir\"}\n}\ndocument.getElementById(\"loadAdsenseReportBtn\").addEventListener(\"click\",loadAdsenseReport);\n\ndocument.getElementById(\"logoutBtn\").addEventListener(\"click\",async()=>{try{await api(\"/api/logout\",{method:\"POST\"})}finally{panelApp.classList.remove(\"ready\");authGate.hidden=false;document.getElementById(\"loginPassword\").value=\"\";initAuth()}});\nfunction activatePage(page){document.querySelectorAll(\"[data-page]\").forEach(x=>x.classList.toggle(\"active\",x.dataset.page===page));document.querySelectorAll(\".page\").forEach(x=>x.classList.toggle(\"active\",x.id===page));document.getElementById(\"pagetitle\").textContent=titles[page][0];document.getElementById(\"pagesub\").textContent=titles[page][1];const pill=document.getElementById(\"activeSitePill\");if(page===\"sites\")pill.hidden=true;else{pill.hidden=false;pill.textContent=page===\"shared\"?\"● Ortak Merkez\":(currentSiteName?\"● \"+currentSiteName:\"Site seçilmedi\")}}\ndocument.querySelectorAll(\"[data-page]\").forEach(btn=>btn.addEventListener(\"click\",()=>{const page=btn.dataset.page;if(btn.dataset.sitePage===\"true\"&&!currentSiteId){activatePage(\"sites\");return}if(page===\"shared\"){currentSiteId=null;currentSiteName=\"\";activatePage(\"shared\");loadSharedSummary();loadSites();return}if(page===\"sites\"){currentSiteId=null;currentSiteName=\"\";activatePage(\"sites\");loadSites();return}activatePage(page)}));\nfunction siteTile(site){const kind=site.site_type===\"own\"?\"Kendi sitem\":\"Müşteri sitesi\";const ga=site.ga4_property_id?\"GA4 mülkü tanımlı\":site.ga4_measurement_id?\"Ölçüm kimliği tanımlı\":\"Analitik bağlantısı bekliyor\";const initial=site.slug===\"edwise\"?\"E\":site.slug===\"cagbas\"?\"Ç\":\"＋\";return '<article class=\"site-tile\"><div class=\"site-tile-head\"><div class=\"site-logo\">'+initial+'</div><div><h3>'+esc(site.name)+'</h3><p>'+esc(site.domain||\"Alan adı eklenmedi\")+'</p></div></div><div class=\"site-meta\"><span class=\"site-tag\">'+kind+'</span><span class=\"site-tag\">'+ga+'</span></div><p>'+esc(site.client_name||\"\")+'</p><button class=\"btn primary\" data-open-site=\"'+esc(site.id)+'\">Yönetim alanını aç</button></article>'}\nasync function loadSites(){try{const r=await api(\"/api/sites\");managedSites=r.items||[];const cards=managedSites.map(siteTile).join(\"\");const plus='<article class=\"site-tile\"><div class=\"site-logo\">＋</div><h3>Yeni Site Ekle</h3><p>Yeni bir işletme veya internet sitesi oluştur.</p><button class=\"btn\" data-add-site=\"true\">Site ekle</button></article>';document.getElementById(\"siteGrid\").innerHTML=cards+plus;document.getElementById(\"sharedSiteGrid\").innerHTML=cards;document.querySelectorAll(\"[data-open-site]\").forEach(btn=>btn.addEventListener(\"click\",()=>selectSite(btn.dataset.openSite)));document.querySelectorAll(\"[data-add-site]\").forEach(btn=>btn.addEventListener(\"click\",()=>{document.getElementById(\"addSiteCard\").hidden=false;document.getElementById(\"addSiteCard\").scrollIntoView({behavior:\"smooth\",block:\"center\"})}))}catch(err){document.getElementById(\"siteGrid\").innerHTML='<div class=\"card crud-empty\">Siteler yüklenemedi: '+esc(err.message)+'</div>'}}\nasync function selectSite(id){const site=managedSites.find(x=>x.id===id);if(!site)return;currentSiteId=site.id;currentSiteName=site.name;activatePage(\"overview\");loadSummary();loadOperationalModules();if(currentSiteId===\"site-cagbas\")loadAdsenseStatus()}\nasync function loadSharedSummary(){try{const r=await api(\"/api/summary\");document.getElementById(\"sharedRevenue\").textContent=formatTry(r.revenueTotalMinor);document.getElementById(\"sharedOrders\").textContent=r.paidOrders;document.getElementById(\"sharedPartners\").textContent=r.activePartners;document.getElementById(\"sharedSources\").textContent=r.activeSources}catch(err){console.warn(\"Ortak özet alınamadı:\",err.message)}}\ndocument.getElementById(\"showAddSite\").addEventListener(\"click\",()=>{document.getElementById(\"addSiteCard\").hidden=false;document.getElementById(\"addSiteCard\").scrollIntoView({behavior:\"smooth\",block:\"center\"})});\ndocument.getElementById(\"hideAddSite\").addEventListener(\"click\",()=>{document.getElementById(\"addSiteCard\").hidden=true});\ndocument.getElementById(\"siteForm\").addEventListener(\"submit\",async e=>{e.preventDefault();const form=e.currentTarget,msg=document.getElementById(\"siteFormMsg\");msg.textContent=\"\";const data=Object.fromEntries(new FormData(form).entries());data.slug=data.name.toLowerCase().replace(/ı/g,\"i\").replace(/ğ/g,\"g\").replace(/ü/g,\"u\").replace(/ş/g,\"s\").replace(/ö/g,\"o\").replace(/ç/g,\"c\").normalize(\"NFD\").replace(/[\\u0300-\\u036f]/g,\"\").replace(/[^a-z0-9]+/g,\"-\").replace(/^-|-$/g,\"\").slice(0,48);try{await api(\"/api/sites\",{method:\"POST\",body:JSON.stringify(data)});form.reset();document.getElementById(\"addSiteCard\").hidden=true;await loadSites()}catch(err){msg.textContent=err.message}});\n\nconst resourceData={};\nconst resourceMeta={\n sources:{mount:\"sourcesMount\",title:\"Gelir Kanalları\",fields:[\n  [\"name\",\"Kanal adı\",\"text\",true],[\"source_type\",\"Gelir türü\",\"select\",true,[[\"ads\",\"Reklam\"],[\"affiliate\",\"Satış ortaklığı\"],[\"sponsor\",\"Sponsor\"],[\"store\",\"Dijital mağaza\"],[\"referral\",\"Müşteri yönlendirme\"]]],[\"status\",\"Durum\",\"select\",true,[[\"draft\",\"Taslak\"],[\"active\",\"Aktif\"],[\"paused\",\"Duraklatıldı\"],[\"archived\",\"Arşiv\"]]]],columns:[[\"name\",\"Kanal\"],[\"source_type\",\"Tür\"],[\"status\",\"Durum\"]]},\n partners:{mount:\"partnersMount\",title:\"İş Ortakları\",fields:[\n  [\"name\",\"Firma / iş ortağı\",\"text\",true],[\"website\",\"Web sitesi\",\"url\"],[\"commission_model\",\"Komisyon modeli\",\"text\"],[\"commission_rate\",\"Komisyon oranı (%)\",\"number\"],[\"status\",\"Durum\",\"select\",true,[[\"prospect\",\"Aday\"],[\"active\",\"Aktif\"],[\"paused\",\"Duraklatıldı\"],[\"closed\",\"Kapalı\"]]]],columns:[[\"name\",\"İş ortağı\"],[\"website\",\"Web sitesi\"],[\"commission_model\",\"Model\"],[\"commission_rate\",\"Oran\"],[\"status\",\"Durum\"]]},\n sponsors:{mount:\"sponsorsMount\",title:\"Sponsor Kampanyaları\",fields:[\n  [\"sponsor_name\",\"Sponsor firma\",\"text\",true],[\"campaign_name\",\"Kampanya adı\",\"text\",true],[\"start_date\",\"Başlangıç\",\"date\"],[\"end_date\",\"Bitiş\",\"date\"],[\"agreed_amount_minor\",\"Anlaşma bedeli (TL)\",\"number\"],[\"currency\",\"Para birimi\",\"text\",false,null,\"TRY\"],[\"disclosure_text\",\"Reklam / iş birliği açıklaması\",\"text\"],[\"status\",\"Durum\",\"select\",true,[[\"draft\",\"Taslak\"],[\"scheduled\",\"Planlandı\"],[\"published\",\"Yayında\"],[\"completed\",\"Tamamlandı\"],[\"cancelled\",\"İptal\"]]]],columns:[[\"sponsor_name\",\"Sponsor\"],[\"campaign_name\",\"Kampanya\"],[\"start_date\",\"Başlangıç\"],[\"end_date\",\"Bitiş\"],[\"agreed_amount_minor\",\"Anlaşma bedeli\"],[\"status\",\"Durum\"]]},\n products:{mount:\"productsMount\",title:\"Dijital Ürünler\",fields:[\n  [\"name\",\"Ürün adı\",\"text\",true],[\"description\",\"Açıklama\",\"text\"],[\"price_minor\",\"Satış fiyatı (TL)\",\"number\",true],[\"currency\",\"Para birimi\",\"text\",false,null,\"TRY\"],[\"status\",\"Durum\",\"select\",true,[[\"draft\",\"Taslak\"],[\"active\",\"Aktif\"],[\"archived\",\"Arşiv\"]]]],columns:[[\"name\",\"Ürün\"],[\"description\",\"Açıklama\"],[\"price_minor\",\"Fiyat\"],[\"status\",\"Durum\"]]},\n entries:{mount:\"entriesMount\",title:\"Gelir ve Gider Kayıtları\",fields:[\n  [\"source_id\",\"Gelir kanalı\",\"select\",true,\"sources\"],[\"entry_type\",\"Kayıt türü\",\"select\",true,[[\"earning\",\"Gelir\"],[\"commission\",\"Komisyon\"],[\"expense\",\"Gider\"],[\"refund\",\"İade\"],[\"adjustment\",\"Düzeltme\"]]],[\"amount_minor\",\"Tutar (TL)\",\"number\",true],[\"currency\",\"Para birimi\",\"text\",false,null,\"TRY\"],[\"reference_code\",\"Referans no\",\"text\"],[\"description\",\"Açıklama\",\"text\"],[\"occurred_at\",\"İşlem tarihi\",\"datetime-local\",true]],columns:[[\"occurred_at\",\"Tarih\"],[\"source_id\",\"Kanal\"],[\"entry_type\",\"Tür\"],[\"amount_minor\",\"Tutar\"],[\"description\",\"Açıklama\"]]},\n orders:{mount:\"ordersMount\",title:\"Sipariş Kayıtları\",fields:[\n  [\"product_id\",\"Ürün\",\"select\",true,\"products\"],[\"order_reference\",\"Sipariş no\",\"text\"],[\"amount_minor\",\"Sipariş tutarı (TL)\",\"number\",true],[\"currency\",\"Para birimi\",\"text\",false,null,\"TRY\"],[\"payment_status\",\"Ödeme durumu\",\"select\",true,[[\"pending\",\"Bekliyor\"],[\"paid\",\"Ödendi\"],[\"failed\",\"Başarısız\"],[\"refunded\",\"İade edildi\"]]]],columns:[[\"order_reference\",\"Sipariş no\"],[\"product_id\",\"Ürün\"],[\"amount_minor\",\"Tutar\"],[\"payment_status\",\"Ödeme\"]]}\n};\nfunction esc(v){return String(v??\"\").replace(/[&<>\"']/g,c=>({\"&\":\"&amp;\",\"<\":\"&lt;\",\">\":\"&gt;\",'\"':\"&quot;\",\"'\":\"&#39;\"}[c]))}\nfunction moneyMinor(v,c=\"TRY\"){return new Intl.NumberFormat(\"tr-TR\",{style:\"currency\",currency:c||\"TRY\"}).format((Number(v)||0)/100)}\nfunction fieldOptions(field){\n const source=field[4];\n if(source===\"sources\")return (resourceData.sources||[]).map(x=>[x.id,x.name]);\n if(source===\"products\")return (resourceData.products||[]).map(x=>[x.id,x.name]);\n return Array.isArray(source)?source:[];\n}\nfunction renderField(f){\n const [name,label,type,required,opts,defaultValue]=f;\n const value=defaultValue|| (name===\"occurred_at\"?new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,16):\"\");\n if(type===\"select\")return '<label class=\"crud-field\">'+esc(label)+'<select name=\"'+name+'\" '+(required?\"required\":\"\")+'>'+fieldOptions(f).map(o=>'<option value=\"'+esc(o[0])+'\">'+esc(o[1])+'</option>').join(\"\")+'</select></label>';\n return '<label class=\"crud-field\">'+esc(label)+'<input name=\"'+name+'\" type=\"'+type+'\" '+(type===\"number\"?'step=\"0.01\" min=\"0\"':\"\")+' '+(required?\"required\":\"\")+' '+(value?'value=\"'+esc(value)+'\"':\"\")+'></label>';\n}\nfunction displayValue(resource,key,row){\n let v=row[key];\n if(key===\"amount_minor\"||key===\"price_minor\"||key===\"agreed_amount_minor\")return moneyMinor(v,row.currency);\n if(key===\"source_id\")return (resourceData.sources||[]).find(x=>x.id===v)?.name||\"—\";\n if(key===\"product_id\")return (resourceData.products||[]).find(x=>x.id===v)?.name||\"—\";\n const labels={ads:\"Reklam\",affiliate:\"Satış ortaklığı\",sponsor:\"Sponsor\",store:\"Dijital mağaza\",referral:\"Yönlendirme\",earning:\"Gelir\",commission:\"Komisyon\",expense:\"Gider\",refund:\"İade\",adjustment:\"Düzeltme\",prospect:\"Aday\",active:\"Aktif\",paused:\"Duraklatıldı\",closed:\"Kapalı\",draft:\"Taslak\",scheduled:\"Planlandı\",published:\"Yayında\",completed:\"Tamamlandı\",cancelled:\"İptal\",archived:\"Arşiv\",pending:\"Bekliyor\",paid:\"Ödendi\",failed:\"Başarısız\",refunded:\"İade edildi\"};\n return labels[v]||v||\"—\";\n}\nasync function loadResource(resource){\n const meta=resourceMeta[resource],mount=document.getElementById(meta.mount);\n try{\n  const result=await api(\"/api/\"+resource);resourceData[resource]=result.items||[];\n  const formFields=meta.fields.map(renderField).join(\"\");\n  const headers=meta.columns.map(c=>'<th>'+esc(c[1])+'</th>').join(\"\");\n  const rows=resourceData[resource].map(row=>'<tr>'+meta.columns.map(c=>'<td>'+esc(displayValue(resource,c[0],row))+'</td>').join(\"\")+'<td><button class=\"btn\" data-edit=\"'+esc(row.id)+'\">Düzenle</button> <button class=\"btn\" data-delete=\"'+esc(row.id)+'\">Sil</button></td></tr>').join(\"\");\n  mount.innerHTML='<div class=\"crud-wrap\"><div class=\"card\"><div class=\"crud-head\"><h2>'+esc(meta.title)+'</h2><span class=\"muted\">'+resourceData[resource].length+' kayıt</span></div><form class=\"crud-form\" data-resource-form=\"'+resource+'\">'+formFields+'<div class=\"crud-actions\"><button class=\"btn primary\" type=\"submit\">Kaydet</button><button class=\"btn\" type=\"reset\">Temizle</button></div><div class=\"crud-msg\" id=\"'+resource+'Msg\" role=\"status\"></div></form></div><div class=\"card\"><div class=\"crud-table-wrap\">'+(rows?'<table class=\"crud-table\"><thead><tr>'+headers+'<th>İşlem</th></tr></thead><tbody>'+rows+'</tbody></table>':'<div class=\"crud-empty\">Henüz kayıt yok. İlk kaydı yukarıdaki formdan ekleyebilirsin.</div>')+'</div></div></div>';\n  const form=mount.querySelector(\"form\");\n  form.addEventListener(\"submit\",async e=>{\n   e.preventDefault();const data=Object.fromEntries(new FormData(form).entries());\n   for(const key of [\"amount_minor\",\"price_minor\",\"agreed_amount_minor\"])if(data[key]!==undefined&&data[key]!==\"\")data[key]=Math.round(Number(data[key])*100);\n   if(data.commission_rate!==undefined&&data.commission_rate===\"\")delete data.commission_rate;\n   const editId=form.dataset.editId;\n   try{await api(\"/api/\"+resource+(editId?\"/\"+editId:\"\"),{method:editId?\"PATCH\":\"POST\",body:JSON.stringify(data)});await loadResource(resource);await loadSummary();if(resource===\"sources\")await loadResource(\"entries\");if(resource===\"products\")await loadResource(\"orders\")}\n   catch(err){document.getElementById(resource+\"Msg\").textContent=err.message}\n  });\n  form.addEventListener(\"reset\",()=>{delete form.dataset.editId;const btn=form.querySelector('button[type=\"submit\"]');if(btn)btn.textContent=\"Kaydet\"});\n  mount.querySelectorAll(\"[data-edit]\").forEach(btn=>btn.addEventListener(\"click\",()=>{\n   const row=resourceData[resource].find(x=>x.id===btn.dataset.edit);if(!row)return;\n   form.dataset.editId=row.id;\n   for(const f of meta.fields){const input=form.elements[f[0]];if(!input)continue;let value=row[f[0]]??f[5]??\"\";if([\"amount_minor\",\"price_minor\",\"agreed_amount_minor\"].includes(f[0]))value=Number(value)/100;if(f[2]===\"datetime-local\"&&value)value=String(value).slice(0,16);input.value=value}\n   form.querySelector('button[type=\"submit\"]').textContent=\"Değişiklikleri kaydet\";form.scrollIntoView({behavior:\"smooth\",block:\"center\"});\n  }));\n  mount.querySelectorAll(\"[data-delete]\").forEach(btn=>btn.addEventListener(\"click\",async()=>{\n   if(!confirm(\"Bu kaydı silmek istediğine emin misin?\"))return;\n   try{await api(\"/api/\"+resource+\"/\"+btn.dataset.delete,{method:\"DELETE\"});await loadResource(resource);await loadSummary()}catch(err){alert(\"Kayıt silinemedi: \"+err.message)}\n  }));\n }catch(err){mount.innerHTML='<div class=\"card crud-empty\">Kayıtlar yüklenemedi: '+esc(err.message)+'</div>'}\n}\nasync function loadFinanceSummary(){\n try{const r=await api(\"/api/summary\");const target=document.getElementById(\"financeSummary\");if(!target)return;\n target.innerHTML=[[\"Toplam gelir\",r.revenueTotalMinor],[\"Ödenen sipariş\",r.paidOrders],[\"Aktif iş ortağı\",r.activePartners],[\"Aktif gelir kanalı\",r.activeSources]].map((x,i)=>'<article class=\"card\"><div class=\"metrichead\">'+x[0]+'</div><div class=\"metric\">'+(i===0?moneyMinor(x[1]):esc(x[1]))+'</div></article>').join(\"\");\n }catch{}\n}\nasync function loadOperationalModules(){\n await loadResource(\"sources\");await loadResource(\"partners\");await loadResource(\"sponsors\");await loadResource(\"products\");await loadResource(\"entries\");await loadResource(\"orders\");await loadFinanceSummary();\n}\n\n(async()=>{try{const me=await api(\"/api/me\");if(me.authenticated)showPanel(me.user);else await initAuth()}catch{await initAuth()}})();\n</script>\n</body></html>";

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
function totpKeyBytes(env){
  const raw=String(env.TOTP_ENCRYPTION_KEY||"").trim();
  if(/^[0-9a-fA-F]{64}$/.test(raw)) return Uint8Array.from(raw.match(/.{2}/g),x=>parseInt(x,16));
  try { const b=fromBase64(raw); if(b.length===32)return b; } catch {}
  throw new Error("TOTP_ENCRYPTION_KEY_INVALID");
}
async function encryptTotpSecret(secret,env){
  const key=await crypto.subtle.importKey("raw",totpKeyBytes(env),"AES-GCM",false,["encrypt"]);
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const data=await crypto.subtle.encrypt({name:"AES-GCM",iv},key,new TextEncoder().encode(secret));
  return base64(iv)+"."+base64(new Uint8Array(data));
}
async function decryptTotpSecret(value,env){
  const parts=String(value||"").split(".");
  if(parts.length!==2)throw new Error("TOTP_SECRET_INVALID");
  const key=await crypto.subtle.importKey("raw",totpKeyBytes(env),"AES-GCM",false,["decrypt"]);
  const data=await crypto.subtle.decrypt({name:"AES-GCM",iv:fromBase64(parts[0])},key,fromBase64(parts[1]));
  return new TextDecoder().decode(data);
}
function base32Encode(bytes){
  const alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";let bits=0,value=0,out="";
  for(const byte of bytes){value=(value<<8)|byte;bits+=8;while(bits>=5){out+=alphabet[(value>>>(bits-5))&31];bits-=5;}}
  if(bits)out+=alphabet[(value<<(5-bits))&31];
  return out;
}
function base32Decode(input){
  const alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";let bits=0,value=0;const out=[];
  for(const ch of String(input).replace(/=+$/,"").toUpperCase()){const n=alphabet.indexOf(ch);if(n<0)throw new Error("TOTP_SECRET_INVALID");value=(value<<5)|n;bits+=5;if(bits>=8){out.push((value>>>(bits-8))&255);bits-=8;}}
  return new Uint8Array(out);
}
async function totpAt(secret,step){
  const key=await crypto.subtle.importKey("raw",base32Decode(secret),{name:"HMAC",hash:"SHA-1"},false,["sign"]);
  const counter=new Uint8Array(8);let n=BigInt(step);for(let i=7;i>=0;i--){counter[i]=Number(n&255n);n>>=8n;}
  const mac=new Uint8Array(await crypto.subtle.sign("HMAC",key,counter));const offset=mac[mac.length-1]&15;
  const binary=((mac[offset]&127)<<24)|(mac[offset+1]<<16)|(mac[offset+2]<<8)|mac[offset+3];
  return String(binary%1000000).padStart(6,"0");
}
async function verifyTotp(secret,code,lastStep=-1){
  if(!/^\d{6}$/.test(String(code)))return null;
  const current=Math.floor(Date.now()/30000);
  for(const step of [current-1,current,current+1])if(step>lastStep&&equalText(await totpAt(secret,step),String(code)))return step;
  return null;
}
async function totpStatus(request,env,session){
  const row=await env.DB.prepare("SELECT enabled_at FROM admin_totp WHERE user_id=?").bind(session.id).first();
  return json({configured:Boolean(row),enabled:Boolean(row?.enabled_at)});
}
async function totpBegin(request,env,session){
  if(!env.TOTP_ENCRYPTION_KEY)return json({error:"TOTP_ENCRYPTION_KEY_MISSING"},503);
  const existing=await env.DB.prepare("SELECT enabled_at FROM admin_totp WHERE user_id=?").bind(session.id).first();
  if(existing?.enabled_at)return json({error:"TOTP_ALREADY_ENABLED"},409);
  const secret=base32Encode(crypto.getRandomValues(new Uint8Array(20)));
  const encrypted=await encryptTotpSecret(secret,env);
  await env.DB.prepare("INSERT INTO admin_totp (user_id,secret_ciphertext,enabled_at,last_used_step) VALUES (?,?,NULL,NULL) ON CONFLICT(user_id) DO UPDATE SET secret_ciphertext=excluded.secret_ciphertext,enabled_at=NULL,last_used_step=NULL").bind(session.id,encrypted).run();
  const label=encodeURIComponent("CAGBAS Revenue Center:"+session.email);
  const uri="otpauth://totp/"+label+"?secret="+secret+"&issuer=CAGBAS%20Revenue%20Center&algorithm=SHA1&digits=6&period=30";
  return json({success:true,secret,otpauth_uri:uri});
}
async function totpConfirm(request,env,session){
  let body;try{body=await readJson(request)}catch{return json({error:"INVALID_REQUEST"},400)}
  const row=await env.DB.prepare("SELECT secret_ciphertext,enabled_at FROM admin_totp WHERE user_id=?").bind(session.id).first();
  if(!row?.secret_ciphertext)return json({error:"TOTP_SETUP_NOT_STARTED"},409);
  if(row.enabled_at)return json({error:"TOTP_ALREADY_ENABLED"},409);
  const secret=await decryptTotpSecret(row.secret_ciphertext,env);
  const step=await verifyTotp(secret,String(body.code||""));
  if(step===null)return json({error:"INVALID_TOTP"},401);
  await env.DB.prepare("UPDATE admin_totp SET enabled_at=datetime('now'),last_used_step=? WHERE user_id=?").bind(step,session.id).run();
  await env.DB.prepare("INSERT INTO audit_logs (id,user_id,action,resource_type,resource_id,metadata_json) VALUES (?,?,?,?,?,?)").bind(crypto.randomUUID(),session.id,"security.totp_enabled","admin_user",session.id,JSON.stringify({method:"authenticator"})).run();
  return json({success:true,enabled:true});
}
async function login(request,env){
 let b;try{b=await readJson(request)}catch{return json({error:"INVALID_REQUEST"},400)}
 const email=String(b.email||"").trim().toLowerCase(),password=String(b.password||"");
 const n=await env.DB.prepare("SELECT COUNT(*) count FROM login_attempts WHERE email_key=? AND attempted_at>datetime('now','-15 minutes') AND succeeded=0").bind(email).first();
 if(Number(n?.count||0)>=8)return json({error:"TOO_MANY_ATTEMPTS"},429);
 const u=await env.DB.prepare("SELECT id,email,password_hash,password_salt,role,status FROM admin_users WHERE email=? LIMIT 1").bind(email).first();
 let valid=false;if(u&&u.status==="active")valid=equalText(await derivePassword(password,fromBase64(u.password_salt)),u.password_hash);
 await env.DB.prepare("INSERT INTO login_attempts (id,email_key,succeeded) VALUES (?,?,?)").bind(crypto.randomUUID(),email,valid?1:0).run();
 if(!valid)return json({error:"INVALID_CREDENTIALS"},401);
 const contact=await env.DB.prepare("SELECT phone_e164 FROM admin_auth_contacts WHERE user_id=? LIMIT 1").bind(u.id).first();
 const phone=String(contact?.phone_e164||"");
 if(!/^\+[1-9]\d{7,14}$/.test(phone))return json({error:"SMS_PHONE_NOT_CONFIGURED"},503);
 const n2=await env.DB.prepare("SELECT COUNT(*) count FROM admin_otp_challenges WHERE user_id=? AND created_at>datetime('now','-15 minutes')").bind(u.id).first();
 if(Number(n2?.count||0)>=5)return json({error:"OTP_RATE_LIMIT"},429);
 const code=String(crypto.getRandomValues(new Uint32Array(1))[0]%1000000).padStart(6,"0"),id=crypto.randomUUID();
 await env.DB.prepare("INSERT INTO admin_otp_challenges (id,user_id,channel,code_hash,expires_at) VALUES (?,?,?,?,?)").bind(id,u.id,"sms",await sha256(id+":"+code),new Date(Date.now()+300000).toISOString()).run();
 const sms=await fetch("https://api.textbee.dev/api/v1/gateway/send-sms",{method:"POST",headers:{"x-api-key":env.TEXTBEE_API_KEY,"content-type":"application/json"},body:JSON.stringify({recipients:[phone],message:"CAGBAS giris kodunuz: "+code+". Kod 5 dakika gecerlidir."})});
 if(!sms.ok){await env.DB.prepare("DELETE FROM admin_otp_challenges WHERE id=?").bind(id).run();return json({error:"OTP_DELIVERY_FAILED"},502)}
 return json({success:true,challenge_id:id,masked_phone:phone.slice(0,4)+"******"+phone.slice(-2)});
}
async function verifyLoginOtp(request,env){
 let b;try{b=await readJson(request)}catch{return json({error:"INVALID_REQUEST"},400)}
 const id=String(b.challenge_id||""),code=String(b.code||"");
 const x=await env.DB.prepare("SELECT c.*,u.email,u.role,u.status FROM admin_otp_challenges c JOIN admin_users u ON u.id=c.user_id WHERE c.id=? AND c.channel='sms' AND c.consumed_at IS NULL").bind(id).first();
 if(!x||x.status!=="active"||Date.parse(x.expires_at)<=Date.now()||x.attempts>=5)return json({error:"OTP_EXPIRED_OR_LOCKED"},401);
 if(!/^\d{6}$/.test(code)||!equalText(await sha256(id+":"+code),x.code_hash)){await env.DB.prepare("UPDATE admin_otp_challenges SET attempts=attempts+1 WHERE id=?").bind(id).run();return json({error:"INVALID_OTP"},401)}
 await env.DB.prepare("UPDATE admin_otp_challenges SET consumed_at=datetime('now') WHERE id=?").bind(id).run();
 await env.DB.prepare("UPDATE admin_auth_contacts SET phone_verified_at=datetime('now'),updated_at=datetime('now') WHERE user_id=?").bind(x.user_id).run();
 const token=base64(crypto.getRandomValues(new Uint8Array(32))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,""),hash=await sha256(token),expiry=new Date(Date.now()+SESSION_TTL_SECONDS*1000).toISOString();
 await env.DB.prepare("INSERT INTO admin_sessions (id,user_id,token_hash,expires_at) VALUES (?,?,?,?)").bind(crypto.randomUUID(),x.user_id,hash,expiry).run();
 await env.DB.prepare("UPDATE admin_users SET last_login_at=? WHERE id=?").bind(new Date().toISOString(),x.user_id).run();
 return json({success:true,user:{email:x.email,role:x.role}},200,{"set-cookie":cookie(token,SESSION_TTL_SECONDS)});
}
async function logout(request, env) {
  const token = getCookie(request, SESSION_COOKIE);
  if (token) {
    const tokenHash = await sha256(token);
    await env.DB.prepare("DELETE FROM admin_sessions WHERE token_hash = ?").bind(tokenHash).run();
  }
  return json({ success: true }, 200, { "set-cookie": clearCookie() });
}


const RESOURCE_CONFIG = {
  partners: { table:"partners", fields:["name","website","commission_model","commission_rate","status"], required:["name"], statuses:["prospect","active","paused","closed"] },
  sponsors: { table:"sponsor_campaigns", fields:["sponsor_name","campaign_name","start_date","end_date","agreed_amount_minor","currency","disclosure_text","status"], required:["sponsor_name","campaign_name"], statuses:["draft","scheduled","published","completed","cancelled"] },
  products: { table:"digital_products", fields:["name","description","price_minor","currency","status"], required:["name"], statuses:["draft","active","archived"] },
  sources: { table:"revenue_sources", fields:["name","source_type","status"], required:["name","source_type"], statuses:["draft","active","paused","archived"], types:["ads","affiliate","sponsor","store","referral"] },
  entries: { table:"revenue_entries", fields:["source_id","entry_type","amount_minor","currency","reference_code","description","occurred_at"], required:["source_id","entry_type","amount_minor","occurred_at"], types:["earning","commission","expense","refund","adjustment"] },
  orders: { table:"orders", fields:["product_id","order_reference","amount_minor","currency","payment_status"], required:["product_id","amount_minor"], statuses:["pending","paid","failed","refunded"] }
};
function cleanResourceInput(resource, body, partial=false) {
  const cfg=RESOURCE_CONFIG[resource]; const out={};
  for (const key of cfg.fields) if (Object.prototype.hasOwnProperty.call(body,key)) out[key]=body[key];
  if (!partial) for (const key of cfg.required) if (out[key]===undefined || out[key]===null || String(out[key]).trim()==="") throw new Error("REQUIRED_"+key.toUpperCase());
  if (out.currency!==undefined) { out.currency=String(out.currency).toUpperCase(); if(!/^[A-Z]{3}$/.test(out.currency)) throw new Error("INVALID_CURRENCY"); }
  for (const key of ["amount_minor","price_minor","agreed_amount_minor"]) if(out[key]!==undefined && (!Number.isSafeInteger(Number(out[key])) || Number(out[key])<0)) throw new Error("INVALID_"+key.toUpperCase()); else if(out[key]!==undefined) out[key]=Number(out[key]);
  if(out.commission_rate!==undefined && (out.commission_rate!==null && (!Number.isFinite(Number(out.commission_rate)) || Number(out.commission_rate)<0 || Number(out.commission_rate)>100))) throw new Error("INVALID_COMMISSION_RATE");
  if(out.commission_rate!==undefined && out.commission_rate!==null) out.commission_rate=Number(out.commission_rate);
  if(out.status!==undefined && cfg.statuses && !cfg.statuses.includes(out.status)) throw new Error("INVALID_STATUS");
  if(out.source_type!==undefined && cfg.types && !cfg.types.includes(out.source_type)) throw new Error("INVALID_SOURCE_TYPE");
  if(out.entry_type!==undefined && cfg.types && !cfg.types.includes(out.entry_type)) throw new Error("INVALID_ENTRY_TYPE");
  if(out.payment_status!==undefined && cfg.statuses && !cfg.statuses.includes(out.payment_status)) throw new Error("INVALID_PAYMENT_STATUS");
  for(const key of ["name","sponsor_name","campaign_name","website","commission_model","description","reference_code","disclosure_text","order_reference","source_id","product_id","occurred_at","start_date","end_date"]) if(out[key]!==undefined && out[key]!==null) out[key]=String(out[key]).trim();
  return out;
}
async function resourceRoute(request, env, session, resource, siteId, id=null) {
  const cfg=RESOURCE_CONFIG[resource]; if(!cfg) return json({error:"NOT_FOUND"},404);
  const writable=["owner","admin","editor"].includes(session.role);
  if(request.method==="GET") {
    const rows=await env.DB.prepare("SELECT * FROM "+cfg.table+" WHERE site_id = ? ORDER BY created_at DESC LIMIT 250").bind(siteId).all();
    return json({items:rows.results||[]});
  }
  if(!writable) return json({error:"FORBIDDEN"},403);
  if(request.method==="POST") {
    const body=await readJson(request); const data=cleanResourceInput(resource,body,false); data.site_id=siteId;
    const idNew=crypto.randomUUID(); const cols=["id",...Object.keys(data)];
    const placeholders=cols.map(()=>"?").join(",");
    await env.DB.prepare("INSERT INTO "+cfg.table+" ("+cols.join(",")+") VALUES ("+placeholders+")")
      .bind(idNew,...Object.values(data)).run();
    await env.DB.prepare("INSERT INTO audit_logs (id,user_id,action,resource_type,resource_id) VALUES (?,?,?,?,?)")
      .bind(crypto.randomUUID(),session.id,"create",resource,idNew).run();
    return json({success:true,id:idNew},201);
  }
  if(!id) return json({error:"ID_REQUIRED"},400);
  if(request.method==="PATCH") {
    const body=await readJson(request); const data=cleanResourceInput(resource,body,true);
    const keys=Object.keys(data); if(!keys.length) return json({error:"NO_FIELDS"},400);
    await env.DB.prepare("UPDATE "+cfg.table+" SET "+keys.map(k=>k+" = ?").join(", ")+" WHERE id = ? AND site_id = ?")
      .bind(...keys.map(k=>data[k]),id,siteId).run();
    await env.DB.prepare("INSERT INTO audit_logs (id,user_id,action,resource_type,resource_id) VALUES (?,?,?,?,?)")
      .bind(crypto.randomUUID(),session.id,"update",resource,id).run();
    return json({success:true});
  }
  if(request.method==="DELETE") {
    await env.DB.prepare("DELETE FROM "+cfg.table+" WHERE id = ? AND site_id = ?").bind(id,siteId).run();
    await env.DB.prepare("INSERT INTO audit_logs (id,user_id,action,resource_type,resource_id) VALUES (?,?,?,?,?)")
      .bind(crypto.randomUUID(),session.id,"delete",resource,id).run();
    return json({success:true});
  }
  return json({error:"METHOD_NOT_ALLOWED"},405);
}


async function sitesRoute(request,env,session,id=null) {
  if(request.method==="GET") {
    const rows=await env.DB.prepare("SELECT id,name,slug,domain,client_name,site_type,ga4_measurement_id,ga4_property_id,analytics_status,created_at FROM sites ORDER BY created_at ASC").all();
    return json({items:rows.results||[]});
  }
  if(!["owner","admin"].includes(session.role)) return json({error:"FORBIDDEN"},403);
  if(request.method==="POST") {
    const body=await readJson(request);
    const name=String(body.name||"").trim(), domain=String(body.domain||"").trim(), client=String(body.client_name||"").trim();
    const slug=String(body.slug||"").trim().toLowerCase();
    if(!name||!domain||!slug||!/^[a-z0-9-]{2,48}$/.test(slug)) return json({error:"NAME_DOMAIN_AND_VALID_SLUG_REQUIRED"},400);
    let normalized;
    try { normalized=new URL(domain); if(!["http:","https:"].includes(normalized.protocol)) throw new Error(); }
    catch { return json({error:"INVALID_DOMAIN"},400); }
    const siteId=crypto.randomUUID();
    await env.DB.prepare("INSERT INTO sites (id,name,slug,domain,client_name,site_type,ga4_measurement_id,ga4_property_id,analytics_status) VALUES (?,?,?,?,?,?,?,?,?)")
      .bind(siteId,name,slug,normalized.origin,client,body.site_type==="own"?"own":"client",String(body.ga4_measurement_id||"").trim()||null,String(body.ga4_property_id||"").trim()||null,"pending").run();
    await env.DB.prepare("INSERT INTO audit_logs (id,user_id,action,resource_type,resource_id) VALUES (?,?,?,?,?)")
      .bind(crypto.randomUUID(),session.id,"create","site",siteId).run();
    return json({success:true,id:siteId},201);
  }
  if(!id) return json({error:"ID_REQUIRED"},400);
  if(request.method==="PATCH") {
    const body=await readJson(request), allowed=["name","domain","client_name","ga4_measurement_id","ga4_property_id"];
    const data={}; for(const key of allowed) if(body[key]!==undefined)data[key]=String(body[key]).trim();
    if(!Object.keys(data).length)return json({error:"NO_FIELDS"},400);
    if(data.domain){try{data.domain=new URL(data.domain).origin}catch{return json({error:"INVALID_DOMAIN"},400)}}
    const keys=Object.keys(data);
    await env.DB.prepare("UPDATE sites SET "+keys.map(k=>k+" = ?").join(", ")+" WHERE id = ?")
      .bind(...keys.map(k=>data[k]),id).run();
    return json({success:true});
  }
  if(request.method==="DELETE") {
    const count=await env.DB.prepare("SELECT (SELECT COUNT(*) FROM revenue_sources WHERE site_id=?) + (SELECT COUNT(*) FROM partners WHERE site_id=?) + (SELECT COUNT(*) FROM sponsor_campaigns WHERE site_id=?) + (SELECT COUNT(*) FROM digital_products WHERE site_id=?) AS total").bind(id,id,id,id).first();
    if(Number(count?.total||0)>0)return json({error:"SITE_HAS_RECORDS_ARCHIVE_INSTEAD"},409);
    if(["site-cagbas","site-edwise"].includes(id))return json({error:"DEFAULT_SITES_CANNOT_BE_DELETED"},403);
    await env.DB.prepare("DELETE FROM sites WHERE id=?").bind(id).run();
    return json({success:true});
  }
  return json({error:"METHOD_NOT_ALLOWED"},405);
}


const GOOGLE_REDIRECT_URI = "https://cagbas-revenue-api.basarcekmecelioglu6-0f8.workers.dev/oauth/google/callback";
const GOOGLE_SCOPE = "https://www.googleapis.com/auth/adsense.readonly";

async function encryptSecret(value, env) {
  if (!env.GOOGLE_TOKEN_ENCRYPTION_KEY) throw new Error("GOOGLE_TOKEN_ENCRYPTION_KEY_MISSING");
  const keyBytes = fromBase64(env.GOOGLE_TOKEN_ENCRYPTION_KEY);
  if (keyBytes.length !== 32) throw new Error("GOOGLE_TOKEN_ENCRYPTION_KEY_INVALID");
  const key = await crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, ["encrypt"]);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({name:"AES-GCM",iv}, key, new TextEncoder().encode(value));
  return base64(iv) + "." + base64(new Uint8Array(encrypted));
}


async function decryptSecret(value, env) {
  if (!env.GOOGLE_TOKEN_ENCRYPTION_KEY) throw new Error("GOOGLE_TOKEN_ENCRYPTION_KEY_MISSING");
  const keyBytes = fromBase64(env.GOOGLE_TOKEN_ENCRYPTION_KEY);
  if (keyBytes.length !== 32) throw new Error("GOOGLE_TOKEN_ENCRYPTION_KEY_INVALID");
  const key = await crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, ["decrypt"]);
  const parts = String(value || "").split(".");
  if (parts.length !== 2) throw new Error("ENCRYPTED_TOKEN_INVALID");
  const plain = await crypto.subtle.decrypt({name:"AES-GCM",iv:fromBase64(parts[0])}, key, fromBase64(parts[1]));
  return new TextDecoder().decode(plain);
}

async function getAdsenseAccessToken(env) {
  const saved = await env.DB.prepare("SELECT refresh_token_encrypted FROM google_oauth_tokens WHERE site_id=? LIMIT 1").bind("site-cagbas").first();
  if (!saved?.refresh_token_encrypted) return null;
  const refreshToken = await decryptSecret(saved.refresh_token_encrypted,env);
  const body = new URLSearchParams({client_id:env.GOOGLE_CLIENT_ID,client_secret:env.GOOGLE_CLIENT_SECRET,refresh_token:refreshToken,grant_type:"refresh_token"});
  const response = await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body});
  const data = await response.json();
  if (!response.ok || !data.access_token) throw new Error("GOOGLE_TOKEN_REFRESH_FAILED:" + String(data.error_description||data.error||response.status));
  return data.access_token;
}

async function adsenseApi(path, accessToken) {
  const response = await fetch("https://adsense.googleapis.com/v2/" + path,{headers:{authorization:"Bearer "+accessToken}});
  const data = await response.json();
  if (!response.ok) throw new Error("ADSENSE_API_ERROR:" + String(data.error?.message||response.status));
  return data;
}

async function adsenseStatusRoute(request, env, session) {
  if (!["owner","admin"].includes(session.role)) return json({error:"FORBIDDEN"},403);
  const row = await env.DB.prepare("SELECT scope,connected_at FROM google_oauth_tokens WHERE site_id=? LIMIT 1").bind("site-cagbas").first();
  return json({connected:Boolean(row),scope:row?.scope||null,connectedAt:row?.connected_at||null});
}

async function adsenseReportRoute(request, env, session) {
  if (!["owner","admin"].includes(session.role)) return json({error:"FORBIDDEN"},403);
  const saved = await env.DB.prepare("SELECT refresh_token_encrypted FROM google_oauth_tokens WHERE site_id=? LIMIT 1").bind("site-cagbas").first();
  if (!saved?.refresh_token_encrypted) return json({error:"ADSENSE_NOT_CONNECTED"},409);
  try {
    const accessToken = await getAdsenseAccessToken(env);
    const accountData = await adsenseApi("accounts?pageSize=100",accessToken);
    const account = (accountData.accounts||[])[0];
    if (!account?.name) return json({error:"ADSENSE_ACCOUNT_NOT_FOUND",detail:"Bu Google hesabında erişilebilir AdSense hesabı bulunamadı."},404);
    const params = new URLSearchParams({dateRange:"LAST_7_DAYS"});
    for (const metric of ["ESTIMATED_EARNINGS","PAGE_VIEWS","CLICKS","IMPRESSIONS"]) params.append("metrics",metric);
    const report = await adsenseApi(account.name+"/reports:generate?"+params.toString(),accessToken);
    const cells = report.totals?.cells || report.rows?.[0]?.cells || [];
    const values = cells.map(cell=>cell.value??"0");
    return json({
      connected:true,accountName:account.displayName||account.name,
      currencyCode:report.headers?.find(x=>x.name==="ESTIMATED_EARNINGS")?.currencyCode||account.currencyCode||"USD",
      period:"LAST_7_DAYS",headers:(report.headers||[]).map(x=>x.name),
      estimatedEarnings:values[0]||"0",pageViews:values[1]||"0",clicks:values[2]||"0",impressions:values[3]||"0",
      reportDate:new Date().toISOString()
    });
  } catch (error) {
    return json({error:"ADSENSE_REPORT_FAILED",detail:String(error.message||error)},502);
  }
}

async function oauthStart(request, env) {
  const session = await requireSession(request, env);
  if (!session) return json({error:"UNAUTHENTICATED"},401);
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_TOKEN_ENCRYPTION_KEY) {
    return json({error:"GOOGLE_OAUTH_SECRETS_NOT_CONFIGURED"},503);
  }
  const stateBytes = crypto.getRandomValues(new Uint8Array(32));
  const state = base64(stateBytes).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"");
  await env.DB.prepare("INSERT INTO google_oauth_states (state_hash,user_id,site_id,expires_at) VALUES (?,?,?,?)")
    .bind(await sha256(state),session.id,"site-cagbas",new Date(Date.now()+10*60*1000).toISOString()).run();
  const u = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  u.searchParams.set("client_id",env.GOOGLE_CLIENT_ID);
  u.searchParams.set("redirect_uri",GOOGLE_REDIRECT_URI);
  u.searchParams.set("response_type","code");
  u.searchParams.set("scope",GOOGLE_SCOPE);
  u.searchParams.set("access_type","offline");
  u.searchParams.set("prompt","consent");
  u.searchParams.set("include_granted_scopes","true");
  u.searchParams.set("state",state);
  return Response.redirect(u.toString(),302);
}

async function oauthCallback(request, env) {
  const url = new URL(request.url);
  const state = url.searchParams.get("state") || "";
  const code = url.searchParams.get("code") || "";
  const error = url.searchParams.get("error");
  if (error) return new Response("Google yetkilendirmesi iptal edildi. Bu sekmeyi kapatıp Revenue Center'a dönebilirsin.",{status:400});
  if (!state || !code || !env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_TOKEN_ENCRYPTION_KEY) {
    return new Response("OAuth yapılandırması eksik veya Google yanıtı geçersiz.",{status:400});
  }
  const stateHash = await sha256(state);
  const saved = await env.DB.prepare("SELECT user_id,site_id FROM google_oauth_states WHERE state_hash=? AND expires_at>? LIMIT 1")
    .bind(stateHash,new Date().toISOString()).first();
  if (!saved) return new Response("OAuth isteğinin süresi dolmuş veya state doğrulanamadı. Revenue Center'dan yeniden bağlan.",{status:400});
  await env.DB.prepare("DELETE FROM google_oauth_states WHERE state_hash=?").bind(stateHash).run();
  const body = new URLSearchParams({
    code,client_id:env.GOOGLE_CLIENT_ID,client_secret:env.GOOGLE_CLIENT_SECRET,
    redirect_uri:GOOGLE_REDIRECT_URI,grant_type:"authorization_code"
  });
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body});
  const tokens = await tokenResponse.json();
  if (!tokenResponse.ok || !tokens.refresh_token) {
    return new Response("Google token yanıtı alınamadı. Yeniden bağlantı kurmayı dene. "+String(tokens.error_description||tokens.error||"refresh_token_missing"),{status:400});
  }
  const encrypted = await encryptSecret(tokens.refresh_token,env);
  await env.DB.prepare("INSERT INTO google_oauth_tokens (site_id,refresh_token_encrypted,scope,connected_at) VALUES (?,?,?,?) ON CONFLICT(site_id) DO UPDATE SET refresh_token_encrypted=excluded.refresh_token_encrypted,scope=excluded.scope,connected_at=excluded.connected_at")
    .bind(saved.site_id,encrypted,tokens.scope||GOOGLE_SCOPE,new Date().toISOString()).run();
  return new Response("<!doctype html><meta charset=utf-8><title>Bağlantı tamamlandı</title><main style='font:16px system-ui;max-width:560px;margin:12vh auto;padding:24px'><h2>AdSense bağlantısı tamamlandı</h2><p>Google hesabı Revenue Center'a güvenli şekilde bağlandı. Bu pencereyi kapatıp yönetim paneline dönebilirsin.</p></main>",{headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}});
}


async function textbeeStatus(env) {
  if (!env.TEXTBEE_API_KEY) return json({ ok: false, error: "TEXTBEE_API_KEY_MISSING" }, 503);
  const response = await fetch("https://api.textbee.dev/api/v1/gateway/stats", {
    method: "GET",
    headers: { "x-api-key": env.TEXTBEE_API_KEY, "accept": "application/json" }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) return json({ ok: false, error: "TEXTBEE_AUTH_OR_GATEWAY_ERROR", status: response.status, details: payload }, 502);
  return json({ ok: true, gateway: payload });
}

async function textbeeSendTest(request, env, session) {
  if (!env.TEXTBEE_API_KEY) return json({ error: "TEXTBEE_API_KEY_MISSING" }, 503);
  let body;
  try { body = await readJson(request); } catch { return json({ error: "INVALID_REQUEST" }, 400); }
  const recipient = String(body.phone || "").replace(/[\s()-]/g, "");
  if (!/^\+[1-9]\d{7,14}$/.test(recipient)) return json({ error: "PHONE_E164_REQUIRED" }, 400);
  const response = await fetch("https://api.textbee.dev/api/v1/gateway/send-sms", {
    method: "POST",
    headers: { "x-api-key": env.TEXTBEE_API_KEY, "content-type": "application/json", "accept": "application/json" },
    body: JSON.stringify({ recipients: [recipient], message: "CAGBAS Revenue Center SMS gateway test. Bu bir test mesajidir." })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) return json({ error: "TEXTBEE_SEND_FAILED", status: response.status, details: payload }, 502);
  await env.DB.prepare("INSERT INTO audit_logs (id,user_id,action,resource_type,resource_id,metadata_json) VALUES (?,?,?,?,?,?)")
    .bind(crypto.randomUUID(), session.id, "security.sms_test_queued", "phone", recipient, JSON.stringify({ provider: "textbee" })).run();
  return json({ success: true, queued: true, provider: "textbee", result: payload });
}

async function handle(request, env) {
  const url = new URL(request.url);
  if (url.pathname === "/oauth/google/start" && request.method === "GET") return await oauthStart(request, env);
  if (url.pathname === "/oauth/google/callback" && request.method === "GET") return await oauthCallback(request, env);
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

  if (url.pathname.startsWith("/api/security/totp-")) {
    const session = await requireSession(request, env);
    if (!session || !["owner","admin"].includes(session.role)) return json({ error: "UNAUTHENTICATED" },401);
    if (url.pathname === "/api/security/totp-status" && request.method === "GET") return await totpStatus(request,env,session);
    if (url.pathname === "/api/security/totp-begin" && request.method === "POST") return await totpBegin(request,env,session);
    if (url.pathname === "/api/security/totp-confirm" && request.method === "POST") return await totpConfirm(request,env,session);
  }
  if (url.pathname === "/api/security/textbee-status" && request.method === "GET") {
    const session = await requireSession(request, env);
    if (!session || !["owner","admin"].includes(session.role)) return json({ error: "UNAUTHENTICATED" }, 401);
    return await textbeeStatus(env);
  }
  if (url.pathname === "/api/security/textbee-test" && request.method === "POST") {
    const session = await requireSession(request, env);
    if (!session || !["owner","admin"].includes(session.role)) return json({ error: "UNAUTHENTICATED" }, 401);
    return await textbeeSendTest(request, env, session);
  }

  if (url.pathname === "/api/setup/status" && request.method === "GET") {
    const row = await env.DB.prepare("SELECT COUNT(*) AS count FROM admin_users").first();
    return json({
      setupConfigured: Boolean(env.BOOTSTRAP_SECRET && env.BOOTSTRAP_SECRET.length >= 32),
      initialized: Number(row?.count || 0) > 0
    });
  }


  if(url.pathname === "/api/sites") {
    const session=await requireSession(request,env);
    if(!session)return json({error:"UNAUTHENTICATED"},401);
    return await sitesRoute(request,env,session);
  }
  const siteResourceMatch=url.pathname.match(/^\/api\/sites\/([A-Za-z0-9-]+)$/);
  if(siteResourceMatch) {
    const session=await requireSession(request,env);
    if(!session)return json({error:"UNAUTHENTICATED"},401);
    return await sitesRoute(request,env,session,siteResourceMatch[1]);
  }

  if (url.pathname === "/api/setup" && request.method === "POST") return await setup(request, env);
  if (url.pathname === "/api/login" && request.method === "POST") return await login(request, env);
  if (url.pathname === "/api/login/verify-otp" && request.method === "POST") return await verifyLoginOtp(request, env);
  if (url.pathname === "/api/logout" && request.method === "POST") return await logout(request, env);

  if (url.pathname === "/api/adsense/status" && request.method === "GET") {
    const session = await requireSession(request, env);
    if (!session) return json({error:"UNAUTHENTICATED"},401);
    return await adsenseStatusRoute(request,env,session);
  }
  if (url.pathname === "/api/adsense/report" && request.method === "GET") {
    const session = await requireSession(request, env);
    if (!session) return json({error:"UNAUTHENTICATED"},401);
    return await adsenseReportRoute(request,env,session);
  }

  if (url.pathname === "/api/me" && request.method === "GET") {
    const session = await requireSession(request, env);
    if (!session) return json({ authenticated: false }, 401);
    return json({ authenticated: true, user: { email: session.email, role: session.role } });
  }

  const resourceMatch=url.pathname.match(/^\/api\/(partners|sponsors|products|sources|entries|orders)(?:\/([A-Za-z0-9-]+))?$/);
  if(resourceMatch) {
    const session=await requireSession(request,env);
    if(!session) return json({error:"UNAUTHENTICATED"},401);
    const siteId=url.searchParams.get("site_id");
    if(!siteId)return json({error:"SITE_CONTEXT_REQUIRED"},400);
    const site=await env.DB.prepare("SELECT id FROM sites WHERE id=?").bind(siteId).first();
    if(!site)return json({error:"SITE_NOT_FOUND"},404);
    return await resourceRoute(request,env,session,resourceMatch[1],siteId,resourceMatch[2]||null);
  }

  if (url.pathname === "/api/summary" && request.method === "GET") {
    const session = await requireSession(request, env);
    if (!session) return json({ error: "UNAUTHENTICATED" }, 401);
    if (!["owner", "admin"].includes(session.role)) return json({ error: "FORBIDDEN" }, 403);
    const siteId=url.searchParams.get("site_id");
    if(siteId && !await env.DB.prepare("SELECT id FROM sites WHERE id=?").bind(siteId).first()) return json({error:"SITE_NOT_FOUND"},404);
    const q=(sql)=>siteId?env.DB.prepare(sql+" AND site_id = ?").bind(siteId).first():env.DB.prepare(sql).first();
    const [revenue,sources,products,partners,sponsors,orders]=await Promise.all([
      q("SELECT COALESCE(SUM(CASE WHEN entry_type IN ('earning','commission') THEN amount_minor WHEN entry_type IN ('expense','refund') THEN -ABS(amount_minor) ELSE amount_minor END),0) AS total_minor FROM revenue_entries WHERE currency = 'TRY'"),
      q("SELECT COUNT(*) AS count FROM revenue_sources WHERE status = 'active'"),
      q("SELECT COUNT(*) AS count FROM digital_products WHERE status = 'active'"),
      q("SELECT COUNT(*) AS count FROM partners WHERE status = 'active'"),
      q("SELECT COUNT(*) AS count FROM sponsor_campaigns WHERE status IN ('scheduled','published')"),
      q("SELECT COUNT(*) AS count FROM orders WHERE payment_status = 'paid'")
    ]);
    return json({revenueTotalMinor:Number(revenue?.total_minor||0),activeSources:Number(sources?.count||0),activeProducts:Number(products?.count||0),activePartners:Number(partners?.count||0),liveSponsorCampaigns:Number(sponsors?.count||0),paidOrders:Number(orders?.count||0),scope:siteId||"all"});
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
