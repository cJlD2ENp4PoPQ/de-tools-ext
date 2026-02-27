# DE-Tools Developer Reference

This document is the authoritative technical reference for AI coding agents and human developers working on the DE-Tools browser extension. Every claim here reflects the actual codebase — nothing is invented or inferred beyond what the source files contain.

---

## 1. Project Overview

DE-Tools is a Manifest V3 browser extension for the German browser game *Die-Ewigen* (die-ewigen.com).

**Target servers**: `xde`, `sde`, `rde` — declared in `host_permissions` in `manifest.json`.

**Supported browsers**: Chrome, Firefox (Gecko ID is set in `manifest.json`), and Edge (all Chromium-compatible browsers).

**Zero-dependency**: There is no `npm`, no bundler, no transpiler, and no framework. The source directory is the deployable artifact — it is loaded directly as an unpacked extension or zipped as-is for store submission.

**Language**: Plain ES2020+ JavaScript. No TypeScript.

**Internationalization**: All UI strings are hard-coded German. `_locales/de/messages.json` exists but is currently empty.

---

## 2. Repository Layout

```
DE-Tools/
├── .github/workflows/deploy_chrome_pipeline.yaml  — CI/CD: zips & uploads to Chrome Web Store on git tag push
├── _locales/de/messages.json                       — i18n stub, currently empty
├── banner/                                         — store listing graphics (not loaded by extension)
├── content/info.html                               — info panel HTML injected on overview page (web_accessible_resource)
├── css/
│   ├── fields.css    — fieldset/filter UI styles, race-colored borders
│   ├── sek.css       — color-tag styles (DEAD FILE — never loaded anywhere)
│   ├── time.css      — blinking highlight animation for KT countdown
│   └── trade.css     — hide/show filtered trade rows, trade entry borders
├── docs/             — developer documentation
├── icons/            — extension icons and SVG assets
├── js/
│   ├── pages/
│   │   ├── de.js         — BOOTSTRAP: init, routing, race/server detection, timer switch, menu entries
│   │   ├── sek.js        — sector.php: fleet points, alliance tagging, right-click context menu
│   │   ├── military.js   — military.php: DEKS iframe integration (attacker/defender buttons)
│   │   ├── secret.js     — secret.php: DEKS integration, probe history, point projection
│   │   ├── production.js — production.php: resource key %, support value display
│   │   ├── trade.js      — auction.php: filter UI for resources and artefacts
│   │   ├── news.js       — sysnews.php: agent count estimation
│   │   ├── ally.js       — ally_detail.php: relation status selector, known members list
│   │   ├── overview.js   — overview.php: info panel, new-round detection, storage cleanup
│   │   ├── vsys.js       — map_mobile.php / map_system.php: VS system list persistence, navigation
│   │   └── map.js        — map.php: fleet points on player entries in the full map
│   └── utils/
│       ├── storage.js      — chrome.storage.local wrapper (storeConfig, getConfig, removeConfig)
│       ├── frame.js        — draggable iframe overlay factory (DEKS simulator)
│       ├── fields.js       — UI builder: fieldset, rows, field divs, select elements
│       ├── table.js        — UI builder: game-styled content tables
│       ├── time.js         — tick calculator: WT/KT tick schedules and countdown logic
│       └── ContextMenu.js  — right-click context menu constructor
├── lib/              — empty, reserved for future third-party libraries
├── options/
│   ├── settings.html — extension options page UI (reset storage)
│   ├── settings.js   — options page logic
│   └── settings.css  — options page dark-theme styles
├── manifest.json     — MV3 extension manifest
└── README.md         — user-facing install/usage guide (German)
```

---

## 3. Architecture

### 3.1 Content Script Execution Model

All JS files are injected as a single flat bundle via the `content_scripts` array in `manifest.json`. Key properties:

- `run_at: "document_start"` — scripts are injected before the DOM is parsed.
- `all_frames: true` — scripts run in **both** the outer frame (`dm.php`) and any inner content frames (e.g. `sector.php`, `auction.php`).
- There is no lazy loading and no conditional injection. Every script runs on every matched page load.
- Scripts are evaluated at `document_start`, but the `window.load` listener in `de.js` defers all DOM work until the page is fully ready.

