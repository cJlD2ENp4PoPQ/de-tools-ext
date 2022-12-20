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
    if (this.isNewRound(content)) {
      this.cleanupStorage();
    }
  },
  
  getRPs: function(content) {
    let tdElements = content.getElementsByTagName("td");
    for (let i = 0; i<=tdElements.length;i++) {
      if (tdElements[i].innerText==="Rundenpunkte" && tdElements[i+1]) {
        return parseInt(tdElements[i+1].innerText);
      }
    }
    return null;
  },
  
  isNewRound: function(content) {
    let previousRPs = Storage.getConfig("overview","previousRPs");
    let currentRPs = this.getRPs(content);
    if (currentRPs != null && currentRPs != previousRPs) {
      Storage.storeConfig("overview","previousRPs",currentRPs)
      return previousRPs != undefined;
    }
    return false;
  },
  
  cleanupStorage: function() {
    Storage.storeConfig("ally","tags",{});
    Storage.storeConfig("ally","info",{});
    Storage.storeConfig("Secret","secrets",{});
  }
};  