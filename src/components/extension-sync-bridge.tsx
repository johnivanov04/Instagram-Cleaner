"use client";

import * as React from "react";
import { buildAuditRows } from "@/lib/instagram/audit";
import {
  APP_TO_EXTENSION_SYNC,
  EXTENSION_SYNC_EVENT,
  EXTENSION_TO_APP_COMPLETE,
  EXTENSION_TO_APP_REQUEST_SYNC,
  buildExtensionPayload,
} from "@/lib/instagram/extension";
import { normalizeUsername } from "@/lib/instagram/normalize";
import { useAuditStore } from "@/store/use-audit-store";

function emitSyncPayload(): void {
  const state = useAuditStore.getState();

  if (!state.comparison) {
    const emptyPayload = buildExtensionPayload([]);
    window.dispatchEvent(new CustomEvent(EXTENSION_SYNC_EVENT, { detail: emptyPayload }));
    window.postMessage({ type: APP_TO_EXTENSION_SYNC, payload: emptyPayload }, window.location.origin);
    return;
  }

  const rows = buildAuditRows(state.comparison, state.reviewState);
  const payload = buildExtensionPayload(rows);

  window.dispatchEvent(new CustomEvent(EXTENSION_SYNC_EVENT, { detail: payload }));
  window.postMessage({ type: APP_TO_EXTENSION_SYNC, payload }, window.location.origin);
}

export function ExtensionSyncBridge(): null {
  React.useEffect(() => {
    emitSyncPayload();

    const unsubscribe = useAuditStore.subscribe(() => {
      emitSyncPayload();
    });

    const handleMessage = (event: MessageEvent): void => {
      if (event.source !== window || typeof event.data !== "object" || event.data === null) {
        return;
      }

      const data = event.data as { type?: string; username?: string };

      if (data.type === EXTENSION_TO_APP_REQUEST_SYNC || data.type === "IG_AUDIT_REQUEST_SYNC_FROM_APP") {
        emitSyncPayload();
        return;
      }

      const isCompletion =
        data.type === EXTENSION_TO_APP_COMPLETE || data.type === "IG_AUDIT_MARK_COMPLETED";

      if (!isCompletion || typeof data.username !== "string") {
        return;
      }

      const normalized = normalizeUsername(data.username);
      if (!normalized) {
        return;
      }

      useAuditStore.getState().setCompleted(normalized);
    };

    window.addEventListener("message", handleMessage);

    return () => {
      unsubscribe();
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return null;
}
