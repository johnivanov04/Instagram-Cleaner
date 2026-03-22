/**
 * Selector registry converted to JavaScript for content-script.js
 * Defines all critical Instagram DOM selectors with fallback chains.
 */

const selectorRegistry = {
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
  },

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
  },

  profileLink: {
    name: 'profileLink',
    purpose: 'Find profile link to extract username from URL',
    primary: 'a[href^="/"]',
    fallbacks: [
      'a[role="link"][href^="/"]',
      'a[href*="/"]',
    ],
  },

  injectPoint: {
    name: 'injectPoint',
    purpose: 'Location to inject extension sidebar',
    primary: 'body',
    fallbacks: ['html'],
  },
};

/**
 * Test if a selector is valid and returns a non-empty element.
 */
function testSelector(selector, context = document) {
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
 * Resolve a selector definition, returning which selector worked (primary or fallback).
 */
function resolveSelector(definition, context = document) {
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
        element,
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
 */
function resolveSelectors(definitionNames, context = document) {
  const results = {};

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
 * Get all selector definition names.
 */
function getAllSelectorNames() {
  return Object.keys(selectorRegistry);
}
