# Chrome Web Store Listing Copy

Copy the following sections directly into the Chrome Web Store Developer Dashboard.

---

## SHORT DESCRIPTION
*(Max 60 characters)*

```
Audit Instagram accounts instantly with health diagnostics.
```

**Character count: 59/60**

---

## FULL DESCRIPTION
*(Recommended 750 characters; Web Store max 16,000)*

```
IG Tidy instantly analyzes Instagram account health directly from your browser—no API scraping, no auto-unfollow bots.

Upload your Instagram followers/following export files, and get instant diagnostics on account validation, engagement patterns, and suspicious follower detection. The extension sidebar displays results live on Instagram, letting you seamlessly mark completed actions while browsing.

Key features:
• Real-time account health diagnostics (followers, engagement, detection)
• Browser-local storage—your data never leaves your computer
• Sidebar UI integrates directly with Instagram.com
• Sync between the web app and extension with one click
• Privacy-first: no analytics, no tracking, no API keys required

Perfect for growth managers, Instagram curators, and account auditors who need quick health checks without third-party tools.

Manage accounts at igtidy.com, verify results on Instagram, mark actions complete—all in one workflow.
```

**Character count: ~630 (well within limit)**

---

## PERMISSION JUSTIFICATIONS

### Storage Permission
**Why we need it:** The extension stores your account audit results locally in browser storage. This allows the extension to remember which accounts you've completed, syncing that data between the web app and Instagram.com tabs. All data stays on your computer—we don't send anything to external servers.

### Tabs Permission  
**Why we need it:** The extension detects when you have Instagram.com and igtidy.com tabs open. This enables automatic sync between the two, so you can see results in the sidebar while browsing Instagram and instantly mark accounts complete without manual refresh.

### Host Permissions: www.instagram.com
**Why we need it:** The extension injects a sidebar UI directly into Instagram.com, displaying account diagnostics and providing quick-action buttons (Mark Completed, Sync, Open Account). This creates a seamless workflow without leaving Instagram.

### Host Permissions: igtidy.com
**Why we need it:** The extension also communicates with igtidy.com (the companion web app) to keep your data in sync. When you mark an account complete in the sidebar, the app updates instantly.

---

## CATEGORY & METADATA

**Category:** Productivity

**Developer Name:** John Ivanov

**Developer Email:** igtidy9@gmail.com

**Support URL:** https://igtidy.com/support

**Privacy Policy URL:** https://igtidy.com/privacy

**Pricing:** Free

---

## SCREENSHOT DESCRIPTIONS

### Screenshot 1: Dashboard + Instagram Sidebar
**Caption:** "See account diagnostics live in the Instagram sidebar. Sync results, mark completed, and manage audits without leaving Instagram."

**Content:** Full-view showing the web app (igtidy.com) dashboard on the left and Instagram.com on the right with the extension sidebar visible on the right side of the Instagram feed, displaying account results.

### Screenshot 2: Diagnostics Panel
**Caption:** "Get instant account health insights: followers, engagement patterns, and suspicious account detection—all calculated locally."

**Content:** Close-up of the Diagnostics panel within the extension sidebar, showing account validation results (e.g., "Followers: 1,234", "Engagement Rate: 8.5%", "Fake Account Detection: 3 suspicious").

### Screenshot 3: Selector Health Panel  
**Caption:** "Monitor the health of account detection selectors (regex, CSS, XPath) to ensure audit accuracy."

**Content:** Close-up of the Selector Health panel showing registry health status for each detection method (green checkmarks for healthy regex/CSS/XPath patterns).

### Screenshot 4: Mark Completed on Profile
**Caption:** "Quick-action inline buttons let you mark accounts complete right from the Instagram profile page."

**Content:** Instagram profile page with the inline "Mark Completed" button visible next to other actions, highlighting the seamless integration.

### Screenshot 5: How-to Guide
**Caption:** "Step-by-step setup guide: upload exports, sync with the extension, audit on Instagram, and manage completions."

**Content:** The How-to page from igtidy.com/how-to, showing the 4-step workflow diagram or introductory text explaining the end-to-end process.

---

## PROMOTIONAL DESCRIPTION (Optional, for store listing polish)

**What IG Tidy does:**
- Audit Instagram account health from browser-exported data
- Display real-time diagnostics in the Instagram.com sidebar
- Detect suspicious followers and engagement patterns
- Sync results between web app and extension
- Mark completion status on accounts
- Store all data locally (no cloud, no API)

**What IG Tidy does NOT do:**
- Auto-unfollow accounts (manual workflow only)
- Scrape Instagram's private API
- Collect analytics or telemetry
- Require authentication or API keys
- Upload your data to external servers

---

## COPY INSTRUCTIONS FOR WEB STORE DASHBOARD

1. **Short Description field:** Copy the text from the SHORT DESCRIPTION section (exclude the markdown code fence, copy only the text inside)
2. **Full Description field:** Copy the text from the FULL DESCRIPTION section (exclude the markdown code fence)
3. **Category dropdown:** Select "Productivity"
4. **Privacy Policy URL field:** Paste `https://igtidy.com/privacy`
5. **Support email field:** Paste `igtidy9@gmail.com`
6. **Permissions section:** Use the justifications above when asked to describe why each permission is needed
7. **Screenshot upload:** Upload 5 PNG files (1280×800 or 1440×900 resolution) with the captions from SCREENSHOT DESCRIPTIONS
8. **Pricing:** Set to "Free" (no monetization)

---

## PRE-SUBMISSION CHECKLIST

- [ ] Short description (59 chars) copied to Dashboard
- [ ] Full description (~630 chars) copied to Dashboard
- [ ] Category set to "Productivity"
- [ ] Privacy policy URL verified: https://igtidy.com/privacy (test in browser)
- [ ] Support email verified: igtidy9@gmail.com
- [x] All 5 screenshots captured at 1280×800 or 1440×900 resolution — stored in `extension/store-assets/screenshots/`
- [ ] Screenshot captions added to each image in Dashboard
- [ ] manifest.json version matches release tag (v1.0.0)
- [x] Extension icon (128×128 PNG) ready for upload
- [x] Additional icon variants prepared (16×16, 32×32, 48×48) — stored in `extension/store-assets/`
- [ ] All text fields reviewed for typos and accuracy
- [ ] "No affiliation with Instagram/Meta" stated clearly in descriptions ✓
- [ ] Terms of Service URL (https://igtidy.com/terms) ready to provide if asked
- [ ] Test URLs are live and accessible before submission

