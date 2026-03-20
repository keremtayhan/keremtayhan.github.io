let allLogs = [];
let currentFilter = "ALL";

async function loadLogs() {
  const container = document.getElementById("log-container");

  try {
    const res = await fetch("/api/logs");

    if (!res.ok) {
      throw new Error(`failed to load logs: ${res.status}`);
    }

    allLogs = await res.json();
    renderLogs();
    bindFilters();
  } catch (error) {
    console.error("LOAD LOGS ERROR:", error);
    container.innerHTML = `
      <div class="panel">
        <p class="page-description">failed to load archive.</p>
      </div>
    `;
  }
}

function renderLogs() {
  const container = document.getElementById("log-container");
  container.innerHTML = "";

  const filtered =
    currentFilter === "ALL"
      ? allLogs
      : allLogs.filter((log) => log.category === currentFilter);

  if (!filtered.length) {
    container.innerHTML = `
      <div class="panel">
        <p class="page-description">no logs in this category.</p>
      </div>
    `;
    return;
  }

filtered.forEach((log, index) => {
  const link = document.createElement("a");
  link.className = "log-entry-link";
  link.href = `log-entry.html?slug=${encodeURIComponent(log.slug)}`;

  const pinnedClass = Number(log.pinned) ? " pinned-entry" : "";

  link.innerHTML = `
    <article class="log-entry${pinnedClass}">
      <div class="entry-topline">
        <span class="entry-date">${log.date}</span>
        <span class="entry-tag">${Number(log.pinned) ? "PINNED / " : ""}${log.category}</span>
      </div>
      <div class="entry-main">
        <div class="entry-index">${String(index + 1).padStart(2, "0")}</div>
        <div class="entry-copy">
          <h2>${log.title}</h2>
          <p>${log.excerpt || log.content}</p>
        </div>
      </div>
    </article>
  `;

  container.appendChild(link);
});
}

function bindFilters() {
  const filterLinks = document.querySelectorAll("[data-filter]");
  if (!filterLinks.length) return;

  filterLinks.forEach((link) => {
    link.onclick = (e) => {
      e.preventDefault();
      currentFilter = link.dataset.filter;

      filterLinks.forEach((item) => item.classList.remove("is-active"));
      link.classList.add("is-active");

      renderLogs();
    };
  });
}

loadLogs();