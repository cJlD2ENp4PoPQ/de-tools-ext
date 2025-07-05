/**
 * Extends the auction/trade page of Die-Ewigen /auction.php
 * @type {{onPageLoad: TradeExtension.onPageLoad, onChange: TradeExtension.onChange, filterDEEntries: TradeExtension.filterDEEntries, addFilter: TradeExtension.addFilter, filterVSEntries: TradeExtension.filterVSEntries, replaceSpacer: TradeExtension.replaceSpacer, storageKey: string}}
 */
const TradeExtension = {

  optionsArticleArti: [
    {id: 'art-arti-disabled', value: 'Deaktiviert'},
    {id: 'art-arti-all', value: 'Nur Artefakte'},
    {id: 'art-agsora', value: 'Agsora'},
    {id: 'art-arta', value: 'Artascendus'},
    {id: 'art-auctacon', value: 'Auctacon'},
    {id: 'art-bloroka', value: 'Bloroka'},
    {id: 'art-tronicator', value: 'Troniccelerator'},
    {id: 'art-empala', value: 'Empala'},
    {id: 'art-empd', value: 'Empdestro'},
    {id: 'art-feuroka', value: 'Feuroka'},
    {id: 'art-geabwus', value: 'Geabwus'},
    {id: 'art-geangrus', value: 'Geangrus'},
    {id: 'art-kollimania', value: 'Kollimania'},
    {id: 'art-pekasch', value: 'Pekasch'},
    {id: 'art-pekek', value: 'Pekek'},
    {id: 'art-pesara', value: 'Pesara'},
    {id: 'art-reca', value: 'Recadesto'},
    {id: 'art-recarion', value: 'Recarion'},
    {id: 'art-sekkollus', value: 'Sekkollus'},
    {id: 'art-tronic', value: 'Tronicar'},
    {id: 'art-turak', value: 'Turak'},
    {id: 'art-turla', value: 'Turla'},
    {id: 'art-vakara', value: 'Vakara'},
    {id: 'art-waringa', value: 'Waringa'},
  ],

  optionsArticleOther: [
    {id: 'art-oth-disabled', value: 'Deaktiviert'},
    {id: 'art-oth-all', value: 'Nur sonstige Waren'},
    {id: 'art-oth-titan', value: '2 Titanen-Energiekern'},
    {id: 'art-oth-palenium', value: '500 Palenium'},
    {id: 'art-oth-tronic', value: '25 Tronic'}
  ],


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
  artArtis: ['Agsora', 'Geabwus', 'Auctacon', 'Artascendus', 'Sekkollus','Pesara','Geangrus','Troniccelerator','Pekasch','Vakara','Empdestro','Recarion','Empala','Turla','Pekek','Tronicar','Feuroka','Bloroka','Recadesto','Turak','Waringa','Kollimania'],
  artOthers: ['2 Titanen-Energiekern', '500 Palenium', '25 Tronic'],

  storageKey: 'Trade',

  onPageLoad: function (content) {
    if (!content.querySelector('#trade-css')) {
      let fieldsCss = content.createElement('link');
      fieldsCss.href = chrome.runtime.getURL('css/fields.css');
      fieldsCss.type = 'text/css';
      fieldsCss.id = 'trade-css';
      fieldsCss.classList = ['ext-css'];
      fieldsCss.rel = 'stylesheet';
      content.getElementsByTagName("head")[0].appendChild(fieldsCss);
      let tradeCss = content.createElement('link');
      tradeCss.classList = ['ext-css'];
      tradeCss.href = chrome.runtime.getURL('css/trade.css');
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
    let articleArtiFilter = Storage.getConfig(this.storageKey, 'article-arti-filter');
    let articleOtherFilter = Storage.getConfig(this.storageKey, 'article-other-filter');
    let selectDe = fields.createSelectField('de-filter', this.optionsDE, this.onChange, deFilter);
    let selectVs = fields.createSelectField('vs-filter', this.optionsVS, this.onChange, vsFilter);
    let selectArti = fields.createSelectField('article-arti-filter', this.optionsArticleArti, this.onChange, articleArtiFilter);
    let selectOther = fields.createSelectField('article-other-filter', this.optionsArticleOther, this.onChange, articleOtherFilter);
    let deField = fields.createField(selectDe);
    let vsField = fields.createField(selectVs);
    let artiField = fields.createField(selectArti);
    let otherField = fields.createField(selectOther);
    let rowRess = fields.createRow([deField, vsField]);
    let rowArticles = fields.createRow([artiField, otherField]);
    let labelRess = content.createElement('span');
    labelRess.classList.add('filter_label');
    labelRess.innerText = 'Währung';
    let labelArticles = content.createElement('span');
    labelArticles.classList.add('filter_label');
    labelArticles.innerText = 'Ware';
    let fieldsetRess = fields.createFieldset('Filter', [labelRess, rowRess, labelArticles, rowArticles]);

    let target = content.querySelector('div');
    let before = content.querySelector('table');
    target.insertBefore(fieldsetRess, before);
    if (deFilter) {
      let option = selectDe.querySelector('#' + deFilter);
      if (option) {
        this.filterDEEntries(deFilter, option.innerText, content);
      }
    }
    if (vsFilter) {
      let option = selectVs.querySelector('#' + vsFilter);
      if (option) {
        this.filterVSEntries(vsFilter, option.innerText, content);
      }
    }
    if (articleArtiFilter) {
      let option = selectArti.querySelector('#' + articleArtiFilter);
      if (option) {
        this.filterArticleArtiEntries(articleArtiFilter, option.innerText, content)
      }
    }
    if (articleOtherFilter) {
      let option = selectOther.querySelector('#' + articleOtherFilter);
      if (option) {
        this.filterArticleArtiEntries(articleOtherFilter, option.innerText, content)
      }
    }
  },

  onChange: function (event) {
    let filterId = event.target.id;
    let ownerDocument = event.target.ownerDocument;
    let selectedOption = event.target.selectedOptions[0];
    if (filterId === 'de-filter') {
      ownerDocument.querySelectorAll('tr.disabled-currency').forEach(tr => {tr.classList.remove('disabled-currency')});
      TradeExtension.filterDEEntries(selectedOption.id, selectedOption.innerText, ownerDocument);
    } else if (filterId === 'vs-filter') {
      ownerDocument.querySelectorAll('tr.disabled-currency').forEach(tr => {tr.classList.remove('disabled-currency')});
      TradeExtension.filterVSEntries(selectedOption.id, selectedOption.innerText, ownerDocument);
    } else if(filterId === 'article-arti-filter') {
      ownerDocument.querySelectorAll('tr.disabled-article').forEach(tr => {tr.classList.remove('disabled-article')});
      TradeExtension.filterArticleArtiEntries(selectedOption.id, selectedOption.innerText, ownerDocument);
    } else if(filterId === 'article-other-filter') {
      ownerDocument.querySelectorAll('tr.disabled-article').forEach(tr => {tr.classList.remove('disabled-article')});
      TradeExtension.filterArticleOtherEntries(selectedOption.id, selectedOption.innerText, ownerDocument);
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
            row.classList.add('disabled-currency');
          }
        } else if (!new RegExp(filterText).test(row.children[1].innerText)) {
          row.classList.add('disabled-currency');
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
            row.classList.add('disabled-currency');
          }
        } else if (!new RegExp(filterText).test(row.children[1].innerText)) {
          row.classList.add('disabled-currency');
        }
      })
    }
  },

  /**
   * Filters the auction page entries by given DE article filter parameter
   * @param {String} filterEntryID
   * @param {String} filterText
   * @param {Document} document
   */
  filterArticleArtiEntries: function (filterEntryID, filterText, document) {
    Storage.storeConfig(TradeExtension.storageKey, 'article-arti-filter', filterEntryID);
    Storage.removeConfig(TradeExtension.storageKey, 'article-other-filter');
    let otherFilter = document.getElementById('article-other-filter');
    otherFilter.value = 'art-oth-disabled';
    let rows = document.querySelectorAll('tr[style="text-align: right; vertical-align: middle;"]');
    if (filterEntryID !== 'art-arti-disabled') {
      rows.forEach(row => {
        if (filterEntryID === 'art-arti-all') {
          if (new RegExp(TradeExtension.artOthers.join("|")).test(row.children[0].innerText)) {
            row.classList.add('disabled-article');
          }
        } else if (!new RegExp(filterText).test(row.children[0].innerText)) {
          row.classList.add('disabled-article');
        }
      })
    }
  },

  /**
   * Filters the auction page entries by given DE article filter parameter
   * @param {String} filterEntryID
   * @param {String} filterText
   * @param {Document} document
   */
  filterArticleOtherEntries: function (filterEntryID, filterText, document) {
    Storage.storeConfig(TradeExtension.storageKey, 'article-other-filter', filterEntryID);
    Storage.removeConfig(TradeExtension.storageKey, 'article-arti-filter');
    let artiFilter = document.getElementById('article-arti-filter');
    artiFilter.value = 'art-arti-disabled';
    let rows = document.querySelectorAll('tr[style="text-align: right; vertical-align: middle;"]');
    if (filterEntryID !== 'art-oth-disabled') {
      rows.forEach(row => {
        if (filterEntryID === 'art-oth-all') {
          if (new RegExp(TradeExtension.artArtis.join("|")).test(row.children[0].innerText)) {
            row.classList.add('disabled-article');
          }
        } else if (!new RegExp(filterText).test(row.children[0].innerText)) {
          row.classList.add('disabled-article');
        }
      })
    }
  }
};