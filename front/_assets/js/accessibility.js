(function () {
  "use strict";
  function setupAccessibleForms() {
    document.querySelectorAll("form").forEach(function (form) {
      form.addEventListener("invalid", function (event) {
        var field = event.target;
        if (!field || !field.matches("input, textarea, select")) return;
        field.setAttribute("aria-invalid", "true");
        var id = field.id || field.name || "field";
        var errorId = "a11y-error-" + id.replace(/[^a-zA-Z0-9_-]/g, "-");
        var error = document.getElementById(errorId);
        if (!error) {
          error = document.createElement("span");
          error.id = errorId;
          error.className = "cb-sr-only";
          error.setAttribute("role", "alert");
          field.insertAdjacentElement("afterend", error);
        }
        error.textContent = field.validity.valueMissing
          ? (field.type === "checkbox" ? "Bu alanı onaylamanız gerekiyor." : "Bu alan zorunludur.")
          : field.validity.typeMismatch ? "Lütfen geçerli bir e-posta adresi girin."
          : "Lütfen bu alanı kontrol edin.";
        var described = (field.getAttribute("aria-describedby") || "").split(/\\s+/).filter(Boolean);
        if (!described.includes(errorId)) described.push(errorId);
        field.setAttribute("aria-describedby", described.join(" "));
      }, true);
      form.addEventListener("input", function (event) {
        var field = event.target;
        if (!field || !field.matches("input, textarea, select") || !field.checkValidity()) return;
        field.removeAttribute("aria-invalid");
        var id = field.id || field.name || "field";
        var errorId = "a11y-error-" + id.replace(/[^a-zA-Z0-9_-]/g, "-");
        var error = document.getElementById(errorId);
        if (error) error.textContent = "";
      });
    });
    if (window.jQuery && window.jQuery.fn && window.jQuery.fn.parsley) {
      window.jQuery("form[data-parsley-validate]").each(function () {
        var form = window.jQuery(this);
        try {
          form.parsley().on("field:error", function () {
            var field = this.$element && this.$element[0];
            if (!field) return;
            field.setAttribute("aria-invalid", "true");
            var error = field.parentNode.querySelector(".parsley-errors-list");
            if (error) { error.setAttribute("role", "alert"); error.setAttribute("aria-live", "assertive"); }
          }).on("field:success", function () {
            var field = this.$element && this.$element[0];
            if (field) field.removeAttribute("aria-invalid");
          });
        } catch (_) {}
      });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setupAccessibleForms);
  else setupAccessibleForms();
})();