/**
 * Extends the production page of Die-Ewigen /production.php
 * @type {{onPageLoad: ProductionExtension.onPageLoad, update: ProductionExtension.update, addResDistrKey: ProductionExtension.addResDistrKey, createTd: (function(String, String): HTMLTableDataCellElement)}}
 */
const ProductionExtension = {

  supportValues: {
      'E': {
        1: {
          4: 8,
          5: 18
        },
        3: {
          5: 5
        },
        4: {
          5: 3
        }
      },
      'K': {
        1: {
          4: 7,
          5: 14
        },
        3: {
          5: 5
        },
        4: {
          5: 3
        }
      },
      'I': {
        1: {
          4: 8,
          5: 18
        },
        3: {
          5: 5
        },
        4: {
          5: 3
        }
      },
      'Z': {
        1: {
          4: 12,
          5: 30
        },
        3: {
          5: 5
        },
        4: {
          5: 3
        }
      }
    },

  blockSupportValues: {
    'E': {
      4: {
        2: 10
      },
      5: {
        2: 22
      },
      8: {
        2: 34
      }
    },
    'K': {
      4: {
        2: 6
      },
      5: {
        2: 14
      },
      8: {
        2: 26
      }
    },
    'I': {
      4: {
        2: 12
      },
      5: {
        2: 28
      },
      8: {
        2: 43
      }
    },
    'Z': {
      4: {
        2: 12
      },
      5: {
        2: 29
      },
      8: {
        2: 48
      }
    }
  },

  onPageLoad: function (content) {
    this.addResDistrKey(content);
    this.addSupportValues(content);
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
   * Add the minimum required ship amount to support other ship types.
   * @param {Document} content the document which contains the production form.
   */
  addSupportValues: function (content) {
    const resultTable = content.querySelector('form[action="production.php"] table:nth-child(1) tr td table tbody');
    const shipTypeRows = resultTable.querySelectorAll('tr');
    const raceSupportValues = this.supportValues[window.race];
    Object.entries(raceSupportValues).forEach(([type, supportReq]) => {
      const intType = parseInt(type)
      const supportGivingShipTypeRow = shipTypeRows[intType];
      let shipsNeeded = 0;
      let cellClasses = []
      const supportGivingAmountNode = supportGivingShipTypeRow.childNodes[supportGivingShipTypeRow.childElementCount - 2];
      const supportGivingShips = parseInt(supportGivingAmountNode.innerText.replace(/\./g, ''));
      cellClasses = supportGivingAmountNode.classList
      Object.entries(supportReq).forEach(([type, amount]) => {
        const intType = parseInt(type);
        const shipTypeNeedingSupportRow = shipTypeRows[intType];
        let shipAmountNode = shipTypeNeedingSupportRow.childNodes[shipTypeNeedingSupportRow.childElementCount - 2];
        const shipsNeedingSupport = parseInt(shipAmountNode.innerText.replace(/\./g, ''));
        shipsNeeded += shipsNeedingSupport * amount
      })
      let cellStyle = undefined;
      if (supportGivingShips >= shipsNeeded) {
        cellStyle = 'color: #00ff00'
      } else {
        cellStyle = 'color: #ff0000'
      }
      if (shipsNeeded > 0) {
        this.addSupportRow(resultTable, supportGivingShipTypeRow.nextElementSibling, cellClasses, shipsNeeded, cellStyle);
      }
    })
  },

  /**
   * Add a new row to display the needed ship amount below the ship type.
   * @param {HTMLElement} content the form with all ships
   * @param {HTMLElement} beforeNode the row after the support requiring row
   * @param {string} cellClass the cell class of the row
   * @param {number} neededSupport the minimum needed amount of the ship type
   * @param {string} cellStyle additional styling
   */
  addSupportRow: function (content, beforeNode, cellClass, neededSupport, cellStyle) {
    const tr = document.createElement('tr');
    tr.setAttribute('valign', 'middle');
    tr.setAttribute('align', 'center');
    tr.setAttribute('height', '25');

    const tdText = document.createElement('td');
    tdText.classList.add(cellClass);
    tdText.innerText = "Benötigter Support durch Großkampfschiffe"
    tdText.style = cellStyle;
    tdText.setAttribute('colspan', '7');
    tr.insertBefore(tdText, null);

    const tdValue = document.createElement('td');
    tdValue.classList.add(cellClass);
    tdValue.innerText = "" + neededSupport;
    tdValue.style = cellStyle;
    tr.insertBefore(tdValue, null);
    let emptyNode = document.createElement('td');
    emptyNode.classList.add(cellClass);
    emptyNode.style = cellStyle;
    tr.insertBefore(emptyNode, null);
    content.insertBefore(tr, beforeNode);
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