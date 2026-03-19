const Storage = {

  /**
   * Returns the chrome.storage top-level key for a given page bucket,
   * namespaced to the current server (e.g. "xde:ally", "sde:Secret").
   * @param {string} page
   * @returns {string}
   */
  _key: function (page) {
    return window.server + ':' + page;
  },

  /**
   * Stores the given value in chrome.storage.local under the server-namespaced key.
   * @param {String} page the page extension key.
   * @param {String} key the configuration key.
   * @param {Object} value the value which should be stored.
   * @returns {Promise<void>}
   */
  storeConfig: async function (page, key, value) {
    const storageKey = this._key(page);
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([storageKey], (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        let obj = result[storageKey] ? result[storageKey] : {};
        obj[key] = value;
        chrome.storage.local.set({ [storageKey]: obj }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    });
  },

  /**
   * Get configuration for given page and key from chrome.storage.local.
   * @param {String} page the page extension key.
   * @param {String} key the configuration key.
   * @param {Object} defaultValue the default value if key is not found.
   * @returns {Promise<Object>} the stored object or defaultValue.
   */
  getConfig: async function (page, key, defaultValue) {
    const storageKey = this._key(page);
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([storageKey], (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        let obj = result[storageKey];
        if (obj && obj[key] !== undefined) {
          resolve(obj[key]);
        } else {
          resolve(defaultValue);
        }
      });
    });
  },

  /**
   * Remove a configuration key for given page from chrome.storage.local.
   * @param {String} page the page extension key.
   * @param {String} key the configuration key.
   * @returns {Promise<void>}
   */
  removeConfig: async function (page, key) {
    const storageKey = this._key(page);
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([storageKey], (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        let obj = result[storageKey];
        if (obj) {
          delete obj[key];
          chrome.storage.local.set({ [storageKey]: obj }, () => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve();
            }
          });
        } else {
          resolve();
        }
      });
    });
  }
};
