const Storage = {

  /**
   * Stores the given value in chrome.storage.local.
   * @param {String} page the page extension key.
   * @param {String} key the configuration key.
   * @param {Object} value the value which should be stored.
   * @returns {Promise<void>}
   */
  storeConfig: async function (page, key, value) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([page], (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        let obj = result[page] ? result[page] : {};
        obj[key] = value;
        chrome.storage.local.set({ [page]: obj }, () => {
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
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([page], (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        let obj = result[page];
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
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([page], (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        let obj = result[page];
        if (obj) {
          delete obj[key];
          chrome.storage.local.set({ [page]: obj }, () => {
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
