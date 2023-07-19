// Popup script
chrome.runtime.sendMessage({ type: "getWords" }, function(response) {
  var wordList = document.getElementById("wordList");
  var deleteAllBtn = document.getElementById("deleteAllBtn");

  // Reverse the array of words to display newest first
  response.words.reverse();

  // Add event listener to the Delete All button
  deleteAllBtn.addEventListener("click", function() {
    chrome.storage.local.set({ words: [] }, function() {
      wordList.innerHTML = ""; // Clear the word list
      console.log("All words deleted.");
    });
  });

  response.words.forEach(function(item) {
    var li = document.createElement("li");
    var word = document.createElement("span");
    var sentence = document.createElement("span");
    word.textContent = item.word;
    word.classList.add("highlight");
    sentence.innerHTML = item.sentence;
    sentence.innerHTML = sentence.innerHTML.replace(
      new RegExp(`\\b${item.word}\\b`, "gi"),
      '<span class="highlight">$&</span>'
    );
    li.appendChild(word);
    li.innerHTML += ": ";
    li.appendChild(sentence);
    wordList.appendChild(li);

    // Add click event listener to copy the word to clipboard
    word.addEventListener("click", function(event) {
      event.stopPropagation();
      copyToClipboard(item.word);
    });

    // Add click event listener to copy the sentence to clipboard
    sentence.addEventListener("click", function(event) {
      event.stopPropagation();
      copyToClipboard(item.sentence);
    });

    // Add click event listener to copy the word to clipboard when clicking the whole li element
    li.addEventListener("click", function(event) {
      event.stopPropagation();
      copyToClipboard(item.word);
    });
  });
});

// Function to copy text to clipboard
function copyToClipboard(text) {
  var dummyElement = document.createElement("textarea");
  document.body.appendChild(dummyElement);
  dummyElement.value = text;
  dummyElement.select();
  document.execCommand("copy");
  document.body.removeChild(dummyElement);
  console.log("Text copied to clipboard: " + text);
}
