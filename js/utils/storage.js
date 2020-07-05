const Storage = {

  /**
   * Stores the given value in LocalStorage.
   * @param {String} page the page extension key.
   * @param {String} key the configuration key.
   * @param {Object} value the value which should be stored.
   */
  storeConfig : function (page, key, value) {
    let entry = localStorage.getItem(page);
    if(entry) {
      let obj = JSON.parse(atob(entry));
      obj[key] = value;
      localStorage.setItem(page, btoa(JSON.stringify(obj)))
    } else {
      let obj = {};
      obj[key] = value;
      localStorage.setItem(page, btoa(JSON.stringify(obj)))
    }
  },

  /**
   * Get configuration for given page and key from LocalStorage.
   * @param {String} page the page extension key.
   * @param {String} key the configuration key.
   * @return {Object} the stored object or undefined.
   */
  getConfig : function (page, key) {
    let item = localStorage.getItem(page);
    if(item) {
      let obj = JSON.parse(atob(item));
      return obj[key];
    }
    return undefined;
  },

  removeConfig : function (page, key) {
    let item = localStorage.getItem(page);
    if(item) {
      let obj = JSON.parse(atob(item));
      delete obj[key];
      localStorage.setItem(page, btoa(JSON.stringify(obj)));
    }
    return undefined;
  }
};