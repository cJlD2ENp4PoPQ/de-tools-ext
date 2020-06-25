const optionsDE = [
  {id:'de-disabled', value:'Deaktiviert'},
  {id:'de-all', value:'Nur DE Resourcen'},
  {id:'de-m', value:'Multiplex'},
  {id:'de-d', value:'Dyharra'},
  {id:'de-i', value:'Iradium'},
  {id:'de-e', value:'Eternium'},
  {id:'de-c', value:'Credits'},
  {id:'de-p', value:'Palenium'},
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


const TradeExtension = {
  onPageLoad: function(content) {
    var link = content.createElement("link");
    link.href = chrome.extension.getURL("css/fields.css");
    link.type = "text/css";
    link.rel = "stylesheet";
    content.getElementsByTagName("head")[0].appendChild(link);
    this.addfilter(content);
  },

  addfilter : function (content) {
    let selectDe = fields.createSelectField(optionsDE);
    let selectVs = fields.createSelectField(optionsVS);
    let deField = fields.createField(selectDe);
    let vsField = fields.createField(selectVs);
    let row = fields.createRow([deField, vsField]);
    let fieldset = fields.createFieldset("Filter", [row]);

    let target = content.querySelector('div');
    let before = content.querySelector('table');
    target.insertBefore(fieldset, before);
  },
};