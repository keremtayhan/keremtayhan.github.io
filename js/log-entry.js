function getSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get("slug");
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return map[m];
  });
}

async function loadEntry() {
  const container = document.getElementById("entryContainer");
  const topTag = document.getElementById("entryTopTag");
  const slug = getSlug();

  if (!slug) {
    container.innerHTML = `<p class="entry-not-found">missing slug.</p>`;
    return;
  }

  try {
    const res = await fetch(`/api/logs/${encodeURIComponent(slug)}`);

    if (!res.ok) {
      throw new Error(`failed to load entry: ${res.status}`);
    }

    const log = await res.json();

    document.title = `IMDAT / ${log.title}`;
    topTag.textContent = log.category;

    container.innerHTML = `
      <div class="entry-meta">
        <span class="entry-date">${escapeHtml(log.date)}</span>
        <span class="entry-tag">${escapeHtml(log.category)}</span>
      </div>

      <h1 class="entry-title">${escapeHtml(log.title)}</h1>

      <div class="entry-body">${escapeHtml(log.content)}</div>
    `;
  } catch (error) {
    console.error("LOAD ENTRY ERROR:", error);
    container.innerHTML = `<p class="entry-not-found">entry not found.</p>`;
  }
}

loadEntry();