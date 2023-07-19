// Popup script
document.addEventListener("DOMContentLoaded", function() {
  const wordList = document.getElementById("wordList");
  const deleteAllBtn = document.getElementById("deleteAllBtn");

  // Add event listener to the Delete All button
  deleteAllBtn.addEventListener("click", deleteAllWords);

  // Load and display the word list
  loadWordList();

  // Apply dark mode theme
  applyDarkMode();

  // Function to delete all words
  function deleteAllWords() {
    chrome.storage.local.set({ words: [] }, function() {
      wordList.innerHTML = ""; // Clear the word list
      console.log("All words deleted.");
    });
  }

  // Function to load and display the word list
  function loadWordList() {
    chrome.runtime.sendMessage({ type: "getWords" }, function(response) {
      const words = response.words;
      words.reverse(); // Display newest words first
      words.forEach(function(item) {
        const li = createWordListItem(item.word, item.sentence);
        wordList.appendChild(li);
      });
    });
  }

  // Function to create a word list item
  function createWordListItem(word, sentence) {
    const li = document.createElement("li");
    const wordSpan = document.createElement("span");
    const sentenceSpan = document.createElement("span");
    wordSpan.textContent = word;
    wordSpan.classList.add("highlight");
    sentenceSpan.innerHTML = sentence.replace(
      new RegExp(`\\b${word}\\b`, "gi"),
      '<span class="highlight">$&</span>'
    );
    li.appendChild(wordSpan);
    li.innerHTML += ": ";
    li.appendChild(sentenceSpan);

    // Add click event listener to copy the word to clipboard
    wordSpan.addEventListener("click", function(event) {
      event.stopPropagation();
      copyToClipboard(word);
    });

    // Add click event listener to copy the sentence to clipboard
    sentenceSpan.addEventListener("click", function(event) {
      event.stopPropagation();
      copyToClipboard(sentence);
    });

    // Add click event listener to copy the word to clipboard when clicking the whole list item
    li.addEventListener("click", function(event) {
      event.stopPropagation();
      copyToClipboard(word);
    });

    return li;
  }

  // Function to copy text to clipboard
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
      console.log("Text copied to clipboard: " + text);
    }, function() {
      console.error("Failed to copy text to clipboard.");
    });
  }

  // Function to apply dark mode theme
  function applyDarkMode() {
    const body = document.body;
    const darkModeBtn = document.getElementById("darkModeBtn");

    // Toggle dark mode on button click
    darkModeBtn.addEventListener("click", function() {
      body.classList.toggle("dark-mode");
    });

    // Check if dark mode is enabled in browser settings
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      body.classList.add("dark-mode");
    }
  }
});
