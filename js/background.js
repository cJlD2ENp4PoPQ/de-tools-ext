/**
 * Service worker — handles tasks that content scripts cannot perform directly.
 */
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'open-options-page') {
    chrome.runtime.openOptionsPage();
  }
});
