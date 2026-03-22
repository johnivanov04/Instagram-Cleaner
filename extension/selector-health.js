/**
 * Selector health check engine for content-script.js
 * Periodically validates critical selectors and logs failures for diagnostics.
 */

class SelectorHealthEngine {
  constructor() {
    this.pollIntervalMs = 6000; // 6 seconds
    this.pollTimer = null;
    this.lastState = null;
    this.onStateChange = null;
  }

  /**
   * Run health check on all critical selectors.
   */
  runHealthCheck() {
    const selectorNames = getAllSelectorNames();
    const results = resolveSelectors(selectorNames);

    const hasFailures = Object.values(results).some(r => r.status === 'failed');
    const failureCount = Object.values(results).filter(r => r.status === 'failed').length;

    const state = {
      timestamp: Date.now(),
      results,
      hasFailures,
      failureCount,
    };

    // Log new failures
    if (hasFailures && this.lastState) {
      const previousFailures = Object.values(this.lastState.results).filter(r => r.status === 'failed');
      const newFailures = Object.values(state.results).filter(
        r => r.status === 'failed' && !previousFailures.some(p => p.name === r.name)
      );

      if (newFailures.length > 0) {
        console.warn('[Selector Health] New selector failures detected:', newFailures.map(f => f.name));
      }
    }

    this.lastState = state;
    return state;
  }

  /**
   * Start periodic health checks.
   */
  startPolling(onStateChange) {
    if (this.pollTimer) {
      console.warn('[Selector Health] Polling already started');
      return;
    }

    this.onStateChange = onStateChange;

    // Run immediately
    const initialState = this.runHealthCheck();
    onStateChange(initialState);

    // Then run on interval
    this.pollTimer = setInterval(() => {
      const state = this.runHealthCheck();
      onStateChange(state);
    }, this.pollIntervalMs);

    console.log(`[Selector Health] Polling started (interval: ${this.pollIntervalMs}ms)`);
  }

  /**
   * Stop periodic health checks.
   */
  stopPolling() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
      console.log('[Selector Health] Polling stopped');
    }
  }

  /**
   * Get the last health check state.
   */
  getLastState() {
    return this.lastState;
  }

  /**
   * Get detailed status string for a specific selector.
   */
  getStatusString(selectorName) {
    if (!this.lastState) {
      return 'Unknown';
    }

    const result = this.lastState.results[selectorName];
    if (!result) {
      return 'Not tested';
    }

    switch (result.status) {
      case 'healthy':
        return result.fallbackUsed === null ? 'Healthy (primary)' : `Partial (fallback #${result.fallbackUsed + 1})`;
      case 'partial':
        return `Partial (fallback #${result.fallbackUsed !== null ? result.fallbackUsed + 1 : 'unknown'})`;
      case 'failed':
        return `Failed (tried ${result.attemptedCount})`;
      default:
        return 'Unknown';
    }
  }

  /**
   * Get a summary of overall health.
   */
  getSummary() {
    if (!this.lastState) {
      return { healthy: 0, partial: 0, failed: 0, total: 0, percentage: 0 };
    }

    const results = Object.values(this.lastState.results);
    const healthy = results.filter(r => r.status === 'healthy').length;
    const partial = results.filter(r => r.status === 'partial').length;
    const failed = results.filter(r => r.status === 'failed').length;
    const total = results.length;
    const percentage = total > 0 ? Math.round(((healthy + partial) / total) * 100) : 0;

    return { healthy, partial, failed, total, percentage };
  }

  /**
   * Set the polling interval (requires stopping and restarting).
   */
  setPollingInterval(ms) {
    if (this.pollTimer) {
      console.warn('[Selector Health] Cannot change interval while polling. Stop polling first.');
      return;
    }
    this.pollIntervalMs = ms;
  }
}

// Create singleton instance
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const selectorHealthEngine = new SelectorHealthEngine();
