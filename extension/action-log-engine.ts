/**
 * Action log engine for extension.
 * Manages storage, retrieval, and lifecycle of action log entries.
 */

import {
  ActionLogEntry,
  ActionLogType,
  ActionLogDetails,
  generateActionLogId,
} from './action-log';

const STORAGE_KEY = 'igAuditActionLog';
const MAX_STORED_ENTRIES = 50;

export interface ActionLogCallback {
  (entry: ActionLogEntry, allEntries: ActionLogEntry[]): void;
}

class ActionLogEngine {
  private onEntryAddedCallbacks: ActionLogCallback[] = [];

  /**
   * Add a new entry to the action log.
   * Automatically persists to storage and trims to MAX_STORED_ENTRIES.
   */
  public async addEntry(type: ActionLogType, details: ActionLogDetails = {}): Promise<void> {
    const entry: ActionLogEntry = {
      id: generateActionLogId(),
      type,
      timestamp: Date.now(),
      details,
    };

    // Get current entries from storage
    const allEntries = await this.getStoredEntries();

    // Add new entry and trim
    allEntries.unshift(entry); // Add to front (most recent first)
    const trimmed = allEntries.slice(0, MAX_STORED_ENTRIES);

    // Save to storage
    await new Promise<void>((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEY]: trimmed }, () => {
        void chrome.runtime.lastError; // Clear any errors
        resolve();
      });
    });

    // Notify listeners
    this.onEntryAddedCallbacks.forEach((callback) => {
      callback(entry, trimmed);
    });
  }

  /**
   * Get the last N entries from storage.
   */
  public async getEntries(limit: number = 10): Promise<ActionLogEntry[]> {
    const allEntries = await this.getStoredEntries();
    return allEntries.slice(0, limit);
  }

  /**
   * Get all stored entries (internal).
   */
  private getStoredEntries(): Promise<ActionLogEntry[]> {
    return new Promise((resolve) => {
      chrome.storage.local.get(STORAGE_KEY, (result) => {
        void chrome.runtime.lastError; // Clear any errors
        const entries = result[STORAGE_KEY] as ActionLogEntry[] | undefined;
        resolve(Array.isArray(entries) ? entries : []);
      });
    });
  }

  /**
   * Clear all entries from storage.
   */
  public async clearLog(): Promise<void> {
    return new Promise<void>((resolve) => {
      chrome.storage.local.remove(STORAGE_KEY, () => {
        void chrome.runtime.lastError; // Clear any errors
        resolve();
      });
    });
  }

  /**
   * Register a callback to be called when a new entry is added.
   */
  public onEntryAdded(callback: ActionLogCallback): void {
    this.onEntryAddedCallbacks.push(callback);
  }

  /**
   * Remove a previously registered callback.
   */
  public removeListener(callback: ActionLogCallback): void {
    this.onEntryAddedCallbacks = this.onEntryAddedCallbacks.filter(cb => cb !== callback);
  }

  /**
   * Clear all listeners.
   */
  public clearListeners(): void {
    this.onEntryAddedCallbacks = [];
  }

  /**
   * Get current entry count in storage.
   */
  public async getEntryCount(): Promise<number> {
    const allEntries = await this.getStoredEntries();
    return allEntries.length;
  }
}

// Export singleton instance
export const actionLogEngine = new ActionLogEngine();
