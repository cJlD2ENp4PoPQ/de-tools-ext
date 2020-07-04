const optionsDE = [
  {id:'de-disabled', value:'Deaktiviert'},
  {id:'de-all', value:'Nur DE Resourcen'},
  {id:'de-m', value:'Multiplex'},
  {id:'de-d', value:'Dyharra'},
  {id:'de-i', value:'Iradium'},
  {id:'de-e', value:'Eternium'},
  {id:'de-c', value:'Credits'},
];

const optionsVS = [
  {id:'vs-disabled', value:'Deaktiviert'},
  {id:'vs-all', value:'Nur VS Resourcen'},
  {id:'vs-e', value:'Eisen'},
  {id:'vs-ti', value:'Titan'},
  {id:'vs-m', value:'Mexit'},
  {id:'vs-d', value:'Dulexit'},
  {id:'vs-te', value:'Tekranit'},
  {id:'vs-y', value:'Ylesenium'},
  {id:'vs-sero', value:'Serodium'},
  {id:'vs-r', value:'Rowalganium'},
  {id:'vs-sext', value:'Sextagit'},
  {id:'vs-o', value:'Octagium'},
];

const deRes = ['Multiplex', 'Dyharra', 'Iradium', 'Eternium', 'Credits'];
const vsRes = ['Eisen', 'Titan', 'Mexit', 'Dulexit', 'Tekranit', 'Ylesenium', 'Serodium', 'Rowalganium', 'Sextagit', 'Octagium'];


const TradeExtension = {
  onPageLoad: function(content) {
    if(!content.querySelector('link.ext-css')) {
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

  replaceSpacer : function (content) {
    content.querySelectorAll('table table tr').forEach(tr => {
      if(!tr.getAttribute('style')) {
        tr.remove();
      } else {
        tr.classList.add('trade_entry');
      }
    })
  },

  addFilter : function (content) {
    let selectDe = fields.createSelectField('de-filter', optionsDE, this.onChange);
    let selectVs = fields.createSelectField('vs-filter', optionsVS, this.onChange);
    let deField = fields.createField(selectDe);
    let vsField = fields.createField(selectVs);
    let row = fields.createRow([deField, vsField]);
    let label = content.createElement('span');
    label.classList.add('filter_label');
    label.innerText = 'Währung';
    let fieldset = fields.createFieldset('Filter', [label,row]);

    let target = content.querySelector('div');
    let before = content.querySelector('table');
    target.insertBefore(fieldset, before);
  },

  onChange : function (event) {
    let id = event.target.id;
    let ownerDocument = event.target.ownerDocument;
    let selectedOption = event.target.selectedOptions[0];
    ownerDocument.querySelectorAll('tr.disabled').forEach(tr => tr.classList.remove('disabled'));
    if(id === 'de-filter') {
      let vsFilter = ownerDocument.getElementById('vs-filter');
      vsFilter.value = 'vs-disabled';
      let rows = ownerDocument.querySelectorAll('tr[style="text-align: right; vertical-align: middle;"]');
      if (selectedOption.id !== 'de-disabled') {
        rows.forEach(row => {
          if (selectedOption.id === 'de-all') {
            if (new RegExp(vsRes.join("|")).test(row.children[1].innerText)) {
              row.classList.add('disabled');
            }
          } else if (!new RegExp(selectedOption.innerText).test(row.children[1].innerText)) {
            row.classList.add('disabled');
          }
        })
      }
    } else if (id === 'vs-filter') {
      let deFilter = ownerDocument.getElementById('de-filter');
      deFilter.value = 'de-disabled';
      let rows = ownerDocument.querySelectorAll('tr[style="text-align: right; vertical-align: middle;"]');
      if (selectedOption.id !== 'vs-disabled') {
        rows.forEach(row => {
          if (selectedOption.id === 'vs-all') {
            if (new RegExp(deRes.join("|")).test(row.children[1].innerText)) {
              row.classList.add('disabled');
            }
          } else if (!new RegExp(selectedOption.innerText).test(row.children[1].innerText)) {
            row.classList.add('disabled');
          }
        })
      }
    }
  },
};