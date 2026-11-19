$(document).ready(function () {
    $('.mobile-menu-icon-wrapper').on('click', function () {
        $('.mobile-menu-links-wrapper').slideToggle();
        $('body').toggleClass('fixed-body');
    })

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

jQuery(function ($) {

    checkCookie();

    function checkCookie() {
        var consent = getCookie("cookies_consent");
        if (consent == null || consent == "" || consent == undefined) {
            $('.cookie-container').show();
        }
    }

    function setCookie(c_name, value, exdays) {

        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value + "; path=/";

        $('.cookie-container').slideUp();
    }


    
    function getCookie(c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                return unescape(y);
            }
        }
    }

    $(".cookie-container .close-button, .cookie-container .ok-button").click(function () {
        setCookie("cookies_consent", 1, 30);
    });

});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('newsletterForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('Email').value;

        fetch('http://localhost:3000/Newsletter/Insert', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Email: email })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Başarı:', data.message);
            _success('Abonelik başarılı!');
        })
        .catch(error => {
            console.error('Hata:', error);
            _error('Abonelik başarısız!');
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('contact-form').addEventListener('submit', function (e) {
        e.preventDefault(); // Formun otomatik olarak gönderilmesini engeller
    
        // Form verilerini topla
        const formData = {
            FullName: document.getElementById('FullName').value,
            Email: document.getElementById('Email').value,
            Phone: document.getElementById('Phone').value,
            Subject: document.getElementById('Subject').value,
            Message: document.getElementById('Message').value,
        };
    
        // Fetch API ile POST isteği gönder 
        fetch('http://localhost:3000/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (response.ok) {
                _success('Mesajınız başarıyla gönderildi.');
            } else {
                _error('Mesaj gönderilirken bir hata oluştu.');
            }
        })
        .catch(error => {
            console.error('Hata:', error);
            _error('Mesaj gönderilirken bir hata oluştu.');
        });
    });
})

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
