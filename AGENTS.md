# AGENTS.md — DE-Tools

## Project

DE-Tools is a Manifest V3 browser extension for the German browser game *Die-Ewigen* (die-ewigen.com). It is written in plain ES2020+ JavaScript with no build step, no framework, and no package manager. The source directory is the deployable artifact — it is loaded directly as an unpacked extension or zipped as-is for Chrome Web Store submission.

---

## Full Developer Guide

See [`docs/development.md`](docs/development.md) for:

- Complete architecture and execution model
- Script load order and the bootstrap/dispatch pattern
- All module APIs and naming conventions
- Storage schema and instructions for adding new keys
- CSS injection mechanisms and `web_accessible_resources` rules
- Step-by-step guide for adding a new page module
- Settings page integration
- Known quirks and gotchas
- CI/CD release process

---

## Tech Stack (quick reference)

| Aspect | Detail |
|---|---|
| Manifest | Version 3 (MV3) |
| Language | Plain JavaScript (ES2020+) |
| Framework | None |
| Build tool | None — source is deployed directly |
| Module system | None — all globals via sequential script injection |
| Storage | `chrome.storage.local` via `Storage` utility |
| Permissions | `scripting`, `storage` |
| Target game | die-ewigen.com (servers: xde, sde, rde) |

---

## Critical Rules for AI Agents

1. **No build tools, bundlers, or package managers.** Never create `package.json`, `webpack.config.js`, or any similar file.
2. **No TypeScript.** All code is plain `.js`.
3. **All `Storage` calls must be `await`ed.** `storeConfig`, `getConfig`, and `removeConfig` are all async. Any function that calls `Storage` must be declared `async`. Forgetting `await` causes the next line to receive a `Promise` object instead of the resolved value.
4. **Never use `localStorage` directly.** Always use the `Storage` utility in `js/utils/storage.js`.
5. **Script load order in `manifest.json` is significant.** `js/utils/server.js` must remain the **first** entry in the `js` array — it sets `window.server` before any other script runs. When adding a new utility, insert it after `server.js` but before all page scripts. When adding a new page script, append it at the end of the `js` array.
6. **All page extension objects follow the `{Name}Extension` naming convention** and expose an `async onPageLoad(content)` method where `content` is the inner frame's `Document`.
7. **Use `parent.insertBefore(child, null)` (not `appendChild`)** to match the existing codebase idiom. Both are equivalent but consistency is required.
8. **Storage key casing is significant.** `Secret`, `Trade`, `Vsys` are PascalCase; `ally`, `de`, `overview` are lowercase. Do not change existing key names.
9. **When adding new storage keys**, also update `STORAGE_KEYS`, `CATEGORY_LABELS`, and `CATEGORY_DESCRIPTIONS` in `options/settings.js`. The settings page renders all category cards dynamically — **no changes to `options/settings.html` are needed**.
10. **New assets accessed via `chrome.runtime.getURL()`** must be added to `web_accessible_resources` in `manifest.json`.
11. **CSS added to the inner content frame** must be injected into the inner frame's `<head>` using `content.createElement('link')` and `chrome.runtime.getURL()`. A stylesheet in the outer frame does not apply to elements inside a cross-document iframe.

---

## How to Test Locally

1. Open Chrome and navigate to `chrome://extensions`.
2. Enable "Developer mode" (toggle in the top-right corner).
3. Click "Load unpacked" and select the `DE-Tools` directory.
4. Navigate to one of the game servers: `xde.die-ewigen.com`, `sde.die-ewigen.com`, or `rde.die-ewigen.com`.
5. After making changes to any source file, click the reload button on the extension card in `chrome://extensions`.

---

## Repository Structure (quick reference)

```
js/pages/     — page-specific content scripts (one per game page)
js/utils/     — shared utility modules (server, Storage, fields, Tables, frame, Time, ContextMenu)
options/      — extension settings page (storage reset UI)
css/          — stylesheets injected into game pages
icons/        — extension icons and SVG assets
content/      — static HTML resources (info panel)
manifest.json — extension manifest (entry point for understanding everything)
```
