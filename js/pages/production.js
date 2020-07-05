/**
 * Extends the production page of Die-Ewigen /production.php
 * @type {{onPageLoad: ProductionExtension.onPageLoad, update: ProductionExtension.update, addResDistrKey: ProductionExtension.addResDistrKey, createTd: (function(String, String): HTMLTableDataCellElement)}}
 */
const ProductionExtension = {
  onPageLoad: function (content) {
    this.addResDistrKey(content);
  },

  /**
   * Add resource output distribution key row to production page.
   * @param {Document} content the document which contains the production form.
   */
  addResDistrKey: function (content) {
    let resultTable = content.querySelector('form[action="production.php"] table:nth-child(2) tr td table tbody');
    let inputFields = content.querySelectorAll('form[action="production.php"] input[onkeyup="berechnepreise();"');
    inputFields.forEach(inputField => inputField.addEventListener("keyup",this.update));
    let tr = document.createElement('tr');
    tr.id = "rkr";
    tr.align = "center";
    tr.insertBefore(this.createTd('desc',"Schlüssel:"), null);
    tr.insertBefore(this.createTd('m',"0%"), null);
    tr.insertBefore(this.createTd('d',"0%"), null);
    tr.insertBefore(this.createTd('i',"0%"), null);
    tr.insertBefore(this.createTd('e',"0%"), null);
    let lastRow = resultTable.childNodes[resultTable.childElementCount];
    resultTable.insertBefore(tr, lastRow);
  },

  /**
   * Creates a resource distribution key cell.
   * @param {String} idSuffix resource ID suffix.
   * @param {String} value content of table cell.
   * @return {HTMLTableDataCellElement} the a table cell.
   */
  createTd : function (idSuffix, value) {
    let td = document.createElement('td');
    td.classList = ['cell1'];
    td.id = 'rkc-' + idSuffix;
    td.innerText = value;
    td.height = "20";
    return td;
  },

  /**
   * Change event listener which calculates the needed resource output distribution keys.
   * @param event the change event of input field.
   */
  update : function (event) {
    let ownerDocument = event.target.ownerDocument;
    let m = parseInt(ownerDocument.getElementById("m").innerText.split('.').join(''));
    let d = parseInt(ownerDocument.getElementById("d").innerText.split('.').join('')) * 2;
    let i = parseInt(ownerDocument.getElementById("i").innerText.split('.').join('')) * 3;
    let e = parseInt(ownerDocument.getElementById("e").innerText.split('.').join('')) * 4;
    let basicValue = m + d + i + e;
    if(basicValue === 0) {
      ownerDocument.getElementById("rkc-m").innerText = "0%";
      ownerDocument.getElementById("rkc-d").innerText = "0%";
      ownerDocument.getElementById("rkc-i").innerText = "0%";
      ownerDocument.getElementById("rkc-e").innerText = "0%";
    } else {
      ownerDocument.getElementById("rkc-m").innerText = Math.round(m / basicValue * 10000) / 100 + "%";
      ownerDocument.getElementById("rkc-d").innerText = Math.round(d / basicValue * 10000) / 100 + "%";
      ownerDocument.getElementById("rkc-i").innerText = Math.round(i / basicValue * 10000) / 100 + "%";
      ownerDocument.getElementById("rkc-e").innerText = Math.round(e / basicValue * 10000) / 100 + "%";
    }
  },
};