### 3.2 Three Runtime Contexts

A content script can find itself in one of three distinct contexts:

1. **Outer desktop frame (`dm.php`)**: `#iframe_main_container` is present in the DOM. `de.js` sets up the timer, injects navigation entries, and attaches a `load` listener to the container. Whenever the inner frame navigates, this listener calls `updateExtensions(contentDocument)` to dispatch to the appropriate page module.

2. **Inner content frame** (e.g. `sector.php`, `auction.php`): `window.parent` exists and the parent page URL contains `dm.php`. `de.js` handles this path via `onMobilePageLoad()`.

3. **Mobile / standalone** (direct URL load with no parent `dm.php`): `window.parent` exists but the parent URL does **not** contain `dm.php`. `de.js` also handles this via `onMobilePageLoad()`.

**Special case**: `map.php` is detected via `document.title === 'Karte'` inside `de.js`'s `init()` function, before the `#iframe_main_container` check. It is dispatched to `MapExtension.onPageLoad(document)` directly from `init()`.

### 3.3 Bootstrap and Dispatch (`de.js`)

- `de.js` is the sole entry point. It is the **only** module with a top-level `window.addEventListener("load", ...)`.
- All other modules are passive — each declares a global object and waits to be called by `de.js`.
- `updateExtensions(contentDocument)` inspects the currently loaded inner-frame document using DOM selectors (form `action` attributes, title text, etc.) and calls the appropriate `{Name}Extension.onPageLoad(contentDocument)`.
- `onMobilePageLoad(document)` performs the same dispatch using `document.URL.includes(...)` checks for mobile and standalone contexts.

### 3.4 Global Window Variables

Two values are set on `window` by `de.js` during initialization and read by multiple modules:

- `window.race` — the player's race: `'E'` (Eternians), `'I'` (Iridonians), `'K'` (Karthanians), `'Z'` (Zentorianians), or `undefined` if not detected.
- `window.server` — the server subdomain: `'xde'`, `'sde'`, `'rde'`, etc.
- `deksOpen` — declared as a bare assignment in `de.js` (no `let`/`const`/`var`), making it an implicit property on `window`. It is vestigial; the actual open-state check is performed at dispatch time by querying `document.getElementById("ext-iframe")`.

### 3.5 DEKS iframe Communication

The DEKS combat simulator is loaded in a draggable iframe overlay created by `frame.js`. `military.js` and `secret.js` communicate with the DEKS iframe via `window.postMessage`:

```js
iframeElement.contentWindow.postMessage(
  { attack: bool, race: 'E', fleet: [int, int, int, int, int, int, int, int, int] },
  'https://deks.popq.de'
);
```

The fleet array contains 9 integers (ship counts). The Transmitter slot is skipped during construction — index 6 in `military.js` and index 5 in `secret.js`, based on the row indexing of the respective pages.

---

## 4. Script Load Order

All 17 scripts are declared in `manifest.json`'s `content_scripts.js` array. **Order is significant**: utility modules must appear before the page scripts that depend on them.

- `de.js` is first and registers the `window.load` listener. By the time that listener fires, all other scripts in the array are already evaluated and their globals are available.
- When adding a new utility, insert it **before** the page scripts in the array.
- When adding a new page script, **append it to the end** of the array.

| # | File | Role |
|---|---|---|
| 1 | `js/pages/de.js` | Bootstrap; registers `window.load` listener |
| 2 | `js/utils/frame.js` | Declares `frame` (used by `de.js`, `military.js`) |
| 3 | `js/utils/fields.js` | Declares `fields` (used by `trade.js`, `ally.js`) |
| 4 | `js/utils/table.js` | Declares `Tables` (used by `overview.js`) |
| 5 | `js/utils/storage.js` | Declares `Storage` (used by all page modules) |
| 6 | `js/utils/time.js` | Declares `Time` (used by `de.js`, `secret.js`) |
| 7 | `js/utils/ContextMenu.js` | Declares `ContextMenu` (used by `sek.js`) |
| 8 | `js/pages/sek.js` | sector.php module |
| 9 | `js/pages/military.js` | military.php module |
| 10 | `js/pages/secret.js` | secret.php module |
| 11 | `js/pages/production.js` | production.php module |
| 12 | `js/pages/trade.js` | auction.php module |
| 13 | `js/pages/news.js` | sysnews.php module |
| 14 | `js/pages/ally.js` | ally_detail.php module |
| 15 | `js/pages/overview.js` | overview.php module |
| 16 | `js/pages/vsys.js` | map_mobile.php / map_system.php module |
| 17 | `js/pages/map.js` | map.php module |

