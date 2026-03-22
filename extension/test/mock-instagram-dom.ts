/**
 * Mock Instagram DOM structures for testing selector resilience.
 * These fixtures simulate real Instagram layouts with variations.
 */

/**
 * Create a mock Instagram profile page with standard header layout.
 * Simulates the structure where a "Mark Completed" button would be injected.
 */
export function createMockProfilePage(variant: 'standard' | 'minimal' | 'extended' = 'standard'): HTMLElement {
  const container = document.createElement('div');
  
  // Build the DOM structure based on variant
  if (variant === 'standard') {
    container.innerHTML = `
      <main>
        <header>
          <section>
            <div data-testid="profile-info">
              <h2>@testuser</h2>
              <span>Test User</span>
            </div>
          </section>
        </header>
        <article data-testid="profile-feed">
          <div>Post 1</div>
          <div>Post 2</div>
        </article>
      </main>
    `;
  } else if (variant === 'minimal') {
    // Minimal header layout (some Instagram redesigns use this)
    container.innerHTML = `
      <main>
        <div>
          <header>
            <section>
              <div>@testuser</div>
            </section>
          </header>
        </div>
        <article>Post 1</article>
      </main>
    `;
  } else if (variant === 'extended') {
    // Extended header with multiple sections
    container.innerHTML = `
      <main>
        <header>
          <section>
            <div data-testid="profile-header-primary">
              <h2>Extended Header</h2>
            </section>
            <section>
              <span>Stats</span>
            </section>
          </header>
        </header>
        <section data-testid="profile-content">
          <article>Post 1</article>
        </section>
      </main>
    `;
  }

  return container;
}

/**
 * Create a mock Instagram follower list page.
 * Simulates the structure used for highlighting matching accounts.
 */
export function createMockFollowerList(variant: 'article' | 'li' | 'rich' = 'article'): HTMLElement {
  const container = document.createElement('div');

  if (variant === 'article') {
    // Modern Instagram layout with article elements
    container.innerHTML = `
      <div>
        <article role="presentation">
          <div>
            <a href="/user1"><img alt="user1" /></a>
            <span>user1</span>
          </div>
          <button>Follow</button>
        </article>
        <article role="presentation">
          <div>
            <a href="/user2"><img alt="user2" /></a>
            <span>user2</span>
          </div>
          <button>Follow</button>
        </article>
        <article role="presentation">
          <div>
            <a href="/user3"><img alt="user3" /></a>
            <span>user3</span>
          </div>
          <button>Follow</button>
        </article>
      </div>
    `;
  } else if (variant === 'li') {
    // Older Instagram layout with list items
    container.innerHTML = `
      <ul>
        <li>
          <a href="/user1">user1</a>
          <button>Follow</button>
        </li>
        <li>
          <a href="/user2">user2</a>
          <button>Follow</button>
        </li>
        <li>
          <a href="/user3">user3</a>
          <button>Follow</button>
        </li>
      </ul>
    `;
  } else if (variant === 'rich') {
    // Rich structure with data attributes
    container.innerHTML = `
      <div data-testid="follower-list" role="list">
        <div role="listitem" data-testid="profile-card-1">
          <a href="/user1" role="link"><img alt="user1" /></a>
          <span>user1</span>
        </div>
        <div role="listitem" data-testid="profile-card-2">
          <a href="/user2" role="link"><img alt="user2" /></a>
          <span>user2</span>
        </div>
        <div role="listitem" data-testid="profile-card-3">
          <a href="/user3" role="link"><img alt="user3" /></a>
          <span>user3</span>
        </div>
      </div>
    `;
  }

  return container;
}

/**
 * Create a mock Instagram following list page.
 * Similar to follower list but for the accounts a user follows.
 */
export function createMockFollowingList(variant: 'article' | 'li' = 'article'): HTMLElement {
  const container = document.createElement('div');

  if (variant === 'article') {
    container.innerHTML = `
      <div>
        <article role="presentation">
          <div><a href="/following1">following1</a></div>
          <button>Following</button>
        </article>
        <article role="presentation">
          <div><a href="/following2">following2</a></div>
          <button>Following</button>
        </article>
      </div>
    `;
  } else {
    container.innerHTML = `
      <ul>
        <li><a href="/following1">following1</a></li>
        <li><a href="/following2">following2</a></li>
      </ul>
    `;
  }

  return container;
}

/**
 * Create a mock element with profile links for username extraction testing.
 */
export function createMockProfileLinkContainer(): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = `
    <div>
      <a href="/testuser">testuser</a>
      <span>Test User</span>
    </div>
  `;
  return container;
}

/**
 * Create a broken mock page (missing critical selectors).
 * Used to test fallback chains and failure handling.
 */
export function createBrokenMockProfilePage(): HTMLElement {
  const container = document.createElement('div');
  
  // Intentionally structured differently to break typical selectors
  container.innerHTML = `
    <div id="app">
      <div class="profile-wrapper">
        <div class="profile-header-custom">
          <h1>@testuser</h1>
        </div>
        <div class="feed">
          <div>Post 1</div>
        </div>
      </div>
    </div>
  `;

  return container;
}

/**
 * Get all available mock page variants for comprehensive testing.
 */
export function getAllMockVariants(): Record<string, () => HTMLElement> {
  return {
    profileStandard: () => createMockProfilePage('standard'),
    profileMinimal: () => createMockProfilePage('minimal'),
    profileExtended: () => createMockProfilePage('extended'),
    followerListArticle: () => createMockFollowerList('article'),
    followerListLi: () => createMockFollowerList('li'),
    followerListRich: () => createMockFollowerList('rich'),
    followingListArticle: () => createMockFollowingList('article'),
    followingListLi: () => createMockFollowingList('li'),
    profileLinkContainer: () => createMockProfileLinkContainer(),
    brokenProfile: () => createBrokenMockProfilePage(),
  };
}
