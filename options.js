chrome.storage.sync.get(['blockedWebsites'], function(result) {
  let blockedWebsites = result.blockedWebsites || [];
  const listElement = document.getElementById('blockedWebsitesList');
  blockedWebsites.forEach(website => {
    let li = document.createElement('li');
    li.textContent = website;
    listElement.appendChild(li);
  });
});
