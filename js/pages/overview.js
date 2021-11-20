/**
 * Extends the overview page of Die-Ewigen /overview.php
 */
const OverviewExtension = {
  onPageLoad: function(content) {
    let pageContent = content.querySelector('body');
    let infoContentLink = chrome.runtime.getURL("content/info.html");
    fetch(infoContentLink)
        .then((response) => response.text())
        .then((text) =>
        {
          let rows = Tables.createRow('Die Ewigen Extension ' + chrome.runtime.getManifest().version, text);
          let infoTable = Tables.createContentTable(rows);
          pageContent.insertBefore(infoTable, pageContent.childNodes[0]);
        });
  },
};