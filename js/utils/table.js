/**
 * Table creation utils.
 * @type {{createField: (function(HTMLInputElement): HTMLDivElement), createSelectField: (function(String, Object[], Function, string): HTMLSelectElement), createRow: (function(String, String): HTMLTableRowElement[]), createContentTable: (function(HTMLTableRowElement[]): HTMLDivElement)}}
 */
const Tables = {

  /**
   * Create a table HTML DOM element with given field rows
   * @param {HTMLTableRowElement[]} rows the table rows array.
   * @returns {HTMLTableElement}
   */
  createContentTable: function (rows) {
    let div = document.createElement('div');
    div.setAttribute('align', 'center');
    let table = document.createElement('table');
    table.setAttribute('width', 586);
    table.setAttribute('cellpadding', 0);
    table.setAttribute('cellspacing', 0);
    let tableBody = document.createElement('tbody');
    rows.forEach(row => {
      tableBody.append(row);
    });
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