---

## 5. Module Pattern

### 5.1 Standard Structure

Every module is a plain object literal assigned to a `const`:

```js
const SekExtension = {
  someData: { ... },

  onPageLoad: async function(content) {
    // content is the inner frame's Document object
  },

  helperMethod: async function(...) { ... }
};
```

- No ES modules (`import`/`export`), no `class` syntax, no bundler.
- All modules are global variables sharing one execution context per frame.
- The `onPageLoad(content)` method is the standard entry point. `content` is always a `Document` object representing the inner content frame.

### 5.2 Naming Conventions

- **Page extension objects**: `{PageName}Extension` (PascalCase) — e.g., `SekExtension`, `TradeExtension`, `MilitaryExtension`.
- **Utility objects**: single descriptive name — `Storage`, `Time`, `Tables`, `fields`, `frame`, `ContextMenu`.
- **Storage page-bucket keys**: `Secret`, `Trade`, `Vsys` are PascalCase; `ally`, `de`, `overview` are lowercase. **Case is significant and must match exactly** — `chrome.storage.local` uses these as object keys.
- **CSS classes added by the extension**: `ext-` prefix for structural elements (`ext-css`, `ext-iframe`); descriptive functional names for data elements (`fp-node`, `deks`, `trade_entry`, `disabled-currency`, `disabled-article`).
- **IDs added by the extension**: `ext-iframe`, `ext-iframe-container`, `time_mode_switch`, `menu_deks`.

### 5.3 DOM Manipulation Idiom

The codebase consistently uses `insertBefore(node, null)` rather than `appendChild(node)`. Both are equivalent. New code should follow this existing idiom.

### 5.4 Double-Init Guards

Some modules guard against being called twice on the same document:

- `sek.js`: checks for an existing `td.fp-node` element.
- `trade.js`: checks for an existing `#trade-css` element.

New page modules should include a similar guard if `onPageLoad` could fire more than once on the same document instance.

---

## 6. Storage Layer

### 6.1 API

All persistent state uses the `Storage` utility (`js/utils/storage.js`), which wraps `chrome.storage.local`:

```js
// All three methods are async and return Promises
await Storage.storeConfig(page, key, value)      // write
await Storage.getConfig(page, key, defaultValue)  // read (returns defaultValue if missing)
await Storage.removeConfig(page, key)             // delete key
```

**Critical rule**: Every `Storage` call must be `await`ed. Every function that calls `Storage` must be declared `async`. Forgetting `await` causes the next line to receive a `Promise` object instead of the resolved value.

### 6.2 Data Schema

Data is organized in a two-level namespace: a top-level `page` bucket with named `key`s inside:

```
chrome.storage.local = {
  "ally":     { tags: { [allianceTag]: [{name, x, y, replaced}] },
                info: { [allianceTag]: { relation: 'own'|'friend'|'neutral'|'enemy' } } },
  "Secret":   { secrets: { [playerName]: { probes: [{c, p, s, def, b, col, r, m, d, i, e, t, x, y}] } } },
  "Trade":    { "de-filter": string, "vs-filter": string,
                "article-arti-filter": string, "article-other-filter": string },
  "Vsys":     { syslist: string[] },
  "de":       { time: { battleMode: boolean } },
  "overview": { previousRPs: number }
}
```

Full reference table:

| Page key | Sub-key | Type | Written by | Read by | Purpose |
|---|---|---|---|---|---|
| `ally` | `tags` | `Object<string, [{name,x,y,replaced}]>` | sek.js | sek.js, ally.js, overview.js | Alliance tag → member list |
| `ally` | `info` | `Object<string, {relation: string}>` | ally.js, overview.js | sek.js, ally.js | Alliance tag → relation status |
| `Secret` | `secrets` | `Object<string, {probes: [...]}>` | secret.js | secret.js, overview.js | Probe history per player (max 10) |
| `Trade` | `de-filter` | `string` | trade.js | trade.js | Active DE resource filter option ID |
| `Trade` | `vs-filter` | `string` | trade.js | trade.js | Active VS resource filter option ID |
| `Trade` | `article-arti-filter` | `string` | trade.js | trade.js | Active artefact filter option ID |
| `Trade` | `article-other-filter` | `string` | trade.js | trade.js | Active other-goods filter option ID |
| `Vsys` | `syslist` | `string[]` | vsys.js | vsys.js | Ordered list of visible VS system IDs |
| `de` | `time` | `{battleMode: boolean}` | de.js | de.js | Battle mode toggle state |
| `overview` | `previousRPs` | `number` | overview.js | overview.js | Last-seen round points for new-round detection |

### 6.3 Adding New Storage Keys

When adding a new storage key:

1. Choose an existing page bucket if the data belongs there, or define a new top-level key.
2. Update the table above in `docs/development.md`.
3. Add the key to `STORAGE_KEYS` in `options/settings.js` so the settings page can display and reset it.
4. If it is a new top-level key, add a corresponding `.category-card` block to `options/settings.html`.

---

## 7. CSS Strategy

### 7.1 Three Injection Mechanisms

**Manifest injection** (global, applied on all matched pages): `css/fields.css`, `css/trade.css`, and `css/time.css` are listed in the `content_scripts.css` array in `manifest.json`. These are injected automatically by the browser into every matched page.

**Dynamic `<link>` injection by `de.js`**: `css/time.css` is also injected programmatically as a `<link>` tag into the outer frame's `<head>`. This is intentional — `map.php` loads as a top-level page and is not covered by the `content_scripts` CSS injection mechanism.

**Runtime URL injection into the inner frame**: `trade.js` injects `fields.css` and `trade.css` into the inner content document's `<head>` using `chrome.runtime.getURL()`. This is necessary because CSS must exist in the inner iframe's own document; a stylesheet injected into the outer frame does not apply to elements inside a cross-document iframe.

### 7.2 `web_accessible_resources`

Any file accessed via `chrome.runtime.getURL()` from a content script must be listed in `web_accessible_resources` in `manifest.json`. Currently listed resources:

- `css/fields.css`
- `css/time.css`
- `css/trade.css`
- `icons/icons8-move-50.png`
- `icons/tb_timedata.png`
- `icons/flight.svg`
- `content/info.html`

### 7.3 Dead File

`css/sek.css` exists and defines `.color-tag` styles, but it is **never loaded** by any mechanism. It is not listed in `manifest.json`, not in `web_accessible_resources`, and not dynamically injected anywhere. Do not reference it in new code unless intentionally reviving it.

---

## 8. Utility Module Reference

### `Storage` — `js/utils/storage.js`

`chrome.storage.local` wrapper. All methods are async and Promise-based.

| Method | Signature | Description |
|---|---|---|
| `storeConfig` | `async (page, key, value)` | Write a value to `storage[page][key]` |
| `getConfig` | `async (page, key, defaultValue)` | Read `storage[page][key]`; returns `defaultValue` if absent |
| `removeConfig` | `async (page, key)` | Delete `storage[page][key]` |

---

### `fields` — `js/utils/fields.js`

DOM builder for filter UIs (fieldsets with labeled rows of select elements).

| Method | Signature | Description |
|---|---|---|
| `createFieldset` | `(title, rows[])` | Creates a `<fieldset>` with a `<legend>`; reads `window.race` to apply a race-specific CSS class |
| `createRow` | `(fields[])` | Creates a row container holding one or more field divs |
| `createField` | `(inputElement)` | Wraps an input element in a field div |
| `createSelectField` | `(id, options[], changeListener, preselected)` | Creates a `<select>` with the given options; fires `changeListener` on change |

Note: `createFieldset` reads `window.race` and adds it as a CSS class on the fieldset (e.g., `fieldset-fields Z`). If `window.race` is `undefined`, the fieldset renders without a race-specific border color — this is safe.

