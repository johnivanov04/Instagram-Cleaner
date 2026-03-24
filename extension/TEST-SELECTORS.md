# Manual Selector Validation Checklist for IG Follow Audit Extension

## Overview
This document provides manual testing steps to validate that DOM selectors work correctly on real Instagram pages. These tests complement the unit tests and ensure selector resilience across Instagram's layout variations.

## Prerequisites
- Extension loaded in Chrome (with DevTools access)
- Local development environment running (`localhost:3000` with the IG Follow Audit app)
- Instagram account logged in

## Quick Start: Reload Extension
1. Open `chrome://extensions`
2. Find "IG Follow Audit Helper"
3. Click the **Reload** button (circular arrow icon)
4. Open an Instagram tab (does not need to reload immediately)

## Test 1: Profile Page - Button Injection

**Objective**: Verify "Mark Completed in IG Audit" button injects correctly on your profile page.

### Steps
1. Reload extension (see "Quick Start" above)
2. Create a test file with sample data:
   ```javascript
   payload = {
     accounts: [
       {
         username: "YOUR_OWN_USERNAME",
         normalizedUsername: "your_own_username",
         category: "not-following-back",
         status: "unfollow"
       }
     ],
     unfollowTargets: ["YOUR_OWN_USERNAME"]
   }
   ```
3. In extension sidebar: Click "Sync" to load test data
4. Visit your own Instagram profile: `https://www.instagram.com/YOUR_USERNAME/`
5. **Expected**: "Mark Completed in IG Audit" button appears in the profile header (below bio area)

### Success Criteria
- ✅ Button visible below user bio (in the `<header>` or `<main>` section)
- ✅ Button is clickable
- ✅ Clicking button marks you as "completed" in the extension sidebar
- ✅ Button disappears after marked completed

### If Button Doesn't Appear
- Check browser console for errors: Press `F12` → Console tab
- Look for `[Selector Health]` logs showing selector resolution
- Expected output: `[Selector Health] Polling started (interval: 6000ms)`
- Check if profile username matches your unfollow targets (case-insensitive)

---

## Test 2: Follower List - Highlighting

**Objective**: Verify that matching accounts are highlighted in the follower/following lists.

### Steps
1. Reload extension
2. Add test data with several follower accounts:
   ```javascript
   payload = {
     accounts: [
       {
         username: "testuser1",
         normalizedUsername: "testuser1",
         category: "not-following-back",
         status: "unfollow"
       },
       {
         username: "testuser2",
         normalizedUsername: "testuser2",
         category: "not-following-back",
         status: "unfollow"
       }
     ]
   }
   ```
3. Sync data using extension sidebar
4. Visit **Followers** list: `https://www.instagram.com/YOUR_USERNAME/followers/`
5. **Expected**: AccountsNamedYes "testuser1" and "testuser2" should have a highlighted outline/background

### Success Criteria
- ✅ Accounts appear with a visible highlight (orange/amber outline or background)
- ✅ Non-matching accounts do NOT have highlight
- ✅ Highlight persists as you scroll (infinite scroll)
- ✅ Highlight appears correctly on both standard and alt layouts

### Fallback Testing: Different List Layouts
Instagram may serve different DOM structures. Test these variations:

**Article-based layout** (modern Instagram):
- Verified if highlighting works with `<article role="presentation">` elements
- Most new IG layouts use this

**List-based layout** (older Instagram or regional variants):
- If Instagram uses `<li>` elements, highlighting should still work
- Fallback selector will activate automatically

Check browser console → look for selector resolution logs if highlighting doesn't work.

---

## Test 3: Username Extraction Fallback

**Objective**: Verify username extraction works via primary and fallback methods.

### Steps
1. Open DevTools: `F12` → Console
2. Navigate to any follower list page
3. Run this command in console:
   ```javascript
   const testElement = document.querySelector('article');
   if (testElement) {
     console.log('Username:', resolveUsernameFromContext(testElement));
   }
   ```
4. **Expected**: Console logs a valid username (e.g., "testuser1")

### If Username Is Empty
- Primary selector `a[href^"/"]` may not have matched
- Fallback to `a[role="link"][href^"/"]` will attempt
- Last resort: Text parsing from element content

---

## Test 4: Selector Health Diagnostics

**Objective**: Verify selector health checks are running and showing correct status.

