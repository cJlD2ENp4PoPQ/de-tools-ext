/**
 * Extends the secret page of Die-Ewigen /secret.php
 * @type {{addDeksIntegration: SecretExtension.addDeksIntegration, onPageLoad: SecretExtension.onPageLoad, pushToDeks: SecretExtension.pushToDeks, cleanup: SecretExtension.cleanup, createTd: (function(String, String, String): HTMLTableDataCellElement)}}
 */
const SecretExtension = {

  storageKey: 'Secret',
  raceMapping : {'Hornisse':'E','Spider':'K','Caesar':'I','Wespe':'Z'},

  onPageLoad: function(content, deksOpen, mobile) {
    if(!mobile) {
      this.addDeksIntegration(content, deksOpen);
    }
    let tableHeader = content.querySelector('body > div > table > tbody > tr > td');
    if(tableHeader && tableHeader.innerText.includes('Sondenbericht')) {
      let storedProbes = this.storeProbeResult(tableHeader.parentElement.parentElement);
      if(storedProbes.length > 1) {
        let lastProbe = storedProbes[storedProbes.length - 1];
        let previousProbe = storedProbes[storedProbes.length - 2];
        let ticks = Time.getWTAmountBetween(window.server, new Date(previousProbe.c), new Date(lastProbe.c));
        if(ticks < 10 && ticks > 0) {
          let mDiff = lastProbe.m - previousProbe.m;
          let dDiff = lastProbe.d - previousProbe.d;
          let iDiff = lastProbe.i - previousProbe.i;
          let eDiff = lastProbe.e - previousProbe.e;
          if (mDiff > 0 && dDiff > 0 && iDiff > 0 && eDiff > 0) {
            let pointsPerTick = (mDiff / ticks + 2 * dDiff / ticks + 3 * iDiff /  ticks+ 4 * eDiff / ticks) / 10
            let amountOfTicks = Time.getAmountOfTicks(window.server);
            amountOfTicks = amountOfTicks ? amountOfTicks / 2 : 15000 / 2;
            let stepSize;
            if (amountOfTicks < 10000) {
              stepSize = 1000;
            } else if (amountOfTicks < 20000) {
              stepSize = 2000;
            } else {
              stepSize = 5000;
            }
            let lastRow = content.querySelector('tr[class="cell"][align="center"]').previousSibling;
            let parent = lastRow.parentElement;
            let headRow = document.createElement('tr');
            let headline = document.createElement('td');
            headline.setAttribute('colspan',2);
            headline.setAttribute('width','100%');
            headline.classList = ['tc']
            headline.innerHTML = 'Punktehochrechnung (' + ticks + ' WT)'
            headRow.insertBefore(headline, null);
            parent.insertBefore(headRow, lastRow.nextSibling);
            let currentPoints = lastProbe.p + (lastProbe.m + 2 * lastProbe.d + 3 * lastProbe.i + 4 * lastProbe.e) / 10
            let formatter = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0});
            for (let i = amountOfTicks; i >= 0; i = i - stepSize) {
              let tick = Math.ceil(i / 1000) * 1000;
              let row = document.createElement('tr');
              let label = this.createProbeTd('nach ' + tick + ' Ticks');
              let value = this.createProbeTd(formatter.format(tick * Math.round(pointsPerTick) + currentPoints))
              row.insertBefore(label, null);
              row.insertBefore(value, null);
              parent.insertBefore(row, lastRow.nextSibling.nextSibling);
            }
          }
        }
      }
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
   * @return {Object} stored probe result from target.
   */
  storeProbeResult (contentTable) {
    let rows = contentTable.querySelectorAll('tr');
    if(rows && rows.length > 13) {
      let header = rows[0];
      let headerMatcher = header.innerText.match('.*über\\W(\\S+)\\W\\((\\d+):(\\d+)\\).*$');
      if(headerMatcher) {
        let name = headerMatcher[1];
        let sector = headerMatcher[2];
        let sys = headerMatcher[3];
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
          r:race, m:m, d:d, i:i, e:e, t:t, x:sector, y:sys};
        let config = Storage.getConfig(this.storageKey, 'secrets');
        if(config) {
          let player = config[name];
          if(player) {
           let probes = player.probes;
           if(probes) {
             this.displayDiffs(rows, probes, result)
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
        Storage.storeConfig(this.storageKey, 'secrets', config);
        return config[name].probes;
      }
    }
  },

  displayDiffs (rows, probes, currentProbe) {
    if(probes.length > 0) {
      let lastProbe = probes[probes.length -1];
      let formatter = new Intl.NumberFormat(undefined, {
        signDisplay: 'exceptZero'
      });
      rows[0].querySelector('td[colspan="2"][class="tc"]').setAttribute('width','60%')
      rows[0].parentElement.parentElement.setAttribute('width','600px');
      rows[0].insertBefore(this.createProbeTd('Seit: ' + new Date(lastProbe.c).toLocaleString()), null);
      rows[1].insertBefore(this.createProbeTd(formatter.format(currentProbe.p - lastProbe.p)), null);
      rows[2].insertBefore(this.createProbeTd(formatter.format(currentProbe.s - lastProbe.s)), null);
      rows[3].insertBefore(this.createProbeTd(formatter.format(currentProbe.def - lastProbe.def)), null);
      rows[4].insertBefore(this.createProbeTd(formatter.format(currentProbe.b - lastProbe.b)), null);
      rows[5].insertBefore(this.createProbeTd(formatter.format(currentProbe.col - lastProbe.col)), null);
      let mDiff = currentProbe.m - lastProbe.m;
      let dDiff = currentProbe.d - lastProbe.d;
      let iDiff = currentProbe.i - lastProbe.i;
      let eDiff = currentProbe.e - lastProbe.e;
      if(mDiff > 0 && dDiff > 0 && iDiff > 0 && eDiff > 0) {
        let wtAmountBetween = Time.getWTAmountBetween(window.server, new Date(lastProbe.c), new Date(currentProbe.c));
        if(wtAmountBetween < 10 && wtAmountBetween > 0) {
          let sum = mDiff / wtAmountBetween + dDiff * 2 / wtAmountBetween + iDiff * 3 / wtAmountBetween + eDiff * 4 / wtAmountBetween;
          rows[7].insertBefore(this.createProbeTd('Out: ' + formatter.format(sum)), null);
        }
      }
      rows[8].insertBefore(this.createProbeTd(formatter.format(mDiff)), null);
      rows[9].insertBefore(this.createProbeTd(formatter.format(dDiff)), null);
      rows[10].insertBefore(this.createProbeTd(formatter.format(iDiff)), null);
      rows[11].insertBefore(this.createProbeTd(formatter.format(eDiff)), null);
      rows[12].insertBefore(this.createProbeTd(formatter.format(currentProbe.t - lastProbe.t)), null);
    }
  },

  createProbeTd (text) {
    let cell = document.createElement('td');
    cell.classList = ['cc'];
    cell.innerText = text;
    return cell;
  }
};