/**
 * Extends the overview page of Die-Ewigen /overview.php
 */
const OverviewExtension = {
  onPageLoad: async function(content) {
    let isRedesign = content.querySelector('table[width="586"]') === null;
    let infoBoxes = isRedesign ? content.querySelectorAll('table[border="0"][cellpadding="0"][cellspacing="0"]')
        : content.querySelectorAll('table[width="586"]');
    if(infoBoxes.length >= 2) {
        let infoContentLink = chrome.runtime.getURL("content/info.html");
        fetch(infoContentLink)
            .then((response) => response.text())
            .then((text) =>
            {
                let rows = Tables.createRow('Die Ewigen Extension ' + chrome.runtime.getManifest().version, text);
                let infoTable = Tables.createContentTable(rows, isRedesign);
                infoBoxes[0].parentElement.insertBefore(infoTable, infoBoxes[1]);
                const settingsLink = infoTable.querySelector('#de-settings-link');
                if (settingsLink) {
                    settingsLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        chrome.runtime.sendMessage({ type: 'open-options-page' }, (response) => {
                            if (response && response.status && !response.status.startsWith('success')) {
                                alert('Fehler beim öffnen der Einstellungen: ' + response.status + '\n' + (response.error || ''));
                            }
                        });
                    });
                }
            });
    }
    if (await this.isNewRound(content, isRedesign)) {
      await this.cleanupStorage();
    }
  },
  
  getRPs: function(content, isRedesign) {
    if (isRedesign) {
        let tdElements = content.querySelectorAll("div.ov-wert");
        for (let i = 0; i<=tdElements.length;i++) {
            if (tdElements[i].innerText.toLowerCase().includes("rundenpunkte") && tdElements[i].childNodes.length > 1) {
                return parseInt(tdElements[i].childNodes[1].innerText);
            }
        }
    } else {
        let tdElements = content.getElementsByTagName("td");
        for (let i = 0; i<=tdElements.length;i++) {
            if (tdElements[i].innerText==="Rundenpunkte" && tdElements[i+1]) {
                return parseInt(tdElements[i+1].innerText);
            }
        }
    }
    return null;
  },
  
  isNewRound: async function(content, isRedesign) {
    let previousRPs = await Storage.getConfig("overview","previousRPs");
    let currentRPs = this.getRPs(content, isRedesign);
    if (currentRPs != null && currentRPs != previousRPs) {
      await Storage.storeConfig("overview","previousRPs",currentRPs)
      return previousRPs != undefined;
    }
    return false;
  },
  
  cleanupStorage: async function() {
    await Storage.storeConfig("ally","tags",{});
    await Storage.storeConfig("ally","info",{});
    await Storage.storeConfig("Secret","secrets",{});
  }
};  