### Steps
1. Reload extension
2. Open extension sidebar (if not visible, click "IG Audit" button in top-right)
3. Expand **Diagnostics** section (click "Diagnostics" to toggle)
4. You should see:
   - Source: "App sync" or "Cached storage"
   - Last sync: "just now" or relative time
   - Active targets: number of unfollow accounts
5. Scroll down in sidebar to **Selector Health** section (if visible)

### Expected Health Status
- **Profile Header**: `✓ Healthy (primary)` or `✓ Partial (fallback #1)`
- **Highlight**: `✓ Healthy (primary)` or similar
- **Profile Link**: `✓ Healthy (primary)` or similar

If any shows **❌ Failed**:
- Means selector chain could not find any matching elements
- Button injection or highlighting may not work
- This is expected on non-profile/non-follower pages (e.g., home feed)

### Success Criteria
- ✅ Selector Health section appears in Diagnostics
- ✅ At least "healthy" or "partial" status visible on profile/follower pages
- ✅ No "Failed" status on pages where features should work

---

## Test 5: Fallback Activation (Manual DOM Break Test)

**Objective**: Verify that fallback selectors activate when primary selector is unavailable.

### Steps
1. Navigate to your profile page (button should be visible from Test 1)
2. Open DevTools: `F12` → Elements tab
3. Search for and find the `<main>` → `<header>` → `<section>` structure
4. Right-click the `<section>` element and select **Delete Element**
5. **Expected**: Primary selector `main header section` no longer exists, but button should still appear (via fallback)

### Verification
- Button still visible after deletion? → **Fallback is working** ✅
- Button vanished? → Fallback chain may need adjustment ⚠️
- Check console for `[Selector Health]` logs showing which fallback was used

### What This Tests
- Graceful degradation if Instagram's DOM changes
- Fallback chain is actually being used
- System robustness for production use

---

## Test 6: Stale Data Warning

**Objective**: Verify the app sync staleness warning triggers correctly.

### Steps
1. Load extension with app sync active (`localhost:3000` running)
2. Sync once: Click "Sync" button in sidebar
3. **Wait 5 minutes** (or manually advance system time)
4. Refresh the Instagram page
5. **Expected**: Diagnostics panel shows `⚠️ App sync is stale (older than 5m).`

### Success Criteria
- ✅ Warning appears after 5 minutes of last app sync
- ✅ Warning disappears after clicking "Sync" again
- ✅ Helps user understand data freshness

---

## Test 7: Highlighting in Different Follower Count Scenarios

**Objective**: Ensure highlighting works with many followers (performance).

### Steps
1. Create test data with 50+ accounts to highlight
2. Visit a follower list
3. Observe performance: highlighting should not cause lag
4. Scroll down (infinite scroll) → highlighting should apply to newly loaded items

### Success Criteria
- ✅ No browser freezing or lag when scrolling
- ✅ Highlighting applied consistently to new items
- ✅ No memory leaks in console (check DevTools Memory tab)

---

## Browser Console Debugging

### Useful Logs
Watch for these logs in Console (`F12` → Console tab):

**Healthy startup:**
```
[Selector Health] Polling started (interval: 6000ms)
```

**Selector resolution success:**
```
profileHeader resolved via: main header section (healthy)
```

**Selector failure:**
```
[Selector Health] New selector failures detected: ["profileHeader"]
```

### Common Issues & Fixes

| Issue | Expected Log | Fix |
|-------|--------------|-----|
| Button doesn't appear | "profileHeader failed" in console | Reload extension, check username match |
| Highlighting not working | "highlightCandidates failed" in console | Try different Instagram page layout, check if followers are visible |
| Username missing | Empty string from resolveUsernameFromContext | DOM structure may be different; check if profile links exist |
| Stale data warning spam | Frequent "App sync is stale" | Make sure localhost:3000 is running and syncing |

---

## Reporting Issues

If selectors fail after Instagram updates its DOM:

1. **Screenshot the issue** (with DevTools open)
2. **Copy console logs** (`Ctrl+A` in console, copy)
3. **Note the Instagram page type** (profile, followers, following, etc.)
4. **File an issue** with:
   - What failed (button injection, highlighting, etc.)
   - Instagram page URL
   - Console error logs
   - Screenshots

---


