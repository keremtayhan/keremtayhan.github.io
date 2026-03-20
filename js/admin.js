const loginView = document.getElementById("loginView");
const adminView = document.getElementById("adminView");
const loginForm = document.getElementById("loginForm");
const createLogForm = document.getElementById("createLogForm");
const loginError = document.getElementById("loginError");
const createMessage = document.getElementById("createMessage");
const adminLogList = document.getElementById("adminLogList");
const logoutBtn = document.getElementById("logoutBtn");
const formModeLabel = document.getElementById("formModeLabel");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

let currentEditingId = null;
let adminLogs = [];

function showLogin() {
  loginView.hidden = false;
  adminView.hidden = true;
  logoutBtn.hidden = true;
}

function showAdmin() {
  loginView.hidden = true;
  adminView.hidden = false;
  logoutBtn.hidden = false;
}

function setCreateMode() {
  currentEditingId = null;
  createLogForm.reset();
  createLogForm.classList.remove("editing");
  createLogForm.elements.id.value = "";
  createLogForm.elements.published.checked = true;
  createLogForm.elements.pinned.checked = false;
  formModeLabel.textContent = "NEW ENTRY";
  submitBtn.textContent = "PUBLISH ENTRY";
  cancelEditBtn.hidden = true;
  createMessage.textContent = "";
}

function setEditMode(log) {
  currentEditingId = log.id;
  formModeLabel.textContent = `EDIT ENTRY / ${log.id}`;
  submitBtn.textContent = "SAVE CHANGES";
  cancelEditBtn.hidden = false;

  createLogForm.elements.id.value = log.id;
  createLogForm.elements.title.value = log.title;
  createLogForm.elements.category.value = log.category;
  createLogForm.elements.content.value = log.content || log.excerpt || "";
  createLogForm.elements.pinned.checked = !!Number(log.pinned);
  createLogForm.elements.published.checked = !!Number(log.published);
  createMessage.textContent = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function checkAuth() {
  const res = await fetch("/api/admin/me");
  return res.ok;
}

async function loadLogs() {
  const res = await fetch("/api/logs-admin");
  const logs = await res.json();

  adminLogs = logs;
  adminLogList.innerHTML = "";

  if (!logs.length) {
    adminLogList.innerHTML = `<p class="page-description">no logs yet.</p>`;
    return;
  }

  logs.forEach((log) => {
    const state = [
      log.pinned ? "PINNED" : null,
      log.published ? "PUBLISHED" : "DRAFT",
    ].filter(Boolean).join(" / ");

    const item = document.createElement("article");
    item.className = "admin-log-item";
    item.innerHTML = `
      <div class="meta">${log.date} / ${log.category} / ${state}</div>
      <h3>${log.title}</h3>
      <p>${log.excerpt || log.content}</p>
      <div class="admin-log-actions">
        <button type="button" class="button-chip" data-edit-id="${log.id}">EDIT</button>
        <button type="button" class="button-chip" data-delete-id="${log.id}">DELETE</button>
      </div>
    `;
    adminLogList.appendChild(item);
  });

  bindLogActions();
}

function bindLogActions() {
  document.querySelectorAll("[data-edit-id]").forEach((btn) => {
    btn.onclick = () => {
      const id = Number(btn.dataset.editId);
      const log = adminLogs.find((item) => Number(item.id) === id);
      if (log) setEditMode(log);
    };
  });

  document.querySelectorAll("[data-delete-id]").forEach((btn) => {
    btn.onclick = async () => {
      const id = Number(btn.dataset.deleteId);
      const ok = window.confirm("delete this entry?");
      if (!ok) return;

      const res = await fetch(`/api/admin/logs/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        createMessage.textContent = data.error || "failed to delete";
        return;
      }

      createMessage.textContent = "entry deleted";
      if (currentEditingId === id) setCreateMode();
      await loadLogs();
    };
  });
}

loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.textContent = "";

  const formData = new FormData(loginForm);
  const payload = Object.fromEntries(formData.entries());

  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    loginError.textContent = data.error || "login failed";
    return;
  }

  showAdmin();
  setCreateMode();
  await loadLogs();
});

createLogForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  createMessage.textContent = "";

  const formData = new FormData(createLogForm);
  const payload = Object.fromEntries(formData.entries());

  const isEdit = !!currentEditingId;

  const res = await fetch(
    isEdit ? `/api/admin/logs/${currentEditingId}` : "/api/admin/logs/create",
    {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: payload.title,
        category: payload.category,
        content: payload.content,
        pinned: createLogForm.elements.pinned.checked,
        published: createLogForm.elements.published.checked,
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    createMessage.textContent = data.error || "failed to save";
    return;
  }

  createMessage.textContent = isEdit ? "entry updated" : "entry published";
  setCreateMode();
  await loadLogs();
});

cancelEditBtn?.addEventListener("click", () => {
  setCreateMode();
});

logoutBtn?.addEventListener("click", async () => {
  await fetch("/api/admin/logout", { method: "POST" });
  showLogin();
});

(async function init() {
  const authed = await checkAuth();
  
  if (authed) {
    showAdmin();
    setCreateMode();
    await loadLogs();
  } else {
    showLogin();
  }
})();