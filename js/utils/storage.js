const Storage = {

  /**
   * Stores the given value in LocalStorage.
   * @param {String} page the page extension key.
   * @param {String} key the configuration key.
   * @param {Object} value the value which should be stored.
   */
  storeConfig: function (page, key, value) {
    let entry = localStorage.getItem(page);
    if (entry) {
      let obj = JSON.parse(atob(this.de(entry)));
      if(!obj) {
        obj = JSON.parse(atob(entry));
      }
      obj[key] = value;
      localStorage.setItem(page, this.en(btoa(JSON.stringify(obj))))
    } else {
      let obj = {};
      obj[key] = value;
      localStorage.setItem(page, this.en(btoa(JSON.stringify(obj))))
    }
  },

  /**
   * Get configuration for given page and key from LocalStorage.
   * @param {String} page the page extension key.
   * @param {String} key the configuration key.
   * @return {Object} the stored object or undefined.
   */
  getConfig: function (page, key) {
    let item = localStorage.getItem(page);
    if (item) {
      let obj = JSON.parse(atob(this.de(item)));
      if(!obj) {
        obj = JSON.parse(atob(item));
      }
      return obj[key];
    }
    return undefined;
  },

  removeConfig: function (page, key) {
    let item = localStorage.getItem(page);
    if (item) {
      let obj = JSON.parse(atob(this.de(item)));
      if(!obj) {
        obj = JSON.parse(atob(item));
      }
      delete obj[key];
      localStorage.setItem(page, this.en(btoa(JSON.stringify(obj))));
    }
    return undefined;
  },

  en: function (c) {
    let x = 'charCodeAt', b, e = {}, f = c.split(""), d = [], a = f[0], g = 256;
    for (b = 1; b < f.length; b++) c = f[b], null != e[a + c] ? a += c : (d.push(1 < a.length ? e[a] : a[x](0)), e[a + c] = g, g++, a = c);
    d.push(1 < a.length ? e[a] : a[x](0));
    for (b = 0; b < d.length; b++) d[b] = String.fromCharCode(d[b]);
    return d.join("")
  },

  de: function (b) {
    let a, e = {}, d = b.split(""), c = f = d[0], g = [c], h = o = 256;
    for (b = 1; b < d.length; b++) a = d[b].charCodeAt(0), a = h > a ? d[b] : e[a] ? e[a] : f + c, g.push(a), c = a.charAt(0), e[o] = f + c, o++, f = a;
    return g.join("")
  }
};
