/**
 * Extends the overview page of Die-Ewigen /overview.php
 */
const OverviewExtension = {
  onPageLoad: function(content) {
    let infoBoxes = content.querySelectorAll('table[width="586"]');
    if(infoBoxes.length >= 2) {
        let infoContentLink = chrome.runtime.getURL("content/info.html");
        fetch(infoContentLink)
            .then((response) => response.text())
            .then((text) =>
            {
                let rows = Tables.createRow('Die Ewigen Extension ' + chrome.runtime.getManifest().version, text);
                let infoTable = Tables.createContentTable(rows);
                infoBoxes[0].parentElement.insertBefore(infoTable, infoBoxes[1]);
            });
    }
  },
};