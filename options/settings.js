/**
 * Settings page logic for the Die-Ewigen Extension.
 * Handles per-category and global storage reset via chrome.storage.local.
 */

const STORAGE_KEYS = ['ally', 'Secret', 'Trade', 'Vsys', 'de', 'overview'];

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
 * Load and display the storage size for each category.
 */
function refreshStorageSizes() {
  STORAGE_KEYS.forEach(key => {
    chrome.storage.local.getBytesInUse(key, (bytes) => {
      const el = document.getElementById('size-' + key);
      if (el) {
        el.textContent = bytes > 0 ? formatBytes(bytes) + ' belegt' : 'Leer';
        el.classList.toggle('empty', bytes === 0);
      }
    });
  });
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
 * Reset a single storage category by key.
 * @param {string} key
 */
function resetCategory(key) {
  const labels = {
    ally: 'Allianz-Daten',
    Secret: 'Sonden-Daten',
    Trade: 'Handelsfilter',
    Vsys: 'VS-Systeme',
    de: 'Timer-Einstellungen',
    overview: 'Übersicht',
  };
  const label = labels[key] || key;
  if (!confirm(`"${label}" wirklich zurücksetzen?\nDiese Aktion kann nicht rückgängig gemacht werden.`)) {
    return;
  }
  chrome.storage.local.remove(key, () => {
    if (chrome.runtime.lastError) {
      showStatus('Fehler beim Zurücksetzen von "' + label + '": ' + chrome.runtime.lastError.message, 'error');
      return;
    }
    showStatus('"' + label + '" wurde erfolgreich zurückgesetzt.', 'success');
    refreshStorageSizes();
  });
}

/**
 * Reset all extension storage.
 */
function resetAll() {
  if (!confirm('Alle Erweiterungsdaten wirklich zurücksetzen?\nDiese Aktion kann nicht rückgängig gemacht werden.')) {
    return;
  }
  chrome.storage.local.remove(STORAGE_KEYS, () => {
    if (chrome.runtime.lastError) {
      showStatus('Fehler beim Zurücksetzen: ' + chrome.runtime.lastError.message, 'error');
      return;
    }
    showStatus('Alle Daten wurden erfolgreich zurückgesetzt.', 'success');
    refreshStorageSizes();
  });
}

/**
 * Attach event listeners to all reset buttons.
 */
function initButtons() {
  // Per-category buttons
  document.querySelectorAll('.btn[data-key]').forEach(btn => {
    btn.addEventListener('click', () => resetCategory(btn.dataset.key));
  });

  // Reset-all button
  document.getElementById('btn-reset-all').addEventListener('click', resetAll);
}

// Initialise when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initVersion();
  refreshStorageSizes();
  initButtons();
});