---

### `Tables` — `js/utils/table.js`

DOM builder for game-styled content tables.

| Method | Signature | Description |
|---|---|---|
| `createContentTable` | `(rows[])` | Creates a styled `<table>` from an array of row descriptors |
| `createRow` | `(header, text)` | Returns **two** `<tr>` elements: a header row and a value row |

---

### `frame` — `js/utils/frame.js`

Draggable iframe overlay factory for the DEKS combat simulator.

| Method | Signature | Description |
|---|---|---|
| `createIFrame` | `(title, url, type)` | Creates and injects a draggable iframe container; returns the container `div` |
| `closeIframe` | `()` | Removes the iframe from the DOM |

**Warning**: `closeIframe()` hardcodes calls to `MilitaryExtension.cleanup()` and `SecretExtension.cleanup()`. If either of those extension object names is changed, `frame.js` must be updated accordingly.

---

### `Time` — `js/utils/time.js`

Tick clock engine for WT (Wartime) and KT (Kriegszeit) tick schedules.

| Method | Signature | Description |
|---|---|---|
| `startTime` | `()` | Starts the tick countdown interval |
| `stopTime` | `()` | Stops the tick countdown interval |
| `findNextTick` | `(serverTicks, h, m)` | Finds the next scheduled tick given a tick schedule, hour, and minute |
| `getWTAmountBetween` | `(server, from, to)` | Returns the count of WT ticks between two times; returns `-1` if range is inverted, `-2` if more than 100 ticks |
| `getAmountOfTicks` | `(server)` | Returns the total number of ticks for the given server |

---

### `ContextMenu` — `js/utils/ContextMenu.js`

Right-click context menu constructor.

```js
const menu = new ContextMenu(config, ownerDocument);
menu.attach(targetElement);
```

Config is an array of item descriptors:

```js
{
  renderer: string | function,   // label text or function returning a DOM node
  onClick:  function,            // click handler
  disabled: boolean | function,  // disables the item if true or if the function returns true
  style:    object | function    // inline styles for the menu item
}
```

---

## 9. How to Add a New Page Module

Follow these steps in order:

**Step 1**: Create `js/pages/{name}.js` with the standard module structure:

```js
const {Name}Extension = {
  onPageLoad: async function(content) {
    // content is the inner frame's Document
    // Guard against double-init if needed:
    if (content.querySelector('.ext-{name}-init-guard')) return;

    // your implementation
  }
};
```

**Step 2**: Add the script to `manifest.json`'s `content_scripts.js` array, **after all utilities and after all existing page scripts** (append to the end of the list).

**Step 3**: Add a URL `matches` pattern to `content_scripts.matches` in `manifest.json` if the new page is not already covered by an existing pattern.

**Step 4**: Add dispatch to `de.js`'s `updateExtensions(contentDocument)` using a unique DOM selector to detect the page:

```js
if (contentDocument.querySelector('form[action="yourpage.php"]')) {
  YourExtension.onPageLoad(contentDocument);
}
```

**Step 5**: Add dispatch to `de.js`'s `onMobilePageLoad(document)` if the page is also reachable in mobile or standalone mode:

```js
} else if (url.includes('yourpage.php')) {
  YourExtension.onPageLoad(document);
}
```

**Step 6**: If your module stores data, add the storage key to the `STORAGE_KEYS` array in `options/settings.js` and add a corresponding `.category-card` block to `options/settings.html`.

**Step 7**: If your module needs a CSS file, add it to `css/`, list it in `manifest.json`'s `content_scripts.css` array, and add it to `web_accessible_resources` if you will inject it via `chrome.runtime.getURL()`.

---

## 10. Settings / Options Page

- Located in `options/settings.html`, `options/settings.js`, and `options/settings.css`.
- Registered in `manifest.json` as `options_ui.page` with `open_in_tab: true`.
- Accessible via right-click on the extension icon → "Einstellungen", or through the browser's extension management page.
- The `STORAGE_KEYS` array in `settings.js` drives both the per-category size display and the category-level reset buttons.
- Reset per category: `chrome.storage.local.remove(key)`.
- Reset all: `chrome.storage.local.remove(STORAGE_KEYS)`.
- Size display: `chrome.storage.local.getBytesInUse(key, callback)`.

