/**
 * Service worker — handles tasks that content scripts cannot perform directly.
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'open-options-page') {
    try {
      // enforce opening of settings in a new tab (workaround for faulty mobile Edge API) chrome.runtime.openOptionsPage()
      chrome.tabs.create({ url: chrome.runtime.getURL('options/settings.html') });
      sendResponse({ status: 'success' });
    } catch (error) {
      sendResponse({ status: 'Seite konnte nicht geöffnet werden', error: error.message });
    }
    return true;
  }
});