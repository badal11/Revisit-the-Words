// Background script
chrome.runtime.onInstalled.addListener(function() {
    // Initialize the word list
    chrome.storage.local.set({ words: [] });
  });
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "addWord") {
      // Add the selected word and sentence to the list
      chrome.storage.local.get("words", function(data) {
        var words = data.words || [];
        words.push({ word: request.word, sentence: request.sentence });
        chrome.storage.local.set({ words: words }, function() {
          sendResponse({ success: true });
        });
      });
    } else if (request.type === "getWords") {
      // Retrieve the word list
      chrome.storage.local.get("words", function(data) {
        sendResponse({ words: data.words });
      });
    }
    return true;
  });
  