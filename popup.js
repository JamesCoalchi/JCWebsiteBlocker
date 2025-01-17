document.getElementById("add").addEventListener("click", () => {
  const websiteInput = document.getElementById("website");
  const website = websiteInput.value.trim();

  if (website) {
    chrome.storage.sync.get(["blockedWebsites"], (data) => {
      const blockedWebsites = data.blockedWebsites || [];
      if (!blockedWebsites.includes(website)) {
        blockedWebsites.push(website);
        chrome.storage.sync.set({ blockedWebsites }, () => {
          displayBlockedWebsites();
          websiteInput.value = ""; //clear input
        });
      }
    });
  }
});

function displayBlockedWebsites() {
  chrome.storage.sync.get(["blockedWebsites"], (data) => {
    const blockedWebsites = data.blockedWebsites || [];
    const blockedList = document.getElementById("blockedList");
    blockedList.innerHTML = "";

    blockedWebsites.forEach((website, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = website;

      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.addEventListener("click", () => {
        blockedWebsites.splice(index, 1);
        chrome.storage.sync.set({ blockedWebsites }, displayBlockedWebsites);
      });

      listItem.appendChild(removeButton);
      blockedList.appendChild(listItem);
    });
  });
}

displayBlockedWebsites();
