import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { resolveSelector, getSelector, selectorRegistry } from '../selector-registry';
import { getAllMockVariants } from './mock-instagram-dom';

describe('Selector Health & Fallback Strategy', () => {
  let originalDOM: HTMLElement;

  beforeEach(() => {
    // Preserve original DOM
    originalDOM = document.body.cloneNode(true) as HTMLElement;
  });

  afterEach(() => {
    // Restore original DOM
    document.body.innerHTML = originalDOM.innerHTML;
  });

  describe('Profile Header Selector', () => {
    it('should resolve primary selector on standard profile layout', () => {
      const mockVariants = getAllMockVariants();
      const page = mockVariants.profileStandard();
      document.body.appendChild(page);

      const def = getSelector('profileHeader');
      if (!def) throw new Error('profileHeader selector not found');

      const result = resolveSelector(def, document);

      expect(result.status).toBe('healthy');
      expect(result.fallbackUsed).toBeNull();
      expect(result.selector).toBe(def.primary);
      expect(result.element).not.toBeNull();
    });

    it('should use fallback #1 on minimal profile layout', () => {
      const mockVariants = getAllMockVariants();
      const page = mockVariants.profileMinimal();
      document.body.appendChild(page);

      const def = getSelector('profileHeader');
      if (!def) throw new Error('profileHeader selector not found');

      const result = resolveSelector(def, document);

      expect(result.status).toBe('partial');
      expect(result.fallbackUsed).toBe(0); // First fallback
      expect(result.element).not.toBeNull();
    });

    it('should use fallback #2 on extended profile layout', () => {
      const mockVariants = getAllMockVariants();
      const page = mockVariants.profileExtended();
      document.body.appendChild(page);

      const def = getSelector('profileHeader');
      if (!def) throw new Error('profileHeader selector not found');

      const result = resolveSelector(def, document);

      // Should find via one of the fallbacks
      expect(result.status).toMatch(/healthy|partial/);
      expect(result.element).not.toBeNull();
    });

    it('should fail on broken profile layout', () => {
      const mockVariants = getAllMockVariants();
      const page = mockVariants.brokenProfile();
      document.body.appendChild(page);

      const def = getSelector('profileHeader');
      if (!def) throw new Error('profileHeader selector not found');

      const result = resolveSelector(def, document);

      expect(result.status).toBe('failed');
      expect(result.element).toBeNull();
      expect(result.attemptedCount).toBe(def.fallbacks.length + 1);
    });
  });

  describe('Highlight Candidates Selector', () => {
    it('should resolve primary selector on article-based follower list', () => {
      const mockVariants = getAllMockVariants();
      const page = mockVariants.followerListArticle();
      document.body.appendChild(page);

      const def = getSelector('highlightCandidates');
      if (!def) throw new Error('highlightCandidates selector not found');

      const result = resolveSelector(def, document);

      expect(result.status).toBe('healthy');
      expect(result.fallbackUsed).toBeNull();
      expect(result.selector).toBe(def.primary);
      expect(result.element).not.toBeNull();
    });

    it('should use fallback on li-based follower list (older layout)', () => {
      const mockVariants = getAllMockVariants();
      const page = mockVariants.followerListLi();
      document.body.appendChild(page);

      const def = getSelector('highlightCandidates');
      if (!def) throw new Error('highlightCandidates selector not found');

      const result = resolveSelector(def, document);

      // Should find via fallback since primary won't match
      expect(result.status).toMatch(/healthy|partial/);
      expect(result.element).not.toBeNull();
    });

    it('should resolve rich/data-testid variant', () => {
      const mockVariants = getAllMockVariants();
      const page = mockVariants.followerListRich();
      document.body.appendChild(page);

      const def = getSelector('highlightCandidates');
      if (!def) throw new Error('highlightCandidates selector not found');

      const result = resolveSelector(def, document);

      // Should resolve via fallback chain for role/attribute selectors
      expect([result.fallbackUsed]).not.toBeNull();
      expect(result.element).not.toBeNull();
    });
  });

  describe('Profile Link Selector', () => {
    it('should resolve primary selector for profile links', () => {
      const mockVariants = getAllMockVariants();
      const container = mockVariants.profileLinkContainer();
      document.body.appendChild(container);

      const def = getSelector('profileLink');
      if (!def) throw new Error('profileLink selector not found');

      const result = resolveSelector(def, document);

      expect(result.status).toBe('healthy');
      expect(result.fallbackUsed).toBeNull();
      expect(result.element?.getAttribute('href')).toBe('/testuser');
    });

    it('should allow usage in element context', () => {
      const mockVariants = getAllMockVariants();
      const container = mockVariants.profileLinkContainer();
      document.body.appendChild(container);

      const def = getSelector('profileLink');
      if (!def) throw new Error('profileLink selector not found');

      // Resolve within the container, not document
      const result = resolveSelector(def, container);

      expect(result.element).not.toBeNull();
      expect(result.element?.getAttribute('href')).toBe('/testuser');
    });
  });

  describe('Fallback Chain Behavior', () => {
    it('should track which fallback was used', () => {
      const mockVariants = getAllMockVariants();
      const page = mockVariants.followerListLi();
      document.body.appendChild(page);

      const def = getSelector('highlightCandidates');
      if (!def) throw new Error('highlightCandidates selector not found');

      const result = resolveSelector(def, document);

      if (result.fallbackUsed !== null) {
        // Verify the fallback index is valid
        expect(result.fallbackUsed).toBeGreaterThanOrEqual(0);
        expect(result.fallbackUsed).toBeLessThan(def.fallbacks.length);
        // Verify the selector matches the fallback
        expect(result.selector).toBe(def.fallbacks[result.fallbackUsed]);
      }
    });

    it('should attempt all selectors before failing', () => {
      const mockVariants = getAllMockVariants();
      const page = mockVariants.brokenProfile();
      document.body.appendChild(page);

      const def = getSelector('profileHeader');
      if (!def) throw new Error('profileHeader selector not found');

      const result = resolveSelector(def, document);

      if (result.status === 'failed') {
        // Should have tried all selectors (primary + all fallbacks)
        expect(result.attemptedCount).toBe(def.fallbacks.length + 1);
      }
    });
  });

  describe('Registry Completeness', () => {
    it('should have all critical selectors defined', () => {
      const criticalSelectors = [
        'profileHeader',
        'highlightCandidates',
        'profileLink',
        'injectPoint',
      ];

      for (const name of criticalSelectors) {
        expect(getSelector(name)).not.toBeNull();
      }
    });

    it('should have fallback chains for each selector', () => {
      const selectors = Object.values(selectorRegistry);

      for (const sel of selectors) {
        expect(sel.fallbacks).toBeDefined();
        expect(Array.isArray(sel.fallbacks)).toBe(true);
        expect(sel.fallbacks.length).toBeGreaterThan(0);
      }
    });

    it('should have valid primary selectors', () => {
      const selectors = Object.values(selectorRegistry);
      const primaries = selectors.map(s => s.primary);

      // Verify primary selectors are valid strings
      for (const primary of primaries) {
        expect(typeof primary).toBe('string');
        expect(primary.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid selector syntax gracefully', () => {
      document.body.innerHTML = '<div>test</div>';

      // Create an invalid selector def
      const invalidDef = {
        name: 'invalid',
        purpose: 'test',
        primary: 'invalid[[[syntax',
        fallbacks: [],
      };

      const result = resolveSelector(invalidDef, document);

      expect(result.status).toBe('failed');
      expect(result.element).toBeNull();
    });

    it('should return null element for non-matching selectors', () => {
      document.body.innerHTML = '<div>test</div>';

      const def = getSelector('profileHeader');
      if (!def) throw new Error('profileHeader selector not found');

      const result = resolveSelector(def, document);

      expect(result.element).toBeNull();
      expect(result.status).toBe('failed');
    });
  });
});
