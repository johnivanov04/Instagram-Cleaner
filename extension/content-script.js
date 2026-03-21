const APP_TO_EXTENSION_SYNC = "IG_AUDIT_APP_SYNC";
const EXTENSION_TO_APP_REQUEST_SYNC = "IG_AUDIT_EXTENSION_REQUEST_SYNC";

const ROOT_ID = "ig-audit-sidebar";
const TOGGLE_ID = "ig-audit-toggle";

const isInstagram = window.location.hostname === "www.instagram.com";
const isAppHost =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

let payload = null;
let sidebarRoot = null;
let toggleButton = null;
let observer = null;
let diagnosticsExpanded = false;
let syncStatusTimer = null;

const diagnostics = {
  source: "Unknown",
  lastSyncAtMs: null,
  lastAppSyncAtMs: null,
  syncStatus: "",
};

function setSyncStatus(text) {
  diagnostics.syncStatus = text;
  renderSidebar();

  if (syncStatusTimer) {
    window.clearTimeout(syncStatusTimer);
    syncStatusTimer = null;
  }

  if (text.length > 0) {
    syncStatusTimer = window.setTimeout(() => {
      diagnostics.syncStatus = "";
      renderSidebar();
      syncStatusTimer = null;
    }, 2200);
  }
}

function markDiagnosticsSource(source) {
  diagnostics.source = source;
  diagnostics.lastSyncAtMs = Date.now();

  if (source === "App sync") {
    diagnostics.lastAppSyncAtMs = diagnostics.lastSyncAtMs;
  }
}

function toRelativeTime(ms) {
  if (!ms) {
    return "never";
  }

  const elapsed = Date.now() - ms;
  if (elapsed < 10_000) {
    return "just now";
  }

  const seconds = Math.floor(elapsed / 1000);
  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function isAppSyncStale() {
  if (!diagnostics.lastAppSyncAtMs) {
    return false;
  }

  return Date.now() - diagnostics.lastAppSyncAtMs > 5 * 60 * 1000;
}

function sendRuntimeMessage(message, callback) {
  if (!chrome?.runtime?.id) {
    return;
  }

  try {
    chrome.runtime.sendMessage(message, (response) => {
      void chrome.runtime.lastError;
      callback?.(response);
    });
  } catch {
    // Extension context can be invalidated during reloads; ignore stale script calls.
  }
}

function normalizeUsername(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/^@+/, "").toLowerCase();
}

function formatCategory(value) {
  return String(value || "").replaceAll("-", " ");
}

function getUnfollowAccounts() {
  if (!payload || !Array.isArray(payload.accounts)) {
    return [];
  }

  return payload.accounts.filter((item) => item.status === "unfollow");
}

function getCompletedCount() {
  if (!payload || !Array.isArray(payload.accounts)) {
    return 0;
  }

  return payload.accounts.filter((item) => item.status === "completed").length;
}

function savePayload(nextPayload) {
  payload = nextPayload;
  markDiagnosticsSource("App sync");
  sendRuntimeMessage({ type: "IG_AUDIT_SYNC_PAYLOAD", payload: nextPayload });
}

function requestPayloadFromBackground() {
  sendRuntimeMessage({ type: "IG_AUDIT_REQUEST_PAYLOAD" }, (response) => {
    if (!response) {
      return;
    }

    if (response && response.payload) {
      payload = response.payload;
      markDiagnosticsSource("Cached storage");
      renderSidebar();
      highlightMatches();
      injectInlineButtons();
      return;
    }

    sendRuntimeMessage({ type: "IG_AUDIT_REQUEST_SYNC_FROM_APP" });
  });
}

function openProfile(username) {
  const clean = normalizeUsername(username);
  if (!clean) {
    return;
  }

  window.open(`https://www.instagram.com/${clean}/`, "_blank", "noopener,noreferrer");
}

function markCompleted(username, shouldNotifyApp = true) {
  const normalized = normalizeUsername(username);
  if (!normalized || !payload || !Array.isArray(payload.accounts)) {
    return;
  }

  const nextAccounts = payload.accounts.map((account) => {
    if (normalizeUsername(account.normalizedUsername || account.username) !== normalized) {
      return account;
    }

    return {
      ...account,
      status: "completed",
      selected: false,
    };
  });

  payload = {
    ...payload,
    accounts: nextAccounts,
    unfollowTargets: nextAccounts
      .filter((account) => account.status === "unfollow")
      .map((account) => account.username)
      .sort((a, b) => a.localeCompare(b)),
    generatedAt: new Date().toISOString(),
  };

  sendRuntimeMessage({ type: "IG_AUDIT_MARK_COMPLETED", username });

  if (shouldNotifyApp) {
    sendRuntimeMessage(
      { type: "IG_AUDIT_BROADCAST_TO_APP", payload: { type: "IG_AUDIT_MARK_COMPLETED", username } },
    );
  }

  renderSidebar();
  highlightMatches();
  injectInlineButtons();
}

function mountUi() {
  if (!isInstagram || !document.body) {
    return;
  }

  if (!toggleButton) {
    toggleButton = document.createElement("button");
    toggleButton.id = TOGGLE_ID;
    toggleButton.type = "button";
    toggleButton.textContent = "IG Audit";
    toggleButton.addEventListener("click", () => {
      if (sidebarRoot) {
        sidebarRoot.classList.toggle("open");
      }
    });
    document.body.append(toggleButton);
  }

  if (!sidebarRoot) {
    sidebarRoot = document.createElement("aside");
    sidebarRoot.id = ROOT_ID;
    document.body.append(sidebarRoot);
  }

  renderSidebar();
}

function renderSidebar() {
  if (!isInstagram || !sidebarRoot) {
    return;
  }

  const accounts = getUnfollowAccounts();
  const completed = getCompletedCount();
  const total = accounts.length + completed;
  const staleWarning = isAppSyncStale();
  const lastSync = toRelativeTime(diagnostics.lastSyncAtMs);
  const lastAppSync = toRelativeTime(diagnostics.lastAppSyncAtMs);
  const syncStatus = diagnostics.syncStatus
    ? `<div class="ig-audit-sync-status">${diagnostics.syncStatus}</div>`
    : "";
  const staleText = staleWarning
    ? '<div class="ig-audit-warning">App sync is stale (older than 5m).</div>'
    : "";
  const diagnosticsPanel = `
    <details class="ig-audit-diagnostics" ${diagnosticsExpanded ? "open" : ""}>
      <summary>Diagnostics</summary>
      <div class="ig-audit-diagnostics-content">
        <p><strong>Source:</strong> ${diagnostics.source}</p>
        <p><strong>Last sync:</strong> ${lastSync}</p>
        <p><strong>Last app sync:</strong> ${lastAppSync}</p>
        <p><strong>Active targets:</strong> ${accounts.length}</p>
        ${staleText}
      </div>
    </details>
  `;

  const listMarkup = accounts
    .map((account) => {
      const completedClass = "";
      const actionButton = '<button type="button" data-action="complete">Mark Completed</button>';

      return `
      <article class="ig-audit-item ${completedClass}" data-username="${account.username}">
        <div class="ig-audit-username">@${account.username}</div>
        <div class="ig-audit-item-meta">${formatCategory(account.category)} • ${account.status}</div>
        <div class="ig-audit-item-row">
          <button type="button" data-action="open">Open profile</button>
          ${actionButton}
        </div>
      </article>
    `;
    })
    .join("");

  sidebarRoot.innerHTML = `
    <div class="ig-audit-inner">
      <div class="ig-audit-header">
        <div>
          <div class="ig-audit-title">IG Follow Audit Helper</div>
          <div class="ig-audit-meta">${completed} / ${total} completed</div>
          ${syncStatus}
        </div>
        <button type="button" data-action="request-sync">Sync</button>
      </div>
      ${diagnosticsPanel}
      <div class="ig-audit-actions">
        <button type="button" data-action="next">Open next unfollow target</button>
      </div>
      <div class="ig-audit-list">
        ${listMarkup || "<p>No accounts marked for unfollow yet.</p>"}
      </div>
    </div>
  `;

  sidebarRoot.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const target = event.currentTarget;
      if (!(target instanceof HTMLButtonElement)) {
        return;
      }

      const action = target.dataset.action;
      if (!action) {
        return;
      }

      if (action === "request-sync") {
        setSyncStatus("Syncing...");
        sendRuntimeMessage({ type: "IG_AUDIT_REQUEST_SYNC_FROM_APP" }, () => {
          setSyncStatus("Synced");
        });
        return;
      }

      if (action === "next") {
        const next = accounts.find((account) => account.status === "unfollow");
        if (next) {
          openProfile(next.username);
        }
        return;
      }

      const article = target.closest(".ig-audit-item");
      const username = article && article.getAttribute("data-username");
      if (!username) {
        return;
      }

      if (action === "open") {
        openProfile(username);
        return;
      }

      if (action === "complete") {
        markCompleted(username, true);
        return;
      }

    });
  });

  const diagnosticsElement = sidebarRoot.querySelector(".ig-audit-diagnostics");
  if (diagnosticsElement instanceof HTMLDetailsElement) {
    diagnosticsElement.addEventListener("toggle", () => {
      diagnosticsExpanded = diagnosticsElement.open;
    });
  }
}

function resolveUsernameFromContext(node) {
  if (!(node instanceof HTMLElement)) {
    return "";
  }

  const usernameFromHref = node
    .querySelector('a[href^="/"]')
    ?.getAttribute("href")
    ?.split("/")
    .filter(Boolean)[0];

  if (usernameFromHref) {
    return normalizeUsername(usernameFromHref);
  }

  const words = (node.textContent || "")
    .split(/\s+/)
    .map((part) => part.replace(/[^a-zA-Z0-9._]/g, ""))
    .filter(Boolean);

  for (const word of words) {
    const normalized = normalizeUsername(word);
    if (normalized.length >= 3 && normalized.length <= 30) {
      return normalized;
    }
  }

  return "";
}

function highlightMatches() {
  if (!isInstagram) {
    return;
  }

  const accounts = getUnfollowAccounts();
  const watch = new Set(accounts.map((account) => normalizeUsername(account.normalizedUsername || account.username)));

  document.querySelectorAll(".ig-audit-highlight").forEach((el) => {
    el.classList.remove("ig-audit-highlight");
  });

  if (watch.size === 0) {
    return;
  }

  const candidates = document.querySelectorAll("article, li, div");
  for (const node of candidates) {
    const username = resolveUsernameFromContext(node);
    if (watch.has(username)) {
      node.classList.add("ig-audit-highlight");
    }
  }
}

function injectInlineButtons() {
  if (!isInstagram) {
    return;
  }

  const accounts = getUnfollowAccounts();
  const targets = new Set(
    accounts
      .filter((account) => account.status === "unfollow")
      .map((account) => normalizeUsername(account.normalizedUsername || account.username)),
  );

  const current = normalizeUsername(window.location.pathname.split("/").filter(Boolean)[0] || "");
  if (!current || !targets.has(current)) {
    document.querySelectorAll("[data-ig-audit-inline]").forEach((el) => el.remove());
    return;
  }

  const hostSelectors = ["main header section", "header section", "main section"];
  let host = null;
  for (const selector of hostSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      host = element;
      break;
    }
  }

  if (!host || host.querySelector("[data-ig-audit-inline]")) {
    return;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.dataset.igAuditInline = "true";
  button.textContent = "Mark Completed in IG Audit";
  button.style.marginTop = "8px";
  button.style.padding = "8px 12px";
  button.style.borderRadius = "8px";
  button.style.border = "1px solid #0f766e";
  button.style.background = "#ecfeff";
  button.style.color = "#134e4a";
  button.style.cursor = "pointer";
  button.addEventListener("click", () => markCompleted(current, true));

  host.append(button);
}

function startObserver() {
  if (!isInstagram) {
    return;
  }

  if (observer) {
    observer.disconnect();
  }

  observer = new MutationObserver(() => {
    highlightMatches();
    injectInlineButtons();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

function initAppRelayMode() {
  window.addEventListener("message", (event) => {
    if (event.source !== window || typeof event.data !== "object" || event.data === null) {
      return;
    }

    const data = event.data;

    if (data.type === APP_TO_EXTENSION_SYNC && data.payload) {
      sendRuntimeMessage({ type: "IG_AUDIT_SYNC_PAYLOAD", payload: data.payload });
    }
  });

  if (!chrome?.runtime?.onMessage) {
    return;
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (!message || typeof message !== "object" || typeof message.type !== "string") {
      return;
    }

    if (message.type === "IG_AUDIT_MARK_COMPLETED" && typeof message.username === "string") {
      window.postMessage({ type: "IG_AUDIT_MARK_COMPLETED", username: message.username }, window.location.origin);
    }

    if (message.type === "IG_AUDIT_REQUEST_SYNC_FROM_APP") {
      window.postMessage({ type: EXTENSION_TO_APP_REQUEST_SYNC }, window.location.origin);
    }
  });
}

function initInstagramMode() {
  window.addEventListener("message", (event) => {
    if (event.source !== window || typeof event.data !== "object" || event.data === null) {
      return;
    }

    const data = event.data;

    if (data.type === APP_TO_EXTENSION_SYNC && data.payload) {
      savePayload(data.payload);
      markDiagnosticsSource("App sync");
      renderSidebar();
      highlightMatches();
      injectInlineButtons();
    }
  });

  if (!chrome?.runtime?.onMessage) {
    return;
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (!message || typeof message !== "object" || typeof message.type !== "string") {
      return;
    }

    if (message.type === "IG_AUDIT_SYNC_PAYLOAD" && message.payload) {
      payload = message.payload;
      markDiagnosticsSource("App sync");
      renderSidebar();
      highlightMatches();
      injectInlineButtons();
      return;
    }

    if (message.type === "IG_AUDIT_REQUEST_SYNC_FROM_APP") {
      sendRuntimeMessage({ type: "IG_AUDIT_REQUEST_SYNC_FROM_APP" });
    }
  });

  mountUi();
  requestPayloadFromBackground();
  startObserver();
  setInterval(() => {
    highlightMatches();
    injectInlineButtons();
    renderSidebar();
  }, 4000);
}

if (isAppHost) {
  initAppRelayMode();
}

if (isInstagram) {
  initInstagramMode();
}
