/**
 * Health check engine for Instagram DOM selectors.
 * Periodically validates critical selectors and logs failures for diagnostics.
 */

import {
  getAllSelectorNames,
  getSelector,
  resolveSelectors,
  SelectorResult,
  SelectorDefinition,
} from './selector-registry';

export interface HealthCheckState {
  timestamp: number;
  results: Record<string, SelectorResult>;
  hasFailures: boolean;
  failureCount: number;
}

class SelectorHealthEngine {
  private pollIntervalMs = 6000; // Run health check every 6 seconds
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private lastState: HealthCheckState | null = null;
  private onStateChange: ((state: HealthCheckState) => void) | null = null;

  /**
   * Run health check on all critical selectors.
   * Returns map of selector name → health result.
   */
  public runHealthCheck(): HealthCheckState {
    const selectorNames = getAllSelectorNames();
    const results = resolveSelectors(selectorNames);

    const hasFailures = Object.values(results).some(r => r.status === 'failed');
    const failureCount = Object.values(results).filter(r => r.status === 'failed').length;

    const state: HealthCheckState = {
      timestamp: Date.now(),
      results,
      hasFailures,
      failureCount,
    };

    // Log failures for debugging
    if (hasFailures && this.lastState) {
      const previousFailures = Object.values(this.lastState.results).filter(r => r.status === 'failed');
      const newFailures = Object.values(state.results).filter(r => r.status === 'failed' && !previousFailures.some(p => p.name === r.name));
      
      if (newFailures.length > 0) {
        console.warn('[Selector Health] New selector failures detected:', newFailures.map(f => f.name));
      }
    }

    this.lastState = state;
    return state;
  }

  /**
   * Start periodic health checks.
   * Calls onStateChange callback whenever health state changes.
   */
  public startPolling(onStateChange: (state: HealthCheckState) => void): void {
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
  public stopPolling(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
      console.log('[Selector Health] Polling stopped');
    }
  }

  /**
   * Get the last health check state.
   */
  public getLastState(): HealthCheckState | null {
    return this.lastState;
  }

  /**
   * Get detailed status for a specific selector.
   * Returns human-readable string (e.g., "Healthy (primary)" or "Partial (fallback #2)").
   */
  public getStatusString(selectorName: string): string {
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
  public getSummary(): {
    healthy: number;
    partial: number;
    failed: number;
    total: number;
    percentage: number;
  } {
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
   * Set the polling interval (in milliseconds).
   */
  public setPollingInterval(ms: number): void {
    if (this.pollTimer) {
      console.warn('[Selector Health] Cannot change interval while polling. Stop polling first.');
      return;
    }
    this.pollIntervalMs = ms;
  }
}

// Export singleton instance
export const selectorHealthEngine = new SelectorHealthEngine();
