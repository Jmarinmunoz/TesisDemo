(function () {
  const layout = document.querySelector(".layout");
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const notifBtn = document.getElementById("notif-btn");
  const popover = document.getElementById("notif-popover");
  const registerForm = document.querySelector(".register-form");
  const usersTableBody = document.getElementById("users-table-body");
  const usersTotal = document.getElementById("users-total");
  const usersAdmin = document.getElementById("users-admin");
  const usersSupervisor = document.getElementById("users-supervisor");
  const usersOperador = document.getElementById("users-operador");
  const exportButtons = document.querySelectorAll("[data-export-action]");

  function showToast(kind, title, message, anchorElement) {
    const existing = document.querySelector(".app-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = `app-toast app-toast--${kind}`;
    toast.innerHTML = `
      <div class="app-toast__head">
        <span class="app-toast__title">${title}</span>
        <button type="button" class="app-toast__close" aria-label="Cerrar">×</button>
      </div>
      <p class="app-toast__body">${message}</p>
    `;

    const closeBtn = toast.querySelector(".app-toast__close");
    closeBtn?.addEventListener("click", function () {
      toast.remove();
    });

    const host = anchorElement?.closest(".report-btn-wrap, .sidebar-user-card") || document.body;
    host.appendChild(toast);
    window.setTimeout(function () {
      toast.remove();
    }, 5200);
  }

  function setSidebarCollapsed(collapsed) {
    if (!layout || !sidebarToggle) return;
    layout.classList.toggle("is-sidebar-collapsed", collapsed);
    sidebarToggle.setAttribute("aria-expanded", String(!collapsed));
    sidebarToggle.setAttribute(
      "aria-label",
      collapsed ? "Mostrar panel lateral" : "Ocultar panel lateral"
    );
  }

  if (layout && sidebar && sidebarToggle) {
    sidebarToggle.addEventListener("click", function () {
      const collapsed = !layout.classList.contains("is-sidebar-collapsed");
      setSidebarCollapsed(collapsed);
    });
  }

  // Gestión de usuarios demo en localStorage
  const STORAGE_KEY = "usuariosDemo";
  const CURRENT_USER_KEY = "usuarioDemoActual";

  function getDemoUsers() {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // si algo falla, reseteamos
      }
    }
    const base = [
      { nombre: "Ana", apellido: "García", email: "ana.admin@demo.cl", rol: "Administrador" },
      { nombre: "Luis", apellido: "Pérez", email: "luis.supervisor@demo.cl", rol: "Supervisor" },
      { nombre: "Marta", apellido: "López", email: "marta.mecanico@demo.cl", rol: "Operador (Mecánico)" }
    ];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(base));
    return base;
  }

  function saveDemoUsers(list) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function getCurrentDemoUser() {
    const users = getDemoUsers();
    const raw = window.localStorage.getItem(CURRENT_USER_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.nombre && parsed?.apellido && parsed?.rol) return parsed;
      } catch {
        // fallback a default
      }
    }
    const preferred =
      users.find((u) => u.rol.toLowerCase().includes("admin")) ||
      users[0] ||
      { nombre: "Usuario", apellido: "Demo", email: "demo@local", rol: "Operador (Mecánico)" };
    window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(preferred));
    return preferred;
  }

  function setCurrentDemoUser(user) {
    window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  function allowedPagesForRole(role) {
    const r = role.toLowerCase();
    if (r.includes("admin")) return ["dashboard.html", "ordenes.html", "inventario.html", "usuarios.html", "reportes.html"];
    if (r.includes("supervisor")) return ["dashboard.html", "ordenes.html", "inventario.html", "reportes.html"];
    return ["dashboard.html", "ordenes.html", "inventario.html"];
  }

  function applyRolePermissions(role) {
    const allowed = new Set(allowedPagesForRole(role));
    const links = document.querySelectorAll(".menu-item[href]");
    const isOperatorView = role.toLowerCase().includes("operador");
    links.forEach((link) => {
      const href = link.getAttribute("href") || "";
      link.style.display = allowed.has(href) ? "" : "none";
    });

    const quickActionsSection = document.querySelector(".quick-actions");
    if (quickActionsSection) {
      quickActionsSection.style.display = isOperatorView ? "none" : "";
    }

    const currentPage = window.location.pathname.split("/").pop() || "dashboard.html";
    if (!allowed.has(currentPage) && currentPage !== "") {
      window.location.href = "dashboard.html";
    }
  }

  function renderSidebarUserCard() {
    if (!sidebar) return;
    const existing = sidebar.querySelector(".sidebar-user-card");
    if (existing) existing.remove();

    const preferred = getCurrentDemoUser();

    const card = document.createElement("div");
    card.className = "sidebar-user-card";
    card.innerHTML = `
      <span class="sidebar-user-name">Tipo de vista</span>
      <span class="sidebar-user-role">${preferred.rol}</span>
      <div class="sidebar-switcher">
        <label class="sidebar-switcher__label" for="sidebar-view-select">Cambiar vista</label>
        <select id="sidebar-view-select" class="sidebar-switcher__select">
          <option value="Administrador">Administrador</option>
          <option value="Supervisor">Supervisor</option>
          <option value="Operador (Mecánico)">Operador (Mecánico)</option>
        </select>
        <button type="button" class="sidebar-switcher__btn">Aplicar vista</button>
      </div>
    `;
    sidebar.appendChild(card);

    const viewSelect = card.querySelector("#sidebar-view-select");
    const applyBtn = card.querySelector(".sidebar-switcher__btn");
    if (viewSelect) viewSelect.value = preferred.rol;

    applyBtn?.addEventListener("click", function () {
      const selectedRole = viewSelect?.value || preferred.rol;
      const selected = { ...preferred, rol: selectedRole };
      setCurrentDemoUser(selected);
      renderSidebarUserCard();
      applyRolePermissions(selected.rol);
      showToast("excel", "Vista actualizada", `Ahora estás viendo la demo como ${selected.rol}.`, applyBtn);
    });
  }

  renderSidebarUserCard();
  applyRolePermissions(getCurrentDemoUser().rol);

  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const nombre = /** @type {HTMLInputElement|null} */ (document.getElementById("nombre"))?.value.trim();
      const apellido = /** @type {HTMLInputElement|null} */ (document.getElementById("apellido"))?.value.trim();
      const email = /** @type {HTMLInputElement|null} */ (document.getElementById("email-reg"))?.value.trim();
      const rolSelect = /** @type {HTMLSelectElement|null} */ (document.getElementById("rol"));
      const rolValue = rolSelect ? rolSelect.options[rolSelect.selectedIndex].text : "";

      if (!nombre || !apellido || !email || !rolValue) {
        alert("Completa nombre, apellido, email y rol.");
        return;
      }

      const users = getDemoUsers();
      users.push({ nombre, apellido, email, rol: rolValue });
      saveDemoUsers(users);
      alert("Usuario registrado para este entorno demo.\nSe guardará solo en este navegador y aparecerá en la lista de Usuarios Activos.");
      window.location.href = "usuarios.html";
    });
  }

  if (usersTableBody) {
    const users = getDemoUsers();
    const adminCount = users.filter((u) => u.rol.toLowerCase().includes("admin")).length;
    const supervisorCount = users.filter((u) => u.rol.toLowerCase().includes("supervisor")).length;
    const operadorCount = users.filter(
      (u) => u.rol.toLowerCase().includes("operador") || u.rol.toLowerCase().includes("mecánico")
    ).length;

    usersTableBody.innerHTML = users
      .map(
        (u) =>
          `<tr><td>${u.nombre} ${u.apellido}</td><td>${u.email}</td><td><span class="role-badge">${u.rol}</span></td></tr>`
      )
      .join("");

    if (usersTotal) usersTotal.textContent = String(users.length);
    if (usersAdmin) usersAdmin.textContent = String(adminCount);
    if (usersSupervisor) usersSupervisor.textContent = String(supervisorCount);
    if (usersOperador) usersOperador.textContent = String(operadorCount);
  }

  if (exportButtons.length > 0) {
    exportButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const action = btn.getAttribute("data-export-action");
        if (action === "excel") {
          showToast(
            "excel",
            "Exportación a Excel",
            "Genera una planilla editable con KPIs, detalle de órdenes y métricas para análisis en hojas de cálculo.",
            btn
          );
          return;
        }
        if (action === "pdf") {
          showToast(
            "pdf",
            "Exportación a PDF",
            "Genera un informe con formato fijo, ideal para compartir con gerencia o imprimir con el resumen ejecutivo.",
            btn
          );
        }
      });
    });
  }

  if (!notifBtn || !popover) return;

  function openPopover() {
    popover.hidden = false;
    notifBtn.setAttribute("aria-expanded", "true");
  }

  function closePopover() {
    popover.hidden = true;
    notifBtn.setAttribute("aria-expanded", "false");
  }

  notifBtn.addEventListener("click", function () {
    if (popover.hidden) {
      openPopover();
      return;
    }
    closePopover();
  });

  document.addEventListener("click", function (event) {
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!popover.hidden && !popover.contains(target) && !notifBtn.contains(target)) {
      closePopover();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !popover.hidden) {
      closePopover();
    }
  });
})();
