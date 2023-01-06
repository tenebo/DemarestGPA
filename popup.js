chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  let tab = tabs[0];
  if (tab.url?.startsWith("chrome://")) return undefined;
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      files: ['./src/jquery.min.js']
    }
  );
  $('#gpa_calc').on('click', () => {
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

