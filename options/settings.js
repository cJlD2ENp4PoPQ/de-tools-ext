/**
 * Settings page logic for the Die-Ewigen Extension.
 * Handles per-server, per-category and global storage reset via chrome.storage.local.
 *
 * Storage keys follow the scheme "<server>:<page>", e.g. "xde:ally", "sde:Secret".
 * The settings page reads all keys from chrome.storage.local, groups them by server,
 * and renders one section per server dynamically.
 */

/** All known page bucket names (used for labels). */
const STORAGE_KEYS = ['ally', 'Secret', 'Trade', 'Vsys', 'de', 'overview', 'artefacts'];

/** All artifact names, kept in sync with ArtefactsExtension.artifacts. */
const ARTEFACT_NAMES = [
  'Agsora', 'Artascendus', 'Auctacon', 'Bloroka', 'Troniccelerator',
  'Empala', 'Empdestro', 'Feuroka', 'Geabwus', 'Geangrus', 'Kollimania',
  'Pekasch', 'Pekek', 'Pesara', 'Recadesto', 'Recarion',
  'Sekkollus', 'Tronicar', 'Turak', 'Turla', 'Vakara', 'Waringa'
];

/** Human-readable labels for each page bucket. */
const CATEGORY_LABELS = {
  ally:      'Allianz-Daten',
  Secret:    'Sonden-Daten',
  Trade:     'Handelsfilter',
  Vsys:      'VS-Systeme',
  de:        'Timer-Einstellungen',
  overview:  'Übersicht',
  artefacts: 'Artefakt-Schutz',
};

/** Short descriptions for each page bucket. */
const CATEGORY_DESCRIPTIONS = {
  ally:      'Gespeicherte Allianztags und Beziehungsstatus.',
  Secret:    'Gespeicherte Sondenberichte und Verlaufsdaten.',
  Trade:     'Gespeicherte Filtereinstellungen der Auktionsseite.',
  Vsys:      'Gespeicherte Liste der vergessenen Systeme.',
  de:        'Kampfmodus-Schalterstellung.',
  overview:  'Gespeicherte Rundenpunkte für Rundenerkennnung.',
  artefacts: 'Geschützte Artefakte (Verschmelzungsschutz).',
};

/**
 * Display the extension version in the header.
 */
function initVersion() {
  const manifest = chrome.runtime.getManifest();
  document.getElementById('version').textContent = 'v' + manifest.version;
}

/**
 * Format bytes to a human-readable string.
 * @param {number} bytes
 * @returns {string}
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  if (bytes < 1024) return bytes + ' Bytes';
  return (bytes / 1024).toFixed(1) + ' KB';
}

/**
 * Show a status message in the status bar.
 * @param {string} message
 * @param {'success'|'error'} type
 */
function showStatus(message, type = 'success') {
  const bar = document.getElementById('status-bar');
  bar.textContent = message;
  bar.className = 'status-bar visible ' + type;
  clearTimeout(bar._hideTimeout);
  bar._hideTimeout = setTimeout(() => {
    bar.className = 'status-bar';
  }, 3500);
}

/**
 * Read all chrome.storage.local keys and group them by server.
 * Returns a Promise resolving to a map: { server: [page, ...] }
 * Only includes keys that match the "<server>:<page>" pattern.
 * @returns {Promise<Object>}
 */
function loadServerMap() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(null, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }
      const map = {};
      for (const key of Object.keys(result)) {
        const colonIdx = key.indexOf(':');
        if (colonIdx === -1) continue; // skip legacy / unknown keys
        const server = key.substring(0, colonIdx);
        const page = key.substring(colonIdx + 1);
        if (!map[server]) map[server] = [];
        map[server].push(page);
      }
      resolve(map);
    });
  });
}

/**
 * Get the byte count for a fully-qualified storage key ("server:page").
 * @param {string} fullKey
 * @returns {Promise<number>}
 */
function getBytesInUse(fullKey) {
  return new Promise((resolve) => {
    chrome.storage.local.getBytesInUse(fullKey, (bytes) => {
      resolve(chrome.runtime.lastError ? 0 : bytes);
    });
  });
}

/**
 * Update the size indicator element for a single server:page key.
 * @param {string} server
 * @param {string} page
 */
function refreshSize(server, page) {
  const fullKey = server + ':' + page;
  getBytesInUse(fullKey).then((bytes) => {
    const el = document.getElementById('size-' + fullKey);
    if (el) {
      el.textContent = bytes > 0 ? formatBytes(bytes) + ' belegt' : 'Leer';
      el.classList.toggle('empty', bytes === 0);
    }
  });
}

/**
 * Reset a single storage category for a given server.
 * @param {string} server
 * @param {string} page
 */
