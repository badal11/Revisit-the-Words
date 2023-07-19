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
    const wordContainer = document.createElement("div");
    const wordSpan = document.createElement("span");
    const sentenceSpan = document.createElement("span");
    const deleteBtn = document.createElement("button");

    wordContainer.classList.add("word-container");
    wordSpan.textContent = word;
    wordSpan.classList.add("highlight");
    sentenceSpan.innerHTML = sentence.replace(
      new RegExp(`\\b${word}\\b`, "gi"),
      '<span class="highlight">$&</span>'
    );
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = "&#x2716;";

    wordContainer.appendChild(wordSpan);
    wordContainer.appendChild(deleteBtn);
    li.appendChild(wordContainer);
    li.appendChild(sentenceSpan);

    // Add click event listener to copy the word to clipboard
    wordContainer.addEventListener("click", function(event) {
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

    // Add click event listener to delete the word
    deleteBtn.addEventListener("click", function(event) {
      event.stopPropagation();
      deleteWord(word, li);
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

  // Function to delete a word
  function deleteWord(word, li) {
    chrome.storage.local.get("words", function(data) {
      const words = data.words || [];
      const updatedWords = words.filter(item => item.word !== word);
      chrome.storage.local.set({ words: updatedWords }, function() {
        wordList.removeChild(li);
        console.log("Word deleted: " + word);
      });
    });
  }

  // Function to apply dark mode theme
  function applyDarkMode() {
    const body = document.body;

    // Toggle dark mode on button click
    deleteAllBtn.addEventListener("click", function() {
      body.classList.toggle("dark-mode");
    });

    // Check if dark mode is enabled in browser settings
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      body.classList.add("dark-mode");
    }
  }
});
