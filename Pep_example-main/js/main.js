(function () {
  const loginForm = document.getElementById("login-form");
  const passwordInput = document.getElementById("password");
  const passwordToggle = document.getElementById("password-toggle");
  const modal = document.getElementById("recover-modal");
  const openBtn = document.getElementById("open-recover-modal");
  const recoverForm = document.getElementById("recover-form");
  const recoverEmail = document.getElementById("recover-email");

  if (passwordInput && passwordToggle) {
    passwordToggle.addEventListener("click", function () {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";
      passwordToggle.classList.toggle("is-visible", isHidden);
      passwordToggle.setAttribute(
        "aria-label",
        isHidden ? "Ocultar contraseña" : "Mostrar contraseña"
      );
      passwordToggle.setAttribute("aria-pressed", String(isHidden));
    });
  }

  loginForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    window.location.href = "dashboard.html";
  });

  if (!modal || !openBtn) return;

  let lastFocus = null;

  function openModal() {
    lastFocus = document.activeElement;
    modal.removeAttribute("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    recoverEmail?.focus();
  }

  function closeModal() {
    modal.setAttribute("hidden", "");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  openBtn.addEventListener("click", function (e) {
    e.preventDefault();
    openModal();
  });

  modal.addEventListener("click", function (e) {
    const t = e.target;
    if (t instanceof HTMLElement && t.closest("[data-close-modal]")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hasAttribute("hidden")) {
      closeModal();
    }
  });

  recoverForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    closeModal();
  });
})();