function resetCategory(server, page) {
  const label = CATEGORY_LABELS[page] || page;
  const fullKey = server + ':' + page;
  if (!confirm(`"${label}" für Server "${server}" wirklich zurücksetzen?\nDiese Aktion kann nicht rückgängig gemacht werden.`)) {
    return;
  }
  chrome.storage.local.remove(fullKey, () => {
    if (chrome.runtime.lastError) {
      showStatus('Fehler beim Zurücksetzen von "' + label + '" (' + server + '): ' + chrome.runtime.lastError.message, 'error');
      return;
    }
    showStatus('"' + label + '" für Server "' + server + '" wurde zurückgesetzt.', 'success');
    // Re-render to reflect the removed key
    renderPage();
  });
}

/**
 * Reset all storage data for a given server.
 * @param {string} server
 * @param {string[]} pages  list of page bucket names present for this server
 */
function resetServer(server, pages) {
  if (!confirm(`Alle Daten für Server "${server}" wirklich zurücksetzen?\nDiese Aktion kann nicht rückgängig gemacht werden.`)) {
    return;
  }
  const fullKeys = pages.map(p => server + ':' + p);
  chrome.storage.local.remove(fullKeys, () => {
    if (chrome.runtime.lastError) {
      showStatus('Fehler beim Zurücksetzen von "' + server + '": ' + chrome.runtime.lastError.message, 'error');
      return;
    }
    showStatus('Alle Daten für Server "' + server + '" wurden zurückgesetzt.', 'success');
    renderPage();
  });
}

/**
 * Reset all extension storage (all servers, all keys).
 */
function resetAll() {
  if (!confirm('Alle Erweiterungsdaten wirklich zurücksetzen?\nDiese Aktion kann nicht rückgängig gemacht werden.')) {
    return;
  }
  chrome.storage.local.get(null, (result) => {
    if (chrome.runtime.lastError) {
      showStatus('Fehler: ' + chrome.runtime.lastError.message, 'error');
      return;
    }
    // Only remove keys that follow our "server:page" scheme
    const keysToRemove = Object.keys(result).filter(k => k.indexOf(':') !== -1);
    if (keysToRemove.length === 0) {
      showStatus('Keine Daten vorhanden.', 'success');
      return;
    }
    chrome.storage.local.remove(keysToRemove, () => {
      if (chrome.runtime.lastError) {
        showStatus('Fehler beim Zurücksetzen: ' + chrome.runtime.lastError.message, 'error');
        return;
      }
      showStatus('Alle Daten wurden erfolgreich zurückgesetzt.', 'success');
      renderPage();
    });
  });
}

/**
 * Build and inject the per-server sections into #server-sections.
 * @param {Object} serverMap  { server: [page, ...] }
 */
function renderServerSections(serverMap) {
  const container = document.getElementById('server-sections');
  container.innerHTML = '';

  const servers = Object.keys(serverMap).sort();

  if (servers.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'description empty-state';
    empty.textContent = 'Keine gespeicherten Daten vorhanden.';
    container.insertBefore(empty, null);
    return;
  }

  for (const server of servers) {
    const pages = serverMap[server];

    // Section wrapper
    const section = document.createElement('section');
    section.className = 'section server-section';
    section.dataset.server = server;

    // Heading row with server name + "reset all for server" button
    const heading = document.createElement('div');
    heading.className = 'server-heading';

    const h2 = document.createElement('h2');
    h2.textContent = server;
    heading.insertBefore(h2, null);

    const resetServerBtn = document.createElement('button');
    resetServerBtn.className = 'btn btn-danger btn-server-reset';
    resetServerBtn.textContent = 'Alle ' + server + '-Daten zurücksetzen';
    resetServerBtn.addEventListener('click', () => resetServer(server, pages));
    heading.insertBefore(resetServerBtn, null);

    section.insertBefore(heading, null);

    // Category grid
    const grid = document.createElement('div');
    grid.className = 'category-grid';

    // Sort pages in the canonical STORAGE_KEYS order, then any unknown ones after
    const sortedPages = [
      ...STORAGE_KEYS.filter(p => pages.includes(p)),
      ...pages.filter(p => !STORAGE_KEYS.includes(p)).sort(),
    ];

    for (const page of sortedPages) {
      const fullKey = server + ':' + page;
      const label = CATEGORY_LABELS[page] || page;
      const description = CATEGORY_DESCRIPTIONS[page] || '';

      const card = document.createElement('div');
      card.className = 'category-card';

      const info = document.createElement('div');
      info.className = 'card-info';

      const strong = document.createElement('strong');
      strong.textContent = label;
      info.insertBefore(strong, null);

      const sub = document.createElement('span');
      sub.className = 'sublabel';
      sub.textContent = description;
      info.insertBefore(sub, null);

      const size = document.createElement('span');
      size.className = 'storage-size';
      size.id = 'size-' + fullKey;
      size.textContent = '…';
      info.insertBefore(size, null);

      const btn = document.createElement('button');
      btn.className = 'btn btn-warning';
      btn.textContent = 'Zurücksetzen';
      btn.addEventListener('click', () => resetCategory(server, page));

      card.insertBefore(info, null);
      card.insertBefore(btn, null);
      grid.insertBefore(card, null);
    }

    section.insertBefore(grid, null);
    container.insertBefore(section, null);

    // Kick off async size reads after DOM is in place
    for (const page of pages) {
      refreshSize(server, page);
    }
  }
}

