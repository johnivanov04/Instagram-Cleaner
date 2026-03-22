import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  ActionLogEntry,
  ActionLogType,
  formatActionLogEntry,
  generateActionLogId,
} from '../action-log';

describe('Action Log Types & Utilities', () => {
  describe('generateActionLogId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateActionLogId();
      const id2 = generateActionLogId();

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
    });

    it('should include timestamp in ID', () => {
      const id = generateActionLogId();
      const timestamp = parseInt(id.split('-')[0], 10);

      expect(timestamp).toBeGreaterThan(0);
      expect(timestamp).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('formatActionLogEntry', () => {
    const baseTime = 1000000;

    it('should format sync_request action', () => {
      const entry: ActionLogEntry = {
        id: 'test-1',
        type: 'sync_request',
        timestamp: baseTime,
        details: {},
      };

      const formatted = formatActionLogEntry(entry, baseTime + 10_000);
      expect(formatted).toContain('Sync requested');
      expect(formatted).toContain('just now');
    });

    it('should format mark_completed action with username', () => {
      const entry: ActionLogEntry = {
        id: 'test-2',
        type: 'mark_completed',
        timestamp: baseTime,
        details: { username: 'testuser123' },
      };

      const formatted = formatActionLogEntry(entry, baseTime + 120_000);
      expect(formatted).toContain('Marked @testuser123 completed');
      expect(formatted).toContain('2m ago');
    });

    it('should format open_profile action', () => {
      const entry: ActionLogEntry = {
        id: 'test-3',
        type: 'open_profile',
        timestamp: baseTime,
        details: { username: 'someuser' },
      };

      const formatted = formatActionLogEntry(entry, baseTime + 60_000);
      expect(formatted).toContain('Opened @someuser');
      expect(formatted).toContain('1m ago');
    });

    it('should format selector_health_failed action', () => {
      const entry: ActionLogEntry = {
        id: 'test-4',
        type: 'selector_health_failed',
        timestamp: baseTime,
        details: { selectorName: 'profileHeader' },
      };

      const formatted = formatActionLogEntry(entry, baseTime + 3600_000);
      expect(formatted).toContain('Selector failed');
      expect(formatted).toContain('profileHeader');
      expect(formatted).toContain('1h ago');
    });

    it('should handle missing details gracefully', () => {
      const entry: ActionLogEntry = {
        id: 'test-5',
        type: 'mark_completed',
        timestamp: baseTime,
        details: {}, // No username
      };

      const formatted = formatActionLogEntry(entry, baseTime + 10_000);
      expect(formatted).toContain('Marked @? completed');
    });

    it('should use current time if not provided', () => {
      const now = Date.now();
      const entry: ActionLogEntry = {
        id: 'test-6',
        type: 'sync_completed',
        timestamp: now - 5_000,
        details: {},
      };

      const formatted = formatActionLogEntry(entry);
      expect(formatted).toContain('Sync completed');
      // Should show something like "just now" or "5s ago"
      expect(formatted).toMatch(/just now|[0-9]+s ago/);
    });

    it('should format all action types', () => {
      const types: ActionLogType[] = [
        'sync_request',
        'sync_completed',
        'mark_completed',
        'open_profile',
        'selector_health_failed',
        'app_sync_received',
        'payload_cached',
        'clear_log',
      ];

      const testTime = baseTime + 500_000;

      for (const type of types) {
        const entry: ActionLogEntry = {
          id: `test-${type}`,
          type,
          timestamp: baseTime,
          details: { username: 'testuser', selectorName: 'profileHeader' },
        };

        const formatted = formatActionLogEntry(entry, testTime);
        expect(formatted).toBeDefined();
        expect(formatted.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Relative Time Formatting', () => {
    const baseTime = 1000000;

    it('should show "just now" for recent actions', () => {
      const entry: ActionLogEntry = {
        id: 'test-recent',
        type: 'sync_completed',
        timestamp: baseTime,
        details: {},
      };

      const formatted = formatActionLogEntry(entry, baseTime + 5_000);
      expect(formatted).toContain('just now');
    });

    it('should show seconds ago', () => {
      const entry: ActionLogEntry = {
        id: 'test-seconds',
        type: 'sync_completed',
        timestamp: baseTime,
        details: {},
      };

      const formatted = formatActionLogEntry(entry, baseTime + 30_000);
      expect(formatted).toContain('30s ago');
    });

    it('should show minutes ago', () => {
      const entry: ActionLogEntry = {
        id: 'test-minutes',
        type: 'sync_completed',
        timestamp: baseTime,
        details: {},
      };

      const formatted = formatActionLogEntry(entry, baseTime + 300_000);
      expect(formatted).toContain('5m ago');
    });

    it('should show hours ago', () => {
      const entry: ActionLogEntry = {
        id: 'test-hours',
        type: 'sync_completed',
        timestamp: baseTime,
        details: {},
      };

      const formatted = formatActionLogEntry(entry, baseTime + 3600_000 * 2);
      expect(formatted).toContain('2h ago');
    });

    it('should show days ago', () => {
      const entry: ActionLogEntry = {
        id: 'test-days',
        type: 'sync_completed',
        timestamp: baseTime,
        details: {},
      };

      const formatted = formatActionLogEntry(entry, baseTime + 86400_000 * 3);
      expect(formatted).toContain('3d ago');
    });
  });
});