**When adding new storage**: update `STORAGE_KEYS` in `settings.js` AND add a new `.category-card` block to `settings.html`.

---

## 11. Known Quirks and Gotchas

1. **`content` vs `document` in page handlers**: All `onPageLoad(content)` handlers receive the inner frame's `Document` as `content`. Use `content.querySelector(...)` inside handlers. However, `frame.js` and `military.js`'s `pushToDeks` use bare `document.getElementById(...)` intentionally to reach the outer frame's `#ext-iframe`. This works because `document` in the content-script scope refers to the frame where the script was originally injected (the outer `dm.php` frame).

2. **All Storage calls must be `async`/`await`**: `Storage` methods are all Promise-based. Forgetting `await` causes the next line to receive a `Promise` object instead of the resolved value. Any function that calls `Storage` must be declared `async`.

3. **`deksOpen` implicit global**: Declared as bare `deksOpen = false` in `de.js` (no `let`/`const`/`var`) — this creates a property on `window`. It is vestigial; the actual open-state check is done at dispatch time by querying `document.getElementById("ext-iframe")`.

4. **`frame.js` ↔ page module coupling**: `frame.closeIframe()` hardcodes calls to `MilitaryExtension.cleanup()` and `SecretExtension.cleanup()`. If you rename either of those extension objects, you must also update `frame.js`.

5. **`insertBefore(node, null)` idiom**: The entire codebase uses `parent.insertBefore(child, null)` instead of `parent.appendChild(child)`. They are equivalent. New code should follow this convention.

6. **`cde` server tick data bug**: In `time.js`, `wt_ticks.cde['00']` is `[three_steps]` (an array-in-array) instead of `three_steps`. This causes `findNextTick` to misbehave for `cde` at midnight. Do not copy this pattern when adding tick data for other servers.

7. **`sek.css` is dead code**: The file exists and defines `.color-tag` styles, but is never loaded by any mechanism. Do not reference it in new code.

8. **`blockSupportValues` is unimplemented**: `ProductionExtension.blockSupportValues` is defined but never read. It is a placeholder for a planned block-formation support calculation feature.

9. **`content.createElement()` in `trade.js`**: When injecting elements into the inner content frame, `trade.js` calls `content.createElement(...)` where `content` is the inner document. This is intentional — DOM nodes must belong to the document they are being inserted into. Use `content.createElement(...)` when building elements for the inner frame.

10. **`map.js` is dispatched differently**: `MapExtension.onPageLoad(document)` is called directly from `de.js`'s `init()` via a `document.title === 'Karte'` check, not via `updateExtensions()`. This is because `map.php` loads as a top-level page rather than inside an iframe.

11. **Probe history max size**: `secret.js` caps probe history at 10 entries per player using `array.shift()` to remove the oldest entry. The oldest entry is silently dropped when the limit is exceeded.

12. **`getWTAmountBetween` sentinel values**: Returns `-1` if the date range is inverted, `-2` if more than 100 ticks would be counted. Callers must explicitly handle both sentinel values.

13. **Race-colored fieldset borders**: `fields.createFieldset()` reads `window.race` and adds it as a CSS class (e.g., `fieldset-fields Z`). If `window.race` is `undefined` (e.g., on a mobile standalone page before race detection), the fieldset renders without a race-specific border — this is safe but produces a neutral appearance.

---

## 12. CI/CD

- `.github/workflows/deploy_chrome_pipeline.yaml` triggers on any git tag push.
- The workflow zips the following paths: `_locales content css icons js manifest.json options`.
- The zip is uploaded to the Chrome Web Store via the `mnao305/chrome-extension-upload@v5.0.0` action.
- No Firefox release automation exists.

**To release a new version**:

```sh
git tag v0.10.1
git push --tags
```

**When adding new files or directories that should be included in the release**, verify they are covered by the zip step in `.github/workflows/deploy_chrome_pipeline.yaml`. The `docs/` directory is **not** currently included in the zip and does not need to be — it is developer documentation only.
