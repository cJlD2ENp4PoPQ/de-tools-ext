/**
 * Extends the auction/trade page of Die-Ewigen /auction.php
 * @type {{onPageLoad: TradeExtension.onPageLoad, onChange: TradeExtension.onChange, filterDEEntries: TradeExtension.filterDEEntries, addFilter: TradeExtension.addFilter, filterVSEntries: TradeExtension.filterVSEntries, replaceSpacer: TradeExtension.replaceSpacer, storageKey: string}}
 */
const TradeExtension = {

  optionsDE: [
    {id: 'de-disabled', value: 'Deaktiviert'},
    {id: 'de-all', value: 'Nur DE Resourcen'},
    {id: 'de-m', value: 'Multiplex'},
    {id: 'de-d', value: 'Dyharra'},
    {id: 'de-i', value: 'Iradium'},
    {id: 'de-e', value: 'Eternium'},
    {id: 'de-c', value: 'Credits'},
  ],

  optionsVS: [
    {id: 'vs-disabled', value: 'Deaktiviert'},
    {id: 'vs-all', value: 'Nur VS Resourcen'},
    {id: 'vs-e', value: 'Eisen'},
    {id: 'vs-ti', value: 'Titan'},
    {id: 'vs-m', value: 'Mexit'},
    {id: 'vs-d', value: 'Dulexit'},
    {id: 'vs-te', value: 'Tekranit'},
    {id: 'vs-y', value: 'Ylesenium'},
    {id: 'vs-sero', value: 'Serodium'},
    {id: 'vs-r', value: 'Rowalganium'},
    {id: 'vs-sext', value: 'Sextagit'},
    {id: 'vs-o', value: 'Octagium'},
  ],
  deRes: ['Multiplex', 'Dyharra', 'Iradium', 'Eternium', 'Credits'],
  vsRes: ['Eisen', 'Titan', 'Mexit', 'Dulexit', 'Tekranit', 'Ylesenium', 'Serodium', 'Rowalganium', 'Sextagit', 'Octagium'],

  storageKey: 'Trade',

  onPageLoad: function (content) {
    if (!content.querySelector('link.ext-css')) {
      let fieldsCss = content.createElement('link');
      fieldsCss.href = chrome.extension.getURL('css/fields.css');
      fieldsCss.type = 'text/css';
      fieldsCss.classList = ['ext-css'];
      fieldsCss.rel = 'stylesheet';
      content.getElementsByTagName("head")[0].appendChild(fieldsCss);
      let tradeCss = content.createElement('link');
      tradeCss.classList = ['ext-css'];
      tradeCss.href = chrome.extension.getURL('css/trade.css');
      tradeCss.type = 'text/css';
      tradeCss.rel = 'stylesheet';
      content.getElementsByTagName("head")[0].appendChild(tradeCss);
      this.replaceSpacer(content);
      this.addFilter(content);
    }
  },

  /**
   * Replace empty table row spacer with CSS spacer.
   * @param {Document} content the document which contains the auction table.
   */
  replaceSpacer: function (content) {
    content.querySelectorAll('table table tr').forEach(tr => {
      if (!tr.getAttribute('style')) {
        tr.remove();
      } else {
        tr.classList.add('trade_entry');
      }
    })
  },

  /**
   * Add filter fields to given document
   * @param {Document} content the document which contains the auction table.
   */
  addFilter: function (content) {
    let deFilter = Storage.getConfig(this.storageKey, 'de-filter');
    let vsFilter = Storage.getConfig(this.storageKey, 'vs-filter');
    let selectDe = fields.createSelectField('de-filter', this.optionsDE, this.onChange, deFilter);
    let selectVs = fields.createSelectField('vs-filter', this.optionsVS, this.onChange, vsFilter);
    let deField = fields.createField(selectDe);
    let vsField = fields.createField(selectVs);
    let row = fields.createRow([deField, vsField]);
    let label = content.createElement('span');
    label.classList.add('filter_label');
    label.innerText = 'Währung';
    let fieldset = fields.createFieldset('Filter', [label, row]);

    let target = content.querySelector('div');
    let before = content.querySelector('table');
    target.insertBefore(fieldset, before);
    if (deFilter) {
      let option = selectDe.querySelector('#' + deFilter);
      this.filterDEEntries(deFilter, option.innerText, content);
    }
    if (vsFilter) {
      let option = selectVs.querySelector('#' + vsFilter);
      this.filterVSEntries(vsFilter, option.innerText, content);
    }
  },

  onChange: function (event) {
    let filterId = event.target.id;
    let ownerDocument = event.target.ownerDocument;
    let selectedOption = event.target.selectedOptions[0];
    ownerDocument.querySelectorAll('tr.disabled').forEach(tr => tr.classList.remove('disabled'));
    if (filterId === 'de-filter') {
      TradeExtension.filterDEEntries(selectedOption.id, selectedOption.innerText, ownerDocument);
    } else if (filterId === 'vs-filter') {
      TradeExtension.filterVSEntries(selectedOption.id, selectedOption.innerText, ownerDocument);
    }
  },

  /**
   * Filters the auction page entries by given VS resource filter parameter
   * @param {String} filterEntryID
   * @param {String} filterText
   * @param {Document} document
   */
  filterVSEntries: function (filterEntryID, filterText, document) {
    Storage.storeConfig(TradeExtension.storageKey, 'vs-filter', filterEntryID);
    Storage.removeConfig(TradeExtension.storageKey, 'de-filter');
    let deFilter = document.getElementById('de-filter');
    deFilter.value = 'de-disabled';
    let rows = document.querySelectorAll('tr[style="text-align: right; vertical-align: middle;"]');
    if (filterEntryID !== 'vs-disabled') {
      rows.forEach(row => {
        if (filterEntryID === 'vs-all') {
          if (new RegExp(TradeExtension.deRes.join("|")).test(row.children[1].innerText)) {
            row.classList.add('disabled');
          }
        } else if (!new RegExp(filterText).test(row.children[1].innerText)) {
          row.classList.add('disabled');
        }
      })
    }
  },

  /**
   * Filters the auction page entries by given DE resource filter parameter
   * @param {String} filterEntryID
   * @param {String} filterText
   * @param {Document} document
   */
  filterDEEntries: function (filterEntryID, filterText, document) {
    Storage.storeConfig(TradeExtension.storageKey, 'de-filter', filterEntryID);
    Storage.removeConfig(TradeExtension.storageKey, 'vs-filter');
    let vsFilter = document.getElementById('vs-filter');
    vsFilter.value = 'vs-disabled';
    let rows = document.querySelectorAll('tr[style="text-align: right; vertical-align: middle;"]');
    if (filterEntryID !== 'de-disabled') {
      rows.forEach(row => {
        if (filterEntryID === 'de-all') {
          if (new RegExp(TradeExtension.vsRes.join("|")).test(row.children[1].innerText)) {
            row.classList.add('disabled');
          }
        } else if (!new RegExp(filterText).test(row.children[1].innerText)) {
          row.classList.add('disabled');
        }
      })
    }
  }
};