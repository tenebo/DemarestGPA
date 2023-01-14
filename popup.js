chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  let tab = tabs[0];
  if (tab.url?.startsWith("chrome://")) return undefined;
  document.querySelector('#gpa_calc').addEventListener('click', () => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ['./src/jquery.min.js']
      }, function(){
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            files: ["./src/content_script.js"]
          }
        );
      }
    );
  });
});

