chrome.storage.sync.get(['blockedWebsites'], function (result) {
	
	let blockedWebsites = [];

	// Load Blocked List
	chrome.storage.sync.get(['blockedWebsites'], function (result) {
	  blockedWebsites = result.blockedWebsites || [];
	});

	// Get tab updates
	chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	  if (changeInfo.status === 'complete' && tab.url) {
		const normalizedUrl = new URL(tab.url).hostname;

		for (let blockedWebsite of blockedWebsites) {
		  const regex = new RegExp(`(^|\\.)${blockedWebsite.replace(/\./g, '\\.')}$`, 'i');
		  if (regex.test(normalizedUrl)) {
			console.log(`Blocking Tab URL: ${tab.url}, matches blocked site: ${blockedWebsite}`);
			chrome.tabs.remove(tabId); // Close the tab
			break;
		  }
		}
	  }
	});

	chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	  if (message.type === 'refreshBlockedWebsites') {
		chrome.storage.sync.get(['blockedWebsites'], function (result) {
		  blockedWebsites = result.blockedWebsites || [];
		  console.log('Refreshed blocked websites from storage:', blockedWebsites);
		});
	  }
	});
});
