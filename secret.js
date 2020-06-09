
const SecretExtension = {
  onPageLoad: function(content, deksOpen) {
    this.addDeksIntegration(content, deksOpen);
  },

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

  pushToDeks : function (event) {
    let id = event.target.id;
    let lines = event.target.parentNode.parentNode.parentNode.children;
    let fleet = [];
    for(let i = 2; i <= 11; i++) {
      if(i === 8) {
        continue; //skip Transmitter
      }
      let col = lines[i].children[parseInt(id[1]) + 1];
      fleet.push(parseInt(col.innerText.toString().replace('.', "")))
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

  cleanup : function (content) {
    let deksRows = content.querySelectorAll('.deks');
    deksRows.forEach(value => value.remove());
  }
};