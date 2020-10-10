/**
 * Extends the secret page of Die-Ewigen /secret.php
 * @type {{addDeksIntegration: SecretExtension.addDeksIntegration, onPageLoad: SecretExtension.onPageLoad, pushToDeks: SecretExtension.pushToDeks, cleanup: SecretExtension.cleanup, createTd: (function(String, String, String): HTMLTableDataCellElement)}}
 */
const SecretExtension = {

  storageKey: 'Secret',
  raceMapping : {'Hornisse':'E','Spider':'K','Caesar':'I','Wespe':'Z'},

  onPageLoad: function(content, deksOpen) {
    this.addDeksIntegration(content, deksOpen);
    let tableHeader = content.querySelector('body > div > table > tbody > tr > td');
    if(tableHeader && tableHeader.innerText.includes('Sondenbericht')) {
      this.storeProbeResult(tableHeader.parentElement.parentElement);
    }
  },

  /**
   * Add DEKS integration to given document.
   * @param {Document} content the document which contains the fleet scan table.
   * @param {boolean} deksOpen activates the DEKS integration only if DEKS iframe is opened.
   */
  addDeksIntegration : function (content, deksOpen) {
    if (deksOpen) {
      if (content.evaluate("//b[contains(., 'Flottenaufstellung')]", content, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue) {
        let tbodies = content.getElementsByTagName('tbody');
        if (tbodies.length > 1) {
          let fleetTable = tbodies.item(0);
          let fleetrows = fleetTable.getElementsByTagName('tr');
          let buttonRow = fleetrows.item(fleetrows.length - 1);
          let deksTrAttacker = document.createElement('tr');
          deksTrAttacker.align = 'center';
          deksTrAttacker.classList = ['deks'];
          let headerAtter = document.createElement('td');
          headerAtter.classList = ['c1'];
          headerAtter.innerHTML = 'Kampfsimulator (Atter)';
          deksTrAttacker.insertBefore(headerAtter, null);
          deksTrAttacker.insertBefore(this.createTd(0, 'A', 'hinzufügen'), null);
          deksTrAttacker.insertBefore(this.createTd(1, 'A', 'hinzufügen'), null);
          deksTrAttacker.insertBefore(this.createTd(2, 'A', 'hinzufügen'), null);
          deksTrAttacker.insertBefore(this.createTd(3, 'A', 'hinzufügen'), null);
          fleetTable.insertBefore(deksTrAttacker, buttonRow);

          let deksTrDeffer = document.createElement('tr');
          deksTrDeffer.align = 'center';
          deksTrDeffer.classList = ['deks'];
          let headerDeffer = document.createElement('td');
          headerDeffer.classList = ['c1'];
          headerDeffer.innerHTML = 'Kampfsimulator (Deffer)';
          deksTrDeffer.insertBefore(headerDeffer, null);
          deksTrDeffer.insertBefore(this.createTd(0, 'D', 'hinzufügen'), null);
          deksTrDeffer.insertBefore(this.createTd(1, 'D', 'hinzufügen'), null);
          deksTrDeffer.insertBefore(this.createTd(2, 'D', 'hinzufügen'), null);
          deksTrDeffer.insertBefore(this.createTd(3, 'D', 'hinzufügen'), null);
          fleetTable.insertBefore(deksTrDeffer, buttonRow);
        }
      }
    }
  },

  /**
   * Creates add-to-DEKS button table cell with given parameters.
   * @param {String} fleet the number suffix
   * @param {String} idSuffix fleet att/def type identifier
   * @param {String} value the button label
   * @return {HTMLTableDataCellElement} the cell HTML node with add-to-DEKS button.
   */
  createTd : function(fleet, idSuffix, value) {
    let td = document.createElement('td');
    td.classList = ['cc'];
    td.id = 'deks' + idSuffix + fleet;
    td.value = value;
    let button = document.createElement('input');
    button.type = 'button';
    button.id = idSuffix + fleet;
    button.value = value;
    button.addEventListener('click', this.pushToDeks, true);
    td.insertBefore(button, null);
    return td;
  },

  /**
   * Event listener add fleet to DEKS.
   * @param event the add-to-DEKS button click event
   */
  pushToDeks : function (event) {
    let id = event.target.id;
    let lines = event.target.parentNode.parentNode.parentNode.children;
    let fleet = [];
    for(let i = 2; i <= 11; i++) {
      if(i === 8) {
        continue; //skip Transmitter
      }
      let col = lines[i].children[parseInt(id[1]) + 1];
      fleet.push(parseInt(col.innerText.toString().split('.').join("")))
    }
    let raceKey = lines[2].children[0].innerText;
    let deksEnabled = document.getElementById('ext-iframe');
    if(deksEnabled) {
      deksEnabled.contentWindow.postMessage({
        attack: id[0] === 'A',
        race: SecretExtension.raceMapping[raceKey],
        fleet: fleet
      }, 'https://deks.popq.de');
    }
  },

  /**
   * Remove all extension data from page.
   * @param {Document} content the page content.
   */
  cleanup : function (content) {
    let deksRows = content.querySelectorAll('.deks');
    deksRows.forEach(value => value.remove());
  },

  /**
   * Stores the probe result from given table content.
   * @param {Element} contentTable the table which contains the probe result.
   */
  storeProbeResult (contentTable) {
    let rows = contentTable.querySelectorAll('tr');
    if(rows && rows.length > 13) {
      let header = rows[0];
      let headerMatcher = header.innerText.match('.*über\\W(\\S+)\\W.*$');
      if(headerMatcher) {
        let name = headerMatcher[1];
        let points = parseInt(rows[1].lastElementChild.innerText.toString().split('.').join(""));
        let ships = parseInt(rows[2].lastElementChild.innerText.toString().split('.').join(""));
        let defs = parseInt(rows[3].lastElementChild.innerText.toString().split('.').join(""));
        let builds = parseInt(rows[4].lastElementChild.innerText.toString().split('.').join(""));
        let collectors = parseInt(rows[5].lastElementChild.innerText.toString().split('.').join(""));
        let race = rows[6].lastElementChild.innerText.toString().trim().substr(0,1);
        let m = parseInt(rows[8].lastElementChild.innerText.toString().split('.').join(""));
        let d = parseInt(rows[9].lastElementChild.innerText.toString().split('.').join(""));
        let i = parseInt(rows[10].lastElementChild.innerText.toString().split('.').join(""));
        let e = parseInt(rows[11].lastElementChild.innerText.toString().split('.').join(""));
        let t = parseInt(rows[12].lastElementChild.innerText.toString().split('.').join(""));
        let result = {c:new Date().toISOString(), p: points, s: ships, def: defs, b: builds, col:collectors,
          r:race, m:m, d:d, i:i, e:e, t:t};
        let config = Storage.getConfig(this.storageKey, 'secrets');
        if(config) {
          let player = config[name];
          if(player) {
           let probes = player.probes;
           if(probes) {
             probes.push(result);
           } else {
             player.probes = [result];
           }
          } else {
            player = {probes: [result]};
          }
          config[name] = player;
        } else {
          config = {};
          config[name] = {probes: [result]};
        }
        if(config[name].probes.length > 10) {
          config[name].probes.shift();
        }
        console.log(config[name].probes.length);
        Storage.storeConfig(this.storageKey, 'secrets', config);
      }
    }
  }
};