/**
 * Read all chrome.storage.local keys, find every "server:artefacts" bucket,
 * and render one checkbox block per server into #artefacts-protection-section.
 * Checkboxes auto-save on toggle.
 */
function renderArtefactsProtection() {
  const container = document.getElementById('artefacts-protection-section');
  if (!container) return;
  container.innerHTML = '';

  chrome.storage.local.get(null, (result) => {
    if (chrome.runtime.lastError) {
      showStatus('Fehler beim Laden der Artefakt-Daten: ' + chrome.runtime.lastError.message, 'error');
      return;
    }

    // Collect all servers that have (or could have) an artefacts bucket.
    // We render a block for every server found anywhere in storage so the
    // user can pre-configure protection before visiting artefacts.php.
    const servers = [];
    for (const key of Object.keys(result)) {
      const colonIdx = key.indexOf(':');
      if (colonIdx === -1) continue;
      const server = key.substring(0, colonIdx);
      if (!servers.includes(server)) servers.push(server);
    }
    servers.sort();

    if (servers.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'description empty-state';
      empty.textContent = 'Keine Serverdaten vorhanden. Bitte zuerst das Spiel aufrufen.';
      container.insertBefore(empty, null);
      return;
    }

    for (const server of servers) {
      const fullKey = server + ':artefacts';
      const bucket = result[fullKey] || {};
      const protectedList = Array.isArray(bucket.protected) ? bucket.protected : [];

      const block = document.createElement('div');
      block.className = 'artefacts-server-block';

      const heading = document.createElement('h3');
      heading.className = 'artefacts-server-heading';
      heading.textContent = server;
      block.insertBefore(heading, null);

      const grid = document.createElement('div');
      grid.className = 'artefacts-checkbox-grid';

      for (const name of ARTEFACT_NAMES) {
        const label = document.createElement('label');
        label.className = 'artefacts-checkbox-label';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = name;
        checkbox.checked = protectedList.includes(name);
        checkbox.dataset.server = server;
        checkbox.addEventListener('change', onArtefactCheckboxChange);

        const span = document.createElement('span');
        span.textContent = name;

        label.insertBefore(checkbox, null);
        label.insertBefore(span, null);
        grid.insertBefore(label, null);
      }

      block.insertBefore(grid, null);
      container.insertBefore(block, null);
    }
  });
}

/**
 * Auto-save handler for artifact protection checkboxes.
 * Reads all checkboxes for the same server and persists the result.
 * @param {Event} event
 */
function onArtefactCheckboxChange(event) {
  const server = event.target.dataset.server;
  const allCheckboxes = document.querySelectorAll(
    '.artefacts-checkbox-label input[type="checkbox"][data-server="' + server + '"]'
  );
  const selected = Array.from(allCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  const fullKey = server + ':artefacts';
  chrome.storage.local.get(fullKey, (result) => {
    if (chrome.runtime.lastError) {
      showStatus('Fehler beim Speichern: ' + chrome.runtime.lastError.message, 'error');
      return;
    }
    const bucket = result[fullKey] || {};
    bucket.protected = selected;
    chrome.storage.local.set({ [fullKey]: bucket }, () => {
      if (chrome.runtime.lastError) {
        showStatus('Fehler beim Speichern: ' + chrome.runtime.lastError.message, 'error');
        return;
      }
      showStatus('Artefakt-Schutz für "' + server + '" gespeichert.', 'success');
    });
  });
}

/**
 * Load storage state and (re-)render the full settings page body.
 */
function renderPage() {
  loadServerMap().then((serverMap) => {
    renderServerSections(serverMap);
  }).catch((err) => {
    showStatus('Fehler beim Laden der Speicherdaten: ' + err.message, 'error');
  });
}

/**
 * Attach the global reset-all button listener.
 */
function initButtons() {
  document.getElementById('btn-reset-all').addEventListener('click', resetAll);
}

// Initialise when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initVersion();
  initButtons();
  renderPage();
  renderArtefactsProtection();
});
