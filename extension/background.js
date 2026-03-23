const STORAGE_KEY = "igAuditPayload";

function safeSendToTab(tabId, payload) {
  chrome.tabs.sendMessage(tabId, payload, () => {
    // Ignore missing receivers (tab not reloaded, page doesn't match, or script not injected).
    void chrome.runtime.lastError;
  });
}

function broadcastToUrls(urls, payload, done) {
  chrome.tabs.query({ url: urls }, (tabs) => {
    for (const tab of tabs) {
      if (tab.id) {
        safeSendToTab(tab.id, payload);
      }
    }

    done?.();
  });
}

function normalizeUsername(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/^@+/, "").toLowerCase();
}

function updatePayloadWithCompleted(payload, username) {
  if (!payload || typeof payload !== "object" || !Array.isArray(payload.accounts)) {
    return payload;
  }

  const normalized = normalizeUsername(username);
  if (!normalized) {
    return payload;
  }

  const accounts = payload.accounts.map((account) => {
    if (normalizeUsername(account.normalizedUsername || account.username) !== normalized) {
      return account;
    }

    return {
      ...account,
      status: "completed",
      selected: false,
    };
  });

  const unfollowTargets = accounts
    .filter((account) => account.status === "unfollow")
    .map((account) => account.username)
    .sort((a, b) => a.localeCompare(b));

  return {
    ...payload,
    generatedAt: new Date().toISOString(),
    accounts,
    unfollowTargets,
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || typeof message !== "object" || typeof message.type !== "string") {
    return;
  }

  if (message.type === "IG_AUDIT_SYNC_PAYLOAD") {
    chrome.storage.local.set({ [STORAGE_KEY]: message.payload });
    broadcastToUrls(["https://www.instagram.com/*"], {
      type: "IG_AUDIT_SYNC_PAYLOAD",
      payload: message.payload,
    });
    sendResponse({ ok: true });
    return true;
  }

  if (message.type === "IG_AUDIT_REQUEST_PAYLOAD") {
    chrome.storage.local.get(STORAGE_KEY, (result) => {
      sendResponse({ payload: result[STORAGE_KEY] || null });
    });
    return true;
  }

  if (message.type === "IG_AUDIT_MARK_COMPLETED") {
    chrome.storage.local.get(STORAGE_KEY, (result) => {
      const next = updatePayloadWithCompleted(result[STORAGE_KEY], message.username);
      chrome.storage.local.set({ [STORAGE_KEY]: next }, () => {
        broadcastToUrls(["https://igtidy.com/*", "http://localhost:3000/*", "http://127.0.0.1:3000/*"], {
          type: "IG_AUDIT_MARK_COMPLETED",
          username: message.username,
        });

        sendResponse({ ok: true, payload: next });
      });
    });

    return true;
  }

  if (message.type === "IG_AUDIT_REQUEST_SYNC_FROM_APP") {
    broadcastToUrls(["https://igtidy.com/*", "http://localhost:3000/*", "http://127.0.0.1:3000/*"], {
      type: "IG_AUDIT_REQUEST_SYNC_FROM_APP",
    }, () => {
      sendResponse({ ok: true });
    });

    return true;
  }

  if (message.type === "IG_AUDIT_BROADCAST_TO_APP" && message.payload) {
    broadcastToUrls(["https://igtidy.com/*", "http://localhost:3000/*", "http://127.0.0.1:3000/*"], message.payload, () => {
      sendResponse({ ok: true });
    });

    return true;
  }
});
