// Eski localhost/e-posta-parametresi abonelikten çıkış akışı kaldırıldı.
// Güvenli çıkış, /api/newsletter/unsubscribe uç noktasındaki onay formuyla yapılır.
document.addEventListener("DOMContentLoaded", () => {
  const message = document.getElementById("unsubscribeMessage");
  if (message) message.textContent = "Abonelikten çıkış bağlantıları, e-postalarda yer alan güvenli onay sayfası üzerinden çalışır. Size ulaşan bağlantıyı kullanın.";
});