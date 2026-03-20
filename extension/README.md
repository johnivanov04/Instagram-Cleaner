# IG Follow Audit Helper Extension

Chrome extension that pairs with IG Follow Audit and overlays a helper sidebar on Instagram.

## What It Does

- Syncs accounts marked as "Mark for Unfollow" from the app in real time
- Shows a sidebar on Instagram with targets and progress
- Highlights matching usernames on Instagram pages
- Adds a profile-level button to mark an account as completed in the app
- Supports a manual "Mark Completed" workflow (no auto-unfollow)

## Install (Chrome)

1. Open Chrome and navigate to `chrome://extensions`
2. Enable **Developer mode** (top-right)
3. Click **Load unpacked**
4. Select the `extension` folder in this repo
5. Keep the extension enabled

## Run with the app

1. Start app with `npm run dev`
2. Open the app at `http://localhost:3000`
3. Upload files and mark accounts as **Mark for Unfollow**
4. Open Instagram (`https://www.instagram.com`)
5. Click the **IG Audit** floating button to open the sidebar
6. Use:
   - **Open profile** to jump to a target
   - **Mark Completed** to sync completion back to the app
   - **Open next unfollow target** for quick navigation

## Troubleshooting

- Sidebar not updating: click **Sync** in the extension sidebar while the app tab is open
- No targets visible: verify accounts are marked as **Mark for Unfollow** in the app
- Local dev host mismatch: this extension allows `localhost:3000` and `127.0.0.1:3000`
- Extension not loading: ensure you selected the `extension` folder containing `manifest.json`

## Security and Limits

- This extension does not auto-unfollow
- You manually click actions on Instagram and manually confirm completion
- If Instagram changes its DOM, inline enhancements may need selector updates
