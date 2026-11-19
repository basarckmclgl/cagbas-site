// URL'den e-posta adresini almak için
function getQueryParam(param) {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

document.addEventListener('DOMContentLoaded', function () {
    let email = getQueryParam('email');

    if (email) {
        unsubscribeUser(email);
    } else {
        document.getElementById('unsubscribeMessage').innerHTML = '<h1>E-posta adresi bulunamadı.</h1>';
    }
});

function unsubscribeUser(email) {
    fetch(`http://localhost:3000/unsubscribe/${encodeURIComponent(email)}`)
        .then(response => {
            if (response.ok) {
                document.getElementById('unsubscribeMessage').innerHTML = '<h1>Abonelikten başarıyla çıkıldı.</h1>';
                setTimeout(() => {
                    window.close();
                }, 10000); // 10 saniye sonra pencereyi kapat
            } else {
                document.getElementById('unsubscribeMessage').innerHTML = '<h1>Bir hata oluştu. Lütfen tekrar deneyin.</h1>';
            }
        })
        .catch(error => {
            console.error('Hata: ', error);
            document.getElementById('unsubscribeMessage').innerHTML = '<h1>Bir hata oluştu. Lütfen tekrar deneyin.</h1>';
        });
}
