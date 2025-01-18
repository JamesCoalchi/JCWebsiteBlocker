chrome.storage.local.get(['blockedWebsites'], function (result) {
	
	let blockedWebsites = result.blockedWebsites || [];

	// Load Blocked List
	chrome.storage.local.get(['blockedWebsites'], function (result) {
		console.log('Blocked Websites on Load:', result.blockedWebsites); // Debugging
	});

	// Get tab updates
	chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
		if (changeInfo.status === 'complete' && tab.url) {
		  const normalizedUrl = new URL(tab.url).hostname;

		  // Check each blocked website
		  for (let blockedWebsite of blockedWebsites) {
			const regex = new RegExp(`(^|\\.)${blockedWebsite.replace(/\./g, '\\.')}$`, 'i');
			console.log(`Checking if ${normalizedUrl} matches ${blockedWebsite}`); // Debugging
			if (regex.test(normalizedUrl)) {
			  console.log(`Blocking Tab URL: ${tab.url}, matches blocked site: ${blockedWebsite}`);
			  chrome.tabs.remove(tabId); // Close the tab
			  break;
			}
		  }
		}
	  });

	chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	  if (message.type === 'updateBlockedWebsites') {
		blockedWebsites = message.blockedWebsites || [];
		console.log('Updated Blocked Websites List:', blockedWebsites);
	  }
	});
});
