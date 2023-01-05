// chrome.scripting.executeScript({
//   files: ['./src/jquery.min.js']
// });
// chrome.storage.sync.set({ myVariable: valueOfVariable });

chrome.tabs.query({ active: true }, function (tabs) {
  let tab = tabs[0];
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
  //   chrome.tabs.executeScript(null, { file: "./src/jquery.min.js" }, function() {
  //     chrome.tabs.executeScript(null, { file: "./src/content_script.js" });
  // });
  });
});

