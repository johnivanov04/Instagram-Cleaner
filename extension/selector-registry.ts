/**
 * Centralized registry of all critical Instagram DOM selectors with fallback chains.
 * Each selector includes primary and fallback options for resilience against Instagram layout changes.
 */

export interface SelectorDefinition {
  name: string;
  purpose: string;
  primary: string;
  fallbacks: string[];
  context?: 'document' | 'element'; // 'document' = querySelector on document, 'element' = querySelector on specific element
}

export interface SelectorResult {
  name: string;
  status: 'healthy' | 'partial' | 'failed';
  attemptedCount: number;
  fallbackUsed: number | null; // null if primary worked, 0+ if fallback used
  selector: string; // which selector actually succeeded
  element: HTMLElement | null;
}

/**
 * All critical selectors for Instagram integration.
 * Organized by purpose with fallback chains in order of preference.
 */
export const selectorRegistry: Record<string, SelectorDefinition> = {
  // Profile page: button injection point
  profileHeader: {
    name: 'profileHeader',
    purpose: 'Location to inject "Mark Completed" button on profile pages',
    primary: 'main header section',
    fallbacks: [
      'header section',
      'main section',
      'header',
      'main > div > section:first-of-type',
    ],
    context: 'document',
  },

  // Follower/Following lists: account highlighting candidates
  highlightCandidates: {
    name: 'highlightCandidates',
    purpose: 'Find follower/following list items to highlight matching accounts',
    primary: 'article[role="presentation"]',
    fallbacks: [
      'article',
      'li',
      'div[data-testid*="profile"]',
      '[role="listitem"]',
    ],
    context: 'document',
  },

  // Profile links: username extraction from href
  profileLink: {
    name: 'profileLink',
    purpose: 'Find profile link to extract username from URL',
    primary: 'a[href^="/"]',
    fallbacks: [
      'a[role="link"][href^="/"]',
      'a[href*="/"]',
    ],
    context: 'element', // typically used within a specific element context
  },

  // Sidebar container for injecting extension UI
  injectPoint: {
    name: 'injectPoint',
    purpose: 'Location to inject extension sidebar',
    primary: 'body',
    fallbacks: [
      'html',
    ],
    context: 'document',
  },
};

/**
 * Test if a selector is valid and returns a non-empty element.
 * Returns the matched element(s) or null.
 */
export function testSelector(
  selector: string,
  context: Document | Element = document
): HTMLElement | HTMLElement[] | null {
  try {
    if (context instanceof Element) {
      const single = context.querySelector(selector);
      return single instanceof HTMLElement ? single : null;
    } else {
      const single = document.querySelector(selector);
      return single instanceof HTMLElement ? single : null;
    }
  } catch {
    // Invalid selector syntax
    return null;
  }
}

/**
 * Test all selectors in a definition and return which one works.
 * Returns the first selector that matches an element (primary first, then fallbacks).
 */
export function resolveSelector(
  definition: SelectorDefinition,
  context: Document | Element = document
): SelectorResult {
  const allSelectors = [definition.primary, ...definition.fallbacks];

  for (let i = 0; i < allSelectors.length; i++) {
    const selector = allSelectors[i];
    const element = testSelector(selector, context);

    if (element) {
      return {
        name: definition.name,
        status: i === 0 ? 'healthy' : 'partial',
        attemptedCount: i + 1,
        fallbackUsed: i === 0 ? null : i - 1,
        selector,
        element: Array.isArray(element) ? element[0] : element,
      };
    }
  }

  return {
    name: definition.name,
    status: 'failed',
    attemptedCount: allSelectors.length,
    fallbackUsed: null,
    selector: definition.primary,
    element: null,
  };
}

/**
 * Resolve multiple selectors at once.
 * Returns a map of selector name → SelectorResult.
 */
export function resolveSelectors(
  definitionNames: string[],
  context: Document | Element = document
): Record<string, SelectorResult> {
  const results: Record<string, SelectorResult> = {};

  for (const name of definitionNames) {
    const definition = selectorRegistry[name];
    if (!definition) {
      console.warn(`[Selector Registry] Unknown selector: ${name}`);
      continue;
    }
    results[name] = resolveSelector(definition, context);
  }

  return results;
}

/**
 * Get a selector definition by name.
 */
export function getSelector(name: string): SelectorDefinition | null {
  return selectorRegistry[name] || null;
}

/**
 * Get all selector definition names.
 */
export function getAllSelectorNames(): string[] {
  return Object.keys(selectorRegistry);
}
