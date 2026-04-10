/**
 * Extends the artefacts page of Die-Ewigen /artefacts.php
 * Prevents accidental merging/destroying of protected artifacts by
 * intercepting the "neues Artefakt erzeugen" link when both selected
 * artifacts are on the user-configured protection list.
 * The protected list is configured on the extension settings page.
 */
const ArtefactsExtension = {

  storageKey: 'artefacts',

  artifacts: [
    'Agsora', 'Artascendus', 'Auctacon', 'Bloroka', 'Troniccelerator',
    'Empala', 'Empdestro', 'Feuroka', 'Geabwus', 'Geangrus', 'Kollimania',
    'Pekasch', 'Pekek', 'Pesara', 'Recadesto', 'Recarion',
    'Sekkollus', 'Tronicar', 'Turak', 'Turla', 'Vakara', 'Waringa'
  ],

  onPageLoad: async function (content) {
    if (content.querySelector('#artefacts-settings-hint')) {
      return;
    }
    this.addSettingsHint(content);
    await this.guardMergeLink(content);
    this.observeMsgarea(content);
  },

  /**
   * Injects a small hint with a link to the extension settings page,
   * placed above the artifact grid.
   * @param {Document} content
   */
  addSettingsHint: function (content) {
    let hint = content.createElement('div');
    hint.id = 'artefacts-settings-hint';
    hint.style.cssText = 'padding: 4px 6px; font-size: 11px; color: #9a9080;';

    let text = content.createTextNode('Artefakt-Schutz: ');
    let link = content.createElement('a');
    link.href = '#';
    link.style.cssText = 'color: #c8b86a;';
    link.innerText = 'Einstellungen öffnen';
    link.addEventListener('click', function (e) {
      e.preventDefault();
      chrome.runtime.sendMessage({ type: 'open-options-page' });
    });

    hint.insertBefore(text, null);
    hint.insertBefore(link, null);

    let cell = content.querySelector('div.cell');
    if (cell) {
      cell.parentNode.insertBefore(hint, cell);
    }
  },

  /**
   * Observes #msgarea for DOM changes caused by the game's ca() function
   * and re-evaluates the merge link guard after each change.
   * A 50ms debounce collapses multiple rapid mutations from a single click.
   * @param {Document} content
   */
  observeMsgarea: function (content) {
    let msgarea = content.querySelector('#msgarea');
    if (!msgarea) {
      return;
    }
    let debounceTimer = null;
    let observer = new MutationObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        ArtefactsExtension.guardMergeLink(content);
      }, 50);
    });
    observer.observe(msgarea, { childList: true, subtree: true, characterData: true });
  },

  /**
   * Returns the names of the currently selected (green-bordered) artifact slots.
   * @param {Document} content
   * @returns {string[]}
   */
  getSelectedArtifactNames: function (content) {
    let names = [];
    content.querySelectorAll('[id^="ac"]').forEach(el => {
      if (el.style.borderColor === 'rgb(0, 255, 0)') {
        let img = el.querySelector('img[alt]');
        if (img && img.alt) {
          names.push(img.alt);
        }
      }
    });
    return names;
  },

  /**
   * Checks the two selected artifacts against the protected list.
   * If both are protected, the merge link is blocked and the msgarea content
   * is replaced with a warning that fits within its fixed 64px height.
   * If the guard was previously active and protection no longer applies,
   * the original msgarea content is restored.
   * @param {Document} content
   */
  guardMergeLink: async function (content) {
    let msgarea = content.querySelector('#msgarea');
    if (!msgarea) {
      return;
    }

    // If our warning is currently displayed, the observer may have fired from
    // our own innerHTML replacement — bail out only if the warning is still present.
    // If ca() already replaced the content, the dataset property is stale; clean it up.
    let warningActive = msgarea.dataset.extOriginalContent !== undefined;
    if (warningActive) {
      if (msgarea.querySelector('span[style*="ff4444"]') !== null) {
        return;
      }
      // ca() replaced our warning with new game content — discard the stale snapshot.
      delete msgarea.dataset.extOriginalContent;
    }

    let mergeLink = msgarea.querySelector('a');
    if (!mergeLink) {
      // No link present — fewer than 2 artifacts selected, nothing to guard.
      return;
    }

    // "Artefakte fusionieren" has no onclick — only block the destructive
    // "neues Artefakt erzeugen" action which carries onclick="return confirm(...)".
    if (!mergeLink.hasAttribute('onclick')) {
      this.clearWarning(msgarea);
      return;
    }

    let stored = await Storage.getConfig(this.storageKey, 'protected');
    let protectedList = Array.isArray(stored) ? stored : [];

    let selectedNames = this.getSelectedArtifactNames(content);
    let anyProtected = selectedNames.length === 2 &&
      (protectedList.includes(selectedNames[0]) ||
       protectedList.includes(selectedNames[1]));

    if (anyProtected) {
      // Save original content and replace with warning that fits the 64px box.
      msgarea.dataset.extOriginalContent = msgarea.innerHTML;
      msgarea.innerHTML =
        '<span style="color: #ff4444; font-weight: bold; line-height: 64px;">' +
        'Verschmelzung blockiert: eins der Artefakte ist gesch\u00fctzt.' +
        '</span>';
    } else {
      this.clearWarning(msgarea);
    }
  },

  /**
   * Restores the original msgarea content if a warning is currently shown.
   * @param {Element} msgarea
   */
  clearWarning: function (msgarea) {
    if (msgarea.dataset.extOriginalContent !== undefined) {
      msgarea.innerHTML = msgarea.dataset.extOriginalContent;
      delete msgarea.dataset.extOriginalContent;
    }
  }
};
