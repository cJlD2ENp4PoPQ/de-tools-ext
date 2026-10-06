/**
 * Table creation utils.
 * @type {{createField: (function(HTMLInputElement): HTMLDivElement), createSelectField: (function(String, Object[], Function, string): HTMLSelectElement), createRow: (function(String, String): HTMLTableRowElement[]), createContentTable: (function(HTMLTableRowElement[]): HTMLDivElement)}}
 */
const Tables = {

  /**
   * Create a table HTML DOM element with given field rows
   * @param {HTMLTableRowElement[]} rows the table rows array.
   * @param isRedesign boolean whether the redesign layout is used or not
   * @returns {HTMLTableElement}
   */
  createContentTable: function (rows, isRedesign = false) {
    let div = document.createElement('div');
    div.setAttribute('align', 'center');
    let table = document.createElement('table');
    table.setAttribute('width', isRedesign ? 602 : 586);
    table.setAttribute('cellpadding', 0);
    table.setAttribute('cellspacing', 0);
    let tableBody = document.createElement('tbody');
    rows.forEach(row => {
      tableBody.append(row);
    });
    let footerRow = document.createElement('tr');
    let footerCell1 = document.createElement('td');
    footerCell1.setAttribute('width', 13);
    footerCell1.classList.add('rul');
    footerCell1.textContent = '\u00A0';
    let footerCell2 = document.createElement('td');
    footerCell2.classList.add('ru');
    footerCell2.textContent = '\u00A0';
    let footerCell3 = document.createElement('td');
    footerCell3.setAttribute('width', 13);
    footerCell3.classList.add('rur');
    footerCell3.innerHTML = '\u00A0';
    footerRow.append(footerCell1, footerCell2, footerCell3);
    tableBody.append(footerRow);
    table.append(tableBody);
    div.append(table);
    return div;
  },

  /**
   * Create a fieldset row with given fields
   * @param {String} header headline
   * @param {String} text text as html
   * @returns {HTMLTableRowElement[]} header and content row
   */
  createRow: function (header, text) {
    let rowHeader = document.createElement('tr');
    let spacer = document.createElement('td');
    spacer.setAttribute('width', 13);
    spacer.setAttribute('height', 37);
    spacer.setAttribute('class','rol');
    let headerCell = document.createElement('td');
    headerCell.setAttribute('width', 560);
    headerCell.setAttribute('align', 'center');
    headerCell.setAttribute('class','ro');
    headerCell.innerHTML = header;
    let spacerHeaderEnd = document.createElement('td');
    spacerHeaderEnd.setAttribute('class','ror');
    spacerHeaderEnd.innerHTML = ' '
    rowHeader.append(spacer, headerCell, spacerHeaderEnd);

    let rowContent = document.createElement('tr');
    let spacerContent = document.createElement('td');
    spacerContent.setAttribute('class','rl');
    let content = document.createElement('td');
    let contentDiv = document.createElement('div');
    contentDiv.setAttribute('class','cell');
    contentDiv.innerHTML = text;
    content.append(contentDiv);
    let spacerContentEnd = document.createElement('td');
    spacerContentEnd.setAttribute('class','rr');
    spacerContentEnd.innerHTML = ' '
    rowContent.append(spacerContent, content, spacerContentEnd);
    return Array.of(rowHeader, rowContent);
  },
};