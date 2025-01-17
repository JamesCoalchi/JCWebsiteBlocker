document.getElementById('addWebsite').addEventListener('click', function () {
  let websiteUrl = document.getElementById('websiteUrl').value.trim();

  try {
    const normalizedHostname = new URL(websiteUrl).hostname; // Get hostname
    if (normalizedHostname) {
      chrome.storage.sync.get(['blockedWebsites'], function (result) {
        let blockedWebsites = result.blockedWebsites || [];
        if (!blockedWebsites.includes(normalizedHostname)) {
          blockedWebsites.push(normalizedHostname);

          // Save the updated blocked list
          chrome.storage.sync.set({ blockedWebsites: blockedWebsites }, function () {
            updateBlockedListUI(blockedWebsites);
            document.getElementById('websiteUrl').value = ''; // Clear input
          });
        }
      });
    }
  } catch (error) {
    console.error('Invalid URL:', error);
    alert('Please enter a valid URL.');
  }
});

function updateBlockedListUI(blockedWebsites) {
  const listElement = document.getElementById('blockedWebsitesList');
  listElement.innerHTML = ''; // Clear the list first

  blockedWebsites.forEach((website, index) => {
    let li = document.createElement('li');
    li.innerHTML = `${website} <button class="remove-btn" data-index="${index}">Remove</button>`;
    listElement.appendChild(li);
  });

  // Attach event listeners to remove buttons
  document.querySelectorAll('.remove-btn').forEach((button) => {
    button.addEventListener('click', function () {
      const index = this.getAttribute('data-index');
      removeWebsite(index);
    });
  });
}

function removeWebsite(index) {
  chrome.storage.sync.get(['blockedWebsites'], function (result) {
    let blockedWebsites = result.blockedWebsites || [];
    blockedWebsites.splice(index, 1); // Remove the website from the list

    chrome.storage.sync.set({ blockedWebsites: blockedWebsites }, function () {
      updateBlockedListUI(blockedWebsites);

      chrome.runtime.sendMessage({ type: 'refreshBlockedWebsites' });
    });
  });
}

chrome.storage.sync.get(['blockedWebsites'], function (result) {
  updateBlockedListUI(result.blockedWebsites || []);
});
