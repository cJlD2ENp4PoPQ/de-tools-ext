/**
 * Extends the military page of Die-Ewigen /military.php
 * @type {{addDeksIntegration: MilitaryExtension.addDeksIntegration, onPageLoad: MilitaryExtension.onPageLoad, pushToDeks: MilitaryExtension.pushToDeks, cleanup: MilitaryExtension.cleanup, createTd: (function(String, String, String): HTMLTableDataCellElement)}}
 */
const MilitaryExtension = {
  onPageLoad: function(content, deksOpen) {
    this.addDeksIntegration(content, deksOpen);
  },

  /**
   * Add DEKS integration to given document.
   * @param {Document} content the document which contains the fleet scan table.
   * @param {boolean} deksOpen activates the DEKS integration only if DEKS iframe is opened.
   */
  addDeksIntegration : function (content, deksOpen) {
    if(deksOpen) {
      let tbodies = content.getElementsByTagName('tbody');
      if(tbodies.length > 2) {
        let fleetTable = tbodies.item(1);
        let fleetrows = fleetTable.getElementsByTagName('tr');
        let buttonRow = fleetrows.item(fleetrows.length - 1);
        let deksTrAttacker = document.createElement('tr');
        deksTrAttacker.align = 'center';
        deksTrAttacker.classList = ['deks'];
        let headerAtter = document.createElement('td');
        headerAtter.classList = ['c1'];
        headerAtter.innerHTML = 'Kampfsimulator (Atter)';
        deksTrAttacker.insertBefore(headerAtter, null);
        deksTrAttacker.insertBefore(this.createTd(0,'A', 'hinzufügen'), null);
        deksTrAttacker.insertBefore(this.createTd(1,'A', 'hinzufügen'), null);
        deksTrAttacker.insertBefore(this.createTd(2,'A', 'hinzufügen'), null);
        deksTrAttacker.insertBefore(this.createTd(3,'A', 'hinzufügen'), null);
        fleetTable.insertBefore(deksTrAttacker, buttonRow);

        let deksTrDeffer = document.createElement('tr');
        deksTrDeffer.align = 'center';
        deksTrDeffer.classList = ['deks'];
        let headerDeffer = document.createElement('td');
        headerDeffer.classList = ['c1'];
        headerDeffer.innerHTML = 'Kampfsimulator (Deffer)';
        deksTrDeffer.insertBefore(headerDeffer, null);
        deksTrDeffer.insertBefore(this.createTd(0,'D', 'hinzufügen'), null);
        deksTrDeffer.insertBefore(this.createTd(1,'D', 'hinzufügen'), null);
        deksTrDeffer.insertBefore(this.createTd(2,'D', 'hinzufügen'), null);
        deksTrDeffer.insertBefore(this.createTd(3,'D', 'hinzufügen'), null);
        fleetTable.insertBefore(deksTrDeffer, buttonRow);
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
  createTd : function (fleet, idSuffix, value) {
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
    let contentNode = event.target.parentNode.parentNode.parentNode;
    let fleet = [];
    for(let i = 1; i <= 10; i++) {
      if(i === 7) {
        continue; //skip Transmitter
      }
      if(id[1] === '0') {
        let td = contentNode.querySelector('#m' + i + '_0');
        fleet.push(parseInt(td.innerText.toString().split('.').join("")))
      } else {
        let td = contentNode.querySelector('#mn' + i + '_' + id[1]);
        if(td.innerText === '') {
          let fleetInput = contentNode.querySelector('#m' + i + '_' + id[1]);
          fleet.push(parseInt(fleetInput.value.toString().split('.').join("")));
        } else {
          fleet.push(parseInt(td.innerText.toString().split('.').join("")))
        }
      }
    }
    let deksEnabled = document.getElementById('ext-iframe');
    if(deksEnabled) {
      deksEnabled.contentWindow.postMessage({
        attack: id[0] === 'A',
        race: window.race,
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
  }
};