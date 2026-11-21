$(document).ready(function () {
    $('#link-otomotiv').on('click', function () {
        if ($(this).parent().hasClass('open')) {
            return
        } else {
            $('#accordion-img').fadeOut(500, function () {
                $('#accordion-img').attr("src", "/_assets/images/car-image.png");
            })
            $('#accordion-img').fadeIn(500);
        }


    })
    $('#link-gida').on('click', function () {
        if ($(this).parent().hasClass('open')) {
            return
        } else {
            $('#accordion-img').fadeOut(500, function () {
                $('#accordion-img').attr("src", "/_assets/images/gida.png");
            })
            $('#accordion-img').fadeIn(500);
        }


    })
    $('#link-is-gelistirme').on('click', function () {
        if ($(this).parent().hasClass('open')) {
            return
        } else {
            $('#accordion-img').fadeOut(500, function () {
                $('#accordion-img').attr("src", "/_assets/images/is-gelistirme.png");
            })
            $('#accordion-img').fadeIn(500);
        }


    })
    $('#link-finansal').on('click', function () {
        if ($(this).parent().hasClass('open')) {
            return
        } else {
            $('#accordion-img').fadeOut(500, function () {
                $('#accordion-img').attr("src", "/_assets/images/genel-ticaret.png");
            })
            $('#accordion-img').fadeIn(500);
        }


    })



    $('.link').on('click', function () {
        if ($(this).parent().hasClass('open')) {
            return;
        } else {
            $('.accordion-content-area').slideUp();
            $('.accordion__list').removeClass('open');
        }

    })

    $(function () {
        var Accordion = function (el, multiple) {
            this.el = el || {};
            this.multiple = multiple || true;

            // Variables
            var link = this.el.find('.link');
            // Eventos
            link.on('click', { el: this.el, multiple: this.multiple }, this.dropdown)
        }

        Accordion.prototype.dropdown = function (e) {
            var $el = e.data.el;
            $this = $(this),
                $next = $this.next();

            // Desencadena evento de apertura en los elementos siguientes a la clase link = ul.submenu
            $next.slideToggle();
            // Agregar clase open a elemento padre del elemento con clase link = li
            $this.parent().toggleClass('open');

            //Parametro inicial que permite ver 1 solo submenu abierto 
            if (!e.data.multiple) {
                $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
            }

        }
        // Elegir submenus multiples (true) submenus uno a la vez (false)
        var accordion = new Accordion($('#accordion'), false);
    });


    $(".modal .close, .modal .modal-close").click(function () { $(".modal").hide(); $(".modal iframe").attr("src", "about:blank"); })
    $(".modal").click(function (e) { if ($(e.target).hasClass("modal")) { $(".modal").hide(); $(".modal iframe").attr("src", "about:blank"); } });

});

function _error(message) {
    $(".modal").hide();
    $(".error-modal p").html(message);
    $(".error-modal").show();
}

function _success(message) {
    $(".modal").hide();
    $(".success-modal p").html(message);
    $(".success-modal").show();
}

function _openUrl(url) {
    $(".modal").hide();
    $(".video-modal iframe").attr("src", url);
    $(".video-modal").show();
}

/* ÇAĞBAŞ cookie consent: optional analytics is off until an explicit choice. */
document.addEventListener('DOMContentLoaded', function () {
    const CONSENT_KEY = 'cagbas_cookie_consent_v2';
    const LEGACY_KEY = 'cagbas_cookie_consent';
    const GA_ID = 'G-6YM7Q549C9';
    const lang = (document.documentElement.lang || 'tr').toLowerCase().slice(0, 2);
    const copy = {
        tr: {
            title: 'Çerez tercihleri', intro: 'Zorunlu çerezler sitenin çalışması için gereklidir. Analitik çerezleri yalnızca izninizle kullanılır.',
            necessary: 'Zorunlu çerezler', necessaryDesc: 'Güvenlik ve temel site işlevleri için gereklidir; kapatılamaz.',
            analytics: 'Analitik çerezleri', analyticsDesc: 'Ziyaret ve kullanım istatistiklerini Google Analytics ile ölçmemizi sağlar.',
            accept: 'Tümünü kabul et', reject: 'Reddet', manage: 'Tercihleri yönet', save: 'Tercihlerimi kaydet',
            settings: 'Çerez ayarları', policy: 'Çerez Politikası', close: 'Kapat'
        },
        en: {
            title: 'Cookie preferences', intro: 'Essential cookies are required for the website to work. Analytics cookies are used only with your permission.',
            necessary: 'Essential cookies', necessaryDesc: 'Required for security and core website functions; they cannot be disabled.',
            analytics: 'Analytics cookies', analyticsDesc: 'Allow us to measure visits and usage statistics with Google Analytics.',
            accept: 'Accept all', reject: 'Reject', manage: 'Manage preferences', save: 'Save my preferences',
            settings: 'Cookie settings', policy: 'Cookie Policy', close: 'Close'
        },
        ar: {
            title: 'تفضيلات ملفات تعريف الارتباط', intro: 'ملفات تعريف الارتباط الضرورية مطلوبة لتشغيل الموقع. لا تُستخدم ملفات التحليل إلا بموافقتك.',
            necessary: 'ملفات تعريف الارتباط الضرورية', necessaryDesc: 'مطلوبة للأمان والوظائف الأساسية ولا يمكن تعطيلها.',
            analytics: 'ملفات تعريف الارتباط التحليلية', analyticsDesc: 'تتيح لنا قياس الزيارات وإحصاءات الاستخدام باستخدام Google Analytics.',
            accept: 'قبول الكل', reject: 'رفض', manage: 'إدارة التفضيلات', save: 'حفظ تفضيلاتي',
            settings: 'إعدادات ملفات تعريف الارتباط', policy: 'سياسة ملفات تعريف الارتباط', close: 'إغلاق'
        }
    }[lang] || {
        title: 'Cookie preferences', intro: 'Essential cookies are required. Analytics cookies are used only with your permission.',
        necessary: 'Essential cookies', necessaryDesc: 'Required for core website functions.',
        analytics: 'Analytics cookies', analyticsDesc: 'Measure visits and usage with Google Analytics.',
        accept: 'Accept all', reject: 'Reject', manage: 'Manage preferences', save: 'Save preferences',
        settings: 'Cookie settings', policy: 'Cookie Policy', close: 'Close'
    };

    function readConsent() {
        try {
            const saved = localStorage.getItem(CONSENT_KEY);
            if (saved) return JSON.parse(saved);
            const legacy = localStorage.getItem(LEGACY_KEY);
            if (legacy === 'accepted') return { necessary: true, analytics: true };
            if (legacy === 'rejected') return { necessary: true, analytics: false };
        } catch (error) { console.warn('Cookie consent could not be read.', error); }
        return null;
    }

    function loadAnalytics() {
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
        window.gtag('consent', 'default', {
            analytics_storage: 'denied', ad_storage: 'denied',
            ad_user_data: 'denied', ad_personalization: 'denied'
        });
        window.gtag('consent', 'update', {
            analytics_storage: 'granted', ad_storage: 'denied',
            ad_user_data: 'denied', ad_personalization: 'denied'
        });
        if (window.cagbasAnalyticsLoaded) return;
        window.cagbasAnalyticsLoaded = true;
        window.gtag('js', new Date());
        window.gtag('config', GA_ID, { anonymize_ip: true });
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        script.dataset.cagbasAnalytics = 'true';
        document.head.appendChild(script);
    }

    function disableAnalytics() {
        if (window.gtag && window.cagbasAnalyticsLoaded) {
            window.gtag('consent', 'update', {
                analytics_storage: 'denied', ad_storage: 'denied',
                ad_user_data: 'denied', ad_personalization: 'denied'
            });
        }
        const hostParts = location.hostname.split('.');
        const rootDomain = hostParts.length > 1 ? hostParts.slice(-2).join('.') : location.hostname;
        document.cookie.split(';').forEach(function (part) {
            const name = part.split('=')[0].trim();
            if (/^(_ga|_gid|_gat)/.test(name)) {
                document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax';
                document.cookie = name + '=; Max-Age=0; path=/; domain=' + location.hostname + '; SameSite=Lax';
                document.cookie = name + '=; Max-Age=0; path=/; domain=.' + location.hostname + '; SameSite=Lax';
                document.cookie = name + '=; Max-Age=0; path=/; domain=' + rootDomain + '; SameSite=Lax';
                document.cookie = name + '=; Max-Age=0; path=/; domain=.' + rootDomain + '; SameSite=Lax';
            }
        });
    }

    function saveConsent(analytics) {
        const choice = { necessary: true, analytics: !!analytics, updatedAt: new Date().toISOString() };
        localStorage.setItem(CONSENT_KEY, JSON.stringify(choice));
        localStorage.setItem(LEGACY_KEY, analytics ? 'accepted' : 'rejected');
        if (choice.analytics) loadAnalytics(); else disableAnalytics();
        banner.hidden = true;
        launcher.hidden = false;
        dialog.hidden = true;
    }

    let banner = document.querySelector('.cookie-container');
    if (!banner) {
        banner = document.createElement('div');
        banner.className = 'cookie-container';
        banner.setAttribute('role', 'region');
        document.body.appendChild(banner);
    }
    banner.innerHTML = '<p>' + copy.intro + ' <a href="' + (lang === 'ar' ? '/ar/legal-information-ar.html#cookies' : lang === 'en' ? '/en/legal-information-en.html#cookies' : '/yasal-bilgilendirme.html#cerezler') + '">' + copy.policy + '</a></p><div class="cookie-actions"><button type="button" class="cookie-reject">' + copy.reject + '</button><button type="button" class="cookie-preferences">' + copy.manage + '</button><button type="button" class="cookie-accept">' + copy.accept + '</button></div>';

    const dialog = document.createElement('section');
    dialog.className = 'cagbas-cookie-dialog';
    dialog.hidden = true;
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'cagbas-cookie-title');
    dialog.innerHTML = '<div class="cagbas-cookie-dialog__panel" role="document"><button type="button" class="cagbas-cookie-dialog__close" aria-label="' + copy.close + '">×</button><h2 id="cagbas-cookie-title">' + copy.title + '</h2><p>' + copy.intro + '</p><div class="cagbas-cookie-option"><div><strong>' + copy.necessary + '</strong><p>' + copy.necessaryDesc + '</p></div><input type="checkbox" checked disabled aria-label="' + copy.necessary + '"></div><label class="cagbas-cookie-option"><span><strong>' + copy.analytics + '</strong><small>' + copy.analyticsDesc + '</small></span><input type="checkbox" class="cagbas-cookie-analytics"></label><div class="cagbas-cookie-dialog__actions"><button type="button" class="cagbas-cookie-reject">' + copy.reject + '</button><button type="button" class="cagbas-cookie-save">' + copy.save + '</button><button type="button" class="cagbas-cookie-accept">' + copy.accept + '</button></div></div>';
    document.body.appendChild(dialog);

    const launcher = document.createElement('button');
    launcher.type = 'button';
    launcher.className = 'cagbas-cookie-launcher';
    launcher.textContent = copy.settings;
    launcher.hidden = true;
    launcher.addEventListener('click', openPreferences);
    document.body.appendChild(launcher);

    const analyticsToggle = dialog.querySelector('.cagbas-cookie-analytics');
    const existing = readConsent();
    if (existing) {
        banner.hidden = true;
        launcher.hidden = false;
        analyticsToggle.checked = !!existing.analytics;
        if (existing.analytics) loadAnalytics();
        else disableAnalytics();
    } else {
        banner.hidden = false;
        launcher.hidden = true;
    }

    function openPreferences() {
        const current = readConsent();
        analyticsToggle.checked = !!current?.analytics;
        dialog.hidden = false;
        analyticsToggle.focus();
    }

    banner.querySelector('.cookie-accept').addEventListener('click', function () { saveConsent(true); });
    banner.querySelector('.cookie-reject').addEventListener('click', function () { saveConsent(false); });
    banner.querySelector('.cookie-preferences').addEventListener('click', openPreferences);
    dialog.querySelector('.cagbas-cookie-dialog__close').addEventListener('click', function () { dialog.hidden = true; });
    dialog.querySelector('.cagbas-cookie-reject').addEventListener('click', function () { saveConsent(false); });
    dialog.querySelector('.cagbas-cookie-accept').addEventListener('click', function () { saveConsent(true); });
    dialog.querySelector('.cagbas-cookie-save').addEventListener('click', function () { saveConsent(analyticsToggle.checked); });
    dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.hidden = true; });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !dialog.hidden) dialog.hidden = true; });
});
 
document.addEventListener('DOMContentLoaded', function () {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const emailInput = newsletterForm.querySelector('#newsletterEmail, input[type="email"]');
        const consentInput = newsletterForm.querySelector('#newsletterConsent, input[name="marketingConsent"], input[id^="a_c4ce"]');
        let feedback = newsletterForm.querySelector('#newsletterFeedback, .newsletter-feedback');
        if (!feedback) {
            feedback = document.createElement('p');
            feedback.className = 'newsletter-feedback';
            feedback.setAttribute('role', 'status');
            feedback.setAttribute('aria-live', 'polite');
            newsletterForm.appendChild(feedback);
        }
        const submitButton = newsletterForm.querySelector('button[type="submit"], input[type="submit"]');
        const email = emailInput ? emailInput.value.trim() : '';

        if (!emailInput || !emailInput.checkValidity()) {
            if (emailInput) emailInput.reportValidity();
            return;
        }
        if (!consentInput || !consentInput.checked) {
            if (feedback) feedback.textContent = 'Lütfen e-bülten gönderimi için onayınızı verin.';
            if (consentInput) consentInput.focus();
            return;
        }

        const originalText = submitButton ? (submitButton.tagName === 'INPUT' ? submitButton.value : submitButton.textContent) : '';
        if (submitButton) {
            submitButton.disabled = true;
            if (submitButton.tagName === 'INPUT') submitButton.value = '...';
            else submitButton.textContent = '...';
        }
        if (feedback) feedback.textContent = '';

        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, marketingConsent: true })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Abonelik kaydedilemedi.');
            newsletterForm.reset();
            if (feedback) feedback.textContent = result.message || 'Abonelik talebiniz alındı.';
            else if (typeof _success === 'function') _success(result.message || 'Abonelik talebiniz alındı.');
        } catch (error) {
            if (feedback) feedback.textContent = error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.';
            else if (typeof _error === 'function') _error(error.message || 'Bir hata oluştu.');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                if (submitButton.tagName === 'INPUT') submitButton.value = originalText;
                else submitButton.textContent = originalText;
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        if (window.jQuery && window.jQuery(contactForm).parsley && !window.jQuery(contactForm).parsley().isValid()) return;

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton ? submitButton.textContent : '';
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Gönderiliyor...';
        }

        const payload = {
            fullName: document.getElementById('FullName').value.trim(),
            email: document.getElementById('Email').value.trim(),
            phone: document.getElementById('Phone').value.trim(),
            subject: document.getElementById('Subject').value.trim(),
            message: document.getElementById('Message').value.trim()
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Mesajınız gönderilemedi.');

            contactForm.reset();
            if (typeof _success === 'function') _success(result.message || 'Mesajınız alındı.');
            else alert(result.message || 'Mesajınız alındı.');
        } catch (error) {
            if (typeof _error === 'function') _error(error.message || 'Bir hata oluştu.');
            else alert(error.message || 'Bir hata oluştu.');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        }
    });
});

// document.addEventListener('DOMContentLoaded', function () {
//     const langSelectorLinks = document.querySelectorAll('.langSelectorListItem a');

//     langSelectorLinks.forEach(link => {
//         link.addEventListener('click', function (event) {
//             event.preventDefault();
//             const selectedLang = this.querySelector('.langSelectorListNameLabel').title;
//             translateContentById('ana-sayfa', selectedLang);
//             translateContentById('hakkimizda', selectedLang);
//             translateContentById('hizmetlerimiz', selectedLang);
//             translateContentById('bize-ulasin', selectedLang);

//             translateContentById('ana-sayfa-mobile', selectedLang);
//             translateContentById('hakkimizda-mobile', selectedLang);
//             translateContentById('hizmetlerimiz-mobile', selectedLang);
//             translateContentById('bize-ulasin-mobile', selectedLang);

//             translateContentById('slider-content-wrapper-1', selectedLang);
//             translateContentById('slider-content-wrapper-2', selectedLang);
//             translateContentById('slider-content-wrapper-3', selectedLang);

//             translateContentById('middle-image-text-area-wrapper-title-1', selectedLang);
//             translateContentById('middle-image-text-area-wrapper-content-1', selectedLang);
//             translateContentById('middle-image-text-area-wrapper-title-2', selectedLang);
//             translateContentById('middle-image-text-area-wrapper-content-2', selectedLang);
//             translateContentById('middle-image-text-area-wrapper-title-3', selectedLang);
//             translateContentById('middle-image-text-area-wrapper-content-3', selectedLang);

//             translateContentById('footer-banner-text-wrapper-title', selectedLang);
//             translateContentById('footer-banner-text-wrapper-content', selectedLang);

//             translateContentById('footer-contact-area-item-e-bulten-title-1', selectedLang);
//             translateContentById('footer-contact-area-item-e-bulten-title-2', selectedLang);
//             translateContentById('footer-contact-area-item-e-bulten-content', selectedLang);
//             translateContentById('bize-ulasin-header-area-title', selectedLang);
            
//             translateContentById('contact-form-link', selectedLang);
//             translateContentById('kvkk', selectedLang);
//             translateContentById('onay', selectedLang);
//         });
//     });

//     async function translateContentById(elementId, targetLang) {
//         const element = document.getElementById(elementId);
//         const content = element.innerText;
    
//         if (targetLang === 'tr') {
//             // Refresh the page if targetLang is 'tr'
//             window.location.reload();
//             return; // Exit the function to avoid further execution
//         }
    
//         try {
//             const response = await fetch('http://localhost:3000/translate', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     msg: content,
//                     to: targetLang
//                 })
//             });
    
//             const data = await response.json();
//             if (response.ok) {
//                 element.innerText = data.translation;
//             } else {
//                 console.error('Translation error:', data);
//             }
//         } catch (error) {
//             console.error('Fetch error:', error);
//         }
//     }
// });

// document.addEventListener('DOMContentLoaded', () => {
//     const langItems = document.querySelectorAll('.langSelectorListItem');
//     const currentLang = document.getElementById('currentLang');

//     langItems.forEach(item => {
//         item.addEventListener('click', (event) => {
//             event.preventDefault();
            
//             // Remove the currently selected item from the body
//             const currentItem = document.querySelector('.langSelectorListItem.selected');
//             if (currentItem) {
//                 currentItem.classList.remove('selected');
//                 // Re-add it to the body if needed
//                 document.querySelector('.langSelectorList').appendChild(currentItem);
//             }
            
//             // Mark the new selected item
//             item.classList.add('selected');

//             const langCode = item.getAttribute('data-lang');
//             const langLabel = item.querySelector('.langSelectorListNameLabel').innerText;
//             const langFlagSrc = item.querySelector('img').src;

//             // Update the current language display
//             currentLang.querySelector('.langSelectorListNameFlag img').src = langFlagSrc;
//             currentLang.querySelector('.langSelectorListNameLabel').innerText = langLabel;

//             // Move the selected item to the top of the body list
//             item.parentElement.prepend(item);
//         });
//     });
// });

/* Native mobile navigation fallback: works even if the legacy jQuery bundle fails. */
(function () {
  function bindMobileNavigation() {
    var trigger = document.querySelector('.mobile-menu-icon-wrapper');
    var panel = document.querySelector('.mobile-menu-links-wrapper');
    if (!trigger || !panel || trigger.dataset.mobileNavBound === '1') return;
    trigger.dataset.mobileNavBound = '1';
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');
    trigger.setAttribute('aria-label', 'Menüyü aç veya kapat');
    trigger.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
    function toggle() {
      var open = !panel.classList.contains('open');
      panel.classList.toggle('open', open);
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('mobile-nav-open', open);
    }
    trigger.addEventListener('click', function (event) { event.preventDefault(); toggle(); });
    trigger.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); }
    });
    panel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
        trigger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('mobile-nav-open');
      });
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
        trigger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('mobile-nav-open');
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bindMobileNavigation);
  else bindMobileNavigation();
})();
