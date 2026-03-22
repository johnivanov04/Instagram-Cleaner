/**
 * Action log engine (JavaScript version for content-script).
 * Manages storage, retrieval, and lifecycle of action log entries.
 */

const STORAGE_KEY = 'igAuditActionLog';
const MAX_STORED_ENTRIES = 50;

class ActionLogEngine {
  constructor() {
    this.onEntryAddedCallbacks = [];
  }

  /**
   * Add a new entry to the action log.
   */
  addEntry(type, details = {}) {
    return new Promise((resolve) => {
      const entry = {
        id: generateActionLogId(),
        type,
        timestamp: Date.now(),
        details,
      };

      // Get current entries
      this.getStoredEntries().then((allEntries) => {
        // Add to front and trim
        allEntries.unshift(entry);
        const trimmed = allEntries.slice(0, MAX_STORED_ENTRIES);

        // Save to storage
        chrome.storage.local.set({ [STORAGE_KEY]: trimmed }, () => {
          void chrome.runtime.lastError;
          
          // Notify listeners
          this.onEntryAddedCallbacks.forEach((callback) => {
            try {
              callback(entry, trimmed);
            } catch (error) {
              console.error('[Action Log] Listener error:', error);
            }
          });

          resolve();
        });
      });
    });
  }

  /**
   * Get the last N entries from storage.
   */
  getEntries(limit = 10) {
    return new Promise((resolve) => {
      this.getStoredEntries().then((allEntries) => {
        resolve(allEntries.slice(0, limit));
      });
    });
  }

  /**
   * Get all stored entries.
   */
  getStoredEntries() {
    return new Promise((resolve) => {
      if (!chrome?.storage) {
        resolve([]);
        return;
      }

      chrome.storage.local.get(STORAGE_KEY, (result) => {
        void chrome.runtime.lastError;
        const entries = result?.[STORAGE_KEY];
        resolve(Array.isArray(entries) ? entries : []);
      });
    });
  }

  /**
   * Clear all entries from storage.
   */
  clearLog() {
    return new Promise((resolve) => {
      if (!chrome?.storage) {
        resolve();
        return;
      }

      chrome.storage.local.remove(STORAGE_KEY, () => {
        void chrome.runtime.lastError;
        resolve();
      });
    });
  }

  /**
   * Register a callback to be called when a new entry is added.
   */
  onEntryAdded(callback) {
    this.onEntryAddedCallbacks.push(callback);
  }

  /**
   * Remove a previously registered callback.
   */
  removeListener(callback) {
    this.onEntryAddedCallbacks = this.onEntryAddedCallbacks.filter(cb => cb !== callback);
  }

  /**
   * Clear all listeners.
   */
  clearListeners() {
    this.onEntryAddedCallbacks = [];
  }

  /**
   * Get current entry count in storage.
   */
  async getEntryCount() {
    const allEntries = await this.getStoredEntries();
    return allEntries.length;
  }
}

// Create singleton instance
const actionLogEngine = new ActionLogEngine();
