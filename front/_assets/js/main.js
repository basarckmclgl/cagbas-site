/* ÇAĞBAŞ COOKIE CONSENT SYSTEM */
document.addEventListener('DOMContentLoaded', function () {

    const CONSENT_KEY = 'cagbas_cookie_consent_v2';
    const LEGACY_KEY = 'cagbas_cookie_consent';
    const GA_ID = 'G-6YM7Q549C9';

    const lang = (document.documentElement.lang || 'tr')
        .toLowerCase().slice(0, 2);

    // Google Analytics varsayılan olarak kapalı.
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
        window.dataLayer.push(arguments);
    };

    window.gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        wait_for_update: 500
    });

    const copy = {
        tr: {
            title: 'Çerez tercihleri',
            intro: 'Zorunlu çerezler sitenin çalışması için gereklidir. Analitik çerezleri yalnızca izninizle kullanılır.',
            necessary: 'Zorunlu çerezler',
            necessaryDesc: 'Güvenlik ve temel site işlevleri için gereklidir; kapatılamaz.',
            analytics: 'Analitik çerezleri',
            analyticsDesc: 'Ziyaret ve kullanım istatistiklerini Google Analytics ile ölçmemizi sağlar.',
            accept: 'Tümünü kabul et',
            reject: 'Reddet',
            manage: 'Tercihleri yönet',
            save: 'Tercihlerimi kaydet',
            settings: 'Çerez ayarları',
            policy: 'Çerez Politikası',
            close: 'Kapat'
        },
        en: {
            title: 'Cookie preferences',
            intro: 'Essential cookies are required for the website to work. Analytics cookies are used only with your permission.',
            necessary: 'Essential cookies',
            necessaryDesc: 'Required for security and core website functions.',
            analytics: 'Analytics cookies',
            analyticsDesc: 'Allow us to measure visits and usage statistics with Google Analytics.',
            accept: 'Accept all',
            reject: 'Reject',
            manage: 'Manage preferences',
            save: 'Save my preferences',
            settings: 'Cookie settings',
            policy: 'Cookie Policy',
            close: 'Close'
        },
        ar: {
            title: 'تفضيلات ملفات تعريف الارتباط',
            intro: 'ملفات تعريف الارتباط الضرورية مطلوبة لتشغيل الموقع. لا تُستخدم ملفات التحليل إلا بموافقتك.',
            necessary: 'ملفات تعريف الارتباط الضرورية',
            necessaryDesc: 'مطلوبة للأمان والوظائف الأساسية.',
            analytics: 'ملفات تعريف الارتباط التحليلية',
            analyticsDesc: 'تتيح لنا قياس الزيارات وإحصاءات الاستخدام.',
            accept: 'قبول الكل',
            reject: 'رفض',
            manage: 'إدارة التفضيلات',
            save: 'حفظ تفضيلاتي',
            settings: 'إعدادات ملفات تعريف الارتباط',
            policy: 'سياسة ملفات تعريف الارتباط',
            close: 'إغلاق'
        }
    }[lang] || {
        title: 'Cookie preferences',
        intro: 'Essential cookies are required. Analytics cookies are used only with your permission.',
        necessary: 'Essential cookies',
        necessaryDesc: 'Required for core website functions.',
        analytics: 'Analytics cookies',
        analyticsDesc: 'Measure visits and usage with Google Analytics.',
        accept: 'Accept all',
        reject: 'Reject',
        manage: 'Manage preferences',
        save: 'Save preferences',
        settings: 'Cookie settings',
        policy: 'Cookie Policy',
        close: 'Close'
    };

    // Kayıtlı izni oku.
    function readConsent() {
        try {
            const saved = localStorage.getItem(CONSENT_KEY);

            if (saved) {
                const parsed = JSON.parse(saved);

                return {
                    necessary: true,
                    analytics: parsed.analytics === true
                };
            }

            const legacy = localStorage.getItem(LEGACY_KEY);

            if (legacy === 'accepted') {
                return { necessary: true, analytics: true };
            }

            if (legacy === 'rejected') {
                return { necessary: true, analytics: false };
            }

        } catch (error) {
            console.error('Consent read error:', error);
        }

        return null;
    }

    // İzni kaydet.
    function saveConsent(analytics) {

        const choice = {
            necessary: true,
            analytics: analytics === true,
            updatedAt: new Date().toISOString()
        };

        try {
            localStorage.setItem(
                CONSENT_KEY,
                JSON.stringify(choice)
            );

            localStorage.setItem(
                LEGACY_KEY,
                analytics ? 'accepted' : 'rejected'
            );

        } catch (error) {
            console.error('Consent save error:', error);
        }

        if (choice.analytics) {
            enableAnalytics();
        } else {
            disableAnalytics();
        }

        banner.hidden = true;
        launcher.hidden = false;
        dialog.hidden = true;
    }

    // Analitik iznini etkinleştir.
    function enableAnalytics() {

        window.gtag('consent', 'update', {
            analytics_storage: 'granted',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
        });

        if (window.cagbasAnalyticsLoaded) return;

        window.cagbasAnalyticsLoaded = true;

        window.gtag('js', new Date());

        window.gtag('config', GA_ID, {
            anonymize_ip: true
        });

        const script = document.createElement('script');

        script.async = true;

        script.src =
            'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;

        script.dataset.cagbasAnalytics = 'true';

        document.head.appendChild(script);
    }

    // Analitik iznini geri çek.
    function disableAnalytics() {

        window.gtag('consent', 'update', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
        });

        const hostParts = location.hostname.split('.');

        const rootDomain = hostParts.length > 1
            ? hostParts.slice(-2).join('.')
            : location.hostname;

        document.cookie.split(';').forEach(function (part) {

            const name = part.split('=')[0].trim();

            if (/^(_ga|_gid|_gat)/.test(name)) {

                const domains = [
                    '',
                    '; domain=' + location.hostname,
                    '; domain=.' + location.hostname,
                    '; domain=' + rootDomain,
                    '; domain=.' + rootDomain
                ];

                domains.forEach(function (domain) {

                    document.cookie =
                        name + '=; Max-Age=0; path=/' +
                        domain + '; SameSite=Lax';

                });
            }
        });
    }

    // Çerez bildirim alanı.
    let banner = document.querySelector('.cookie-container');

    if (!banner) {
        banner = document.createElement('div');
        banner.className = 'cookie-container';
        banner.setAttribute('role', 'region');
        document.body.appendChild(banner);
    }

    banner.innerHTML =
        '<p>' + copy.intro + ' <a href="' +
        (lang === 'ar'
            ? '/ar/legal-information-ar.html#cookies'
            : lang === 'en'
                ? '/en/legal-information-en.html#cookies'
                : '/yasal-bilgilendirme.html#cerezler') +
        '">' + copy.policy + '</a></p>' +

        '<div class="cookie-actions">' +
        '<button type="button" class="cookie-reject">' +
        copy.reject + '</button>' +

        '<button type="button" class="cookie-preferences">' +
        copy.manage + '</button>' +

        '<button type="button" class="cookie-accept">' +
        copy.accept + '</button></div>';

    // Tercih penceresi.
    const dialog = document.createElement('section');

    dialog.className = 'cagbas-cookie-dialog';
    dialog.hidden = true;
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'cagbas-cookie-title');

    dialog.innerHTML =
        '<div class="cagbas-cookie-dialog__panel" role="document">' +

        '<button type="button" class="cagbas-cookie-dialog__close" aria-label="' +
        copy.close + '">×</button>' +

        '<h2 id="cagbas-cookie-title">' + copy.title + '</h2>' +

        '<p>' + copy.intro + '</p>' +

        '<div class="cagbas-cookie-option">' +
        '<div><strong>' + copy.necessary + '</strong>' +
        '<p>' + copy.necessaryDesc + '</p></div>' +
        '<input type="checkbox" checked disabled></div>' +

        '<label class="cagbas-cookie-option">' +
        '<span><strong>' + copy.analytics + '</strong>' +
        '<small>' + copy.analyticsDesc + '</small></span>' +
        '<input type="checkbox" class="cagbas-cookie-analytics">' +
        '</label>' +

        '<div class="cagbas-cookie-dialog__actions">' +

        '<button type="button" class="cagbas-cookie-reject">' +
        copy.reject + '</button>' +

        '<button type="button" class="cagbas-cookie-save">' +
        copy.save + '</button>' +

        '<button type="button" class="cagbas-cookie-accept">' +
        copy.accept + '</button>' +

        '</div></div>';

    document.body.appendChild(dialog);

    // Ayarlar düğmesi.
    const launcher = document.createElement('button');

    launcher.type = 'button';
    launcher.className = 'cagbas-cookie-launcher';
    launcher.textContent = copy.settings;
    launcher.hidden = true;

    document.body.appendChild(launcher);

    const analyticsToggle =
        dialog.querySelector('.cagbas-cookie-analytics');

    // Sayfa açılışında kayıtlı izni uygula.
    const existing = readConsent();

    if (existing !== null) {

        banner.hidden = true;
        launcher.hidden = false;

        analyticsToggle.checked = existing.analytics === true;

        if (existing.analytics === true) {
            enableAnalytics();
        } else {
            disableAnalytics();
        }

    } else {

        banner.hidden = false;
        launcher.hidden = true;

        disableAnalytics();
    }

    // Tercihleri aç.
    function openPreferences() {

        const current = readConsent();

        analyticsToggle.checked =
            current ? current.analytics === true : false;

        dialog.hidden = false;

        analyticsToggle.focus();
    }

    // Buton olayları.
    launcher.addEventListener('click', openPreferences);

    banner.querySelector('.cookie-accept')
        .addEventListener('click', function () {
            saveConsent(true);
        });

    banner.querySelector('.cookie-reject')
        .addEventListener('click', function () {
            saveConsent(false);
        });

    banner.querySelector('.cookie-preferences')
        .addEventListener('click', openPreferences);

    dialog.querySelector('.cagbas-cookie-dialog__close')
        .addEventListener('click', function () {
            dialog.hidden = true;
        });

    dialog.querySelector('.cagbas-cookie-reject')
        .addEventListener('click', function () {
            saveConsent(false);
        });

    dialog.querySelector('.cagbas-cookie-accept')
        .addEventListener('click', function () {
            saveConsent(true);
        });

    dialog.querySelector('.cagbas-cookie-save')
        .addEventListener('click', function () {
            saveConsent(analyticsToggle.checked === true);
        });

    dialog.addEventListener('click', function (event) {
        if (event.target === dialog) {
            dialog.hidden = true;
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && !dialog.hidden) {
            dialog.hidden = true;
        }
    });

});
