chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading") {
    chrome.storage.sync.get(["blockedWebsites"], (data) => {
      const blockedWebsites = data.blockedWebsites || [];
      const url = new URL(tab.url);

      if (blockedWebsites.includes(url.hostname)) {
        chrome.tabs.remove(tabId); // Close the tab
      }
    });
  }
});
