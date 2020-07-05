const fields = {

  /**
   * Create a fieldset HTML DOM element with given field rows
   * @param {String} title the title of the field set
   * @param {HTMLDivElement[]} rows the field rows array.
   * @returns {HTMLFieldSetElement}
   */
  createFieldset: function (title, rows) {
    let fieldset = document.createElement('fieldset');
    fieldset.classList = ['fieldset-fields '+ window.race];
    let htmlLegendElement = document.createElement('legend');
    htmlLegendElement.innerText = title;
    fieldset.insertBefore(htmlLegendElement, null);
    rows.forEach(row => {
      fieldset.insertBefore(row, null);
    });
    return fieldset;
  },

  /**
   * Create a fieldset row with given fields
   * @param {HTMLDivElement[]} fields the fields in a row
   * @returns {HTMLDivElement} the row HTML element
   */
  createRow: function (fields) {
    let row = document.createElement('div');
    row.classList = ['fieldset-row'];
    fields.forEach(field => {
      row.insertBefore(field, null);
    });
    return row;
  },

  /**
   * Create a field element from given input element
   * @param {HTMLInputElement} inputElement to be added to the field
   * @returns {HTMLDivElement} the field HTML element
   */
  createField: function (inputElement) {
    let field = document.createElement('div');
    field.classList = ['field'];
    field.insertBefore(inputElement, null);
    return field;
  },

  /**
   * Create a select input element with given options
   * @param {String} id input element id
   * @param {Object[]} options with id and value
   * @param {function} changeListener the change listener of select field.
   * @param {string} preselected the id of preselected entry or undefined.
   * @returns {HTMLSelectElement} the HTML select element options
   */
  createSelectField: function (id, options, changeListener, preselected) {
    let select = document.createElement('select');
    select.id = id;
    select.addEventListener('change', changeListener);
    options.map(option => {
        let optElement = document.createElement('option');
        optElement.id = option.id;
        optElement.value = option.id;
        optElement.innerText = option.value;
        if(option.id === preselected) {
          optElement.selected = true;
        }
        return optElement;
    }).forEach(optElement => {
      select.insertBefore(optElement, null);
    });
    return select;
  }
};