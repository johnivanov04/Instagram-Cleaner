/**
 * Action log type definitions and utilities (JavaScript version).
 * Tracks user and system actions (syncs, completions, errors) with timestamps.
 */

/**
 * Convert a log entry to a human-readable string with relative time.
 * Example: "Marked @testuser1 completed • 2m ago"
 */
function formatActionLogEntry(entry, currentTimeMs = Date.now()) {
  const elapsed = currentTimeMs - entry.timestamp;
  const relativeTime = toRelativeTime(elapsed);

  switch (entry.type) {
    case 'sync_request':
      return `Sync requested • ${relativeTime}`;
    case 'sync_completed':
      return `Sync completed • ${relativeTime}`;
    case 'mark_completed':
      return `Marked @${entry.details?.username || '?'} completed • ${relativeTime}`;
    case 'open_profile':
      return `Opened @${entry.details?.username || '?'} • ${relativeTime}`;
    case 'selector_health_failed':
      return `⚠️ Selector failed: ${entry.details?.selectorName || '?'} • ${relativeTime}`;
    case 'app_sync_received':
      return `Sync received from app • ${relativeTime}`;
    case 'payload_cached':
      return `Payload cached • ${relativeTime}`;
    case 'clear_log':
      return `Log cleared • ${relativeTime}`;
    default:
      return `Action • ${relativeTime}`;
  }
}

/**
 * Convert milliseconds to relative time string.
 */
function toRelativeTime(ms) {
  if (ms < 10_000) {
    return 'just now';
  }

  const seconds = Math.floor(ms / 1000);
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

/**
 * Generate a unique ID for a log entry.
 */
function generateActionLogId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
