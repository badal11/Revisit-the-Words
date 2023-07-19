// Content script
document.addEventListener("mouseup", function(event) {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText !== "") {
    const wholeWord = getWholeWord(selectedText);
    if (wholeWord !== "") {
      const surroundingSentence = getSurroundingSentence(wholeWord);
      if (surroundingSentence !== "") {
        chrome.runtime.sendMessage({
          type: "addWord",
          word: wholeWord,
          sentence: surroundingSentence
        }, function(response) {
          if (response.success) {
            console.log("Word added successfully!");
          }
        });
      }
    }
  }
});

// function getWholeWord(selectedText) {
//   const words = document.body.innerText.split(/\s+/);
//   let wholeWord = "";
//   for (let i = 0; i < words.length; i++) {
//     if (words[i].includes(selectedText)) {
//       wholeWord = words[i];
//       break;
//     }
//   }
//   return wholeWord;
// }

function getWholeWord(selectedText) {
  var wholeWord = selectedText;

  // Get the parent element of the selected text
  var selectedElement = window.getSelection().anchorNode.parentElement;

  // Find the closest sentence by traversing the DOM upwards
  while (selectedElement && selectedElement.nodeName !== "BODY") {
    var text = selectedElement.innerText.trim();
    var sentences = text.split(/([.?!])\s+/);
    for (var i = sentences.length - 1; i >= 0; i--) {
      var currentSentence = sentences[i].trim();
      if (currentSentence.includes(selectedText)) {
        // Remove any previous highlighting
        currentSentence = currentSentence.replace(/<\/?mark>/g, "");

        // Highlight the selected word
        currentSentence = currentSentence.replace(
          new RegExp(`\\b${selectedText}\\b`, "gi"),
          '<mark>$&</mark>'
        );

        // Check if there is a capital letter immediately before the selectedText
        var capitalWordRegex = new RegExp(`\\b[A-Z][a-z]*${selectedText}\\b`, "gi");
        var match = capitalWordRegex.exec(currentSentence);
        if (match && match.index === 0) {
          wholeWord = selectedText;
        } else {
          // Extract the complete word for the selected fragment
          var wordRegex = new RegExp(`\\b\\w*${selectedText}\\w*\\b`, "gi");
          var wordMatch = wordRegex.exec(currentSentence);
          if (wordMatch) {
            wholeWord = wordMatch[0];
          }
        }

        return wholeWord;
      }
    }
    selectedElement = selectedElement.parentElement;
  }
  return wholeWord;
}

function getSurroundingSentence(selectedText) {
  let sentence = "";
  let selectedElement = window.getSelection().anchorNode.parentElement;
  while (selectedElement && selectedElement.nodeName !== "BODY") {
    const text = selectedElement.innerText.trim();
    const sentences = text.split(/([.?!])\s+/);
    for (let i = sentences.length - 1; i >= 0; i--) {
      let currentSentence = sentences[i].trim();
      if (currentSentence.includes(selectedText)) {
        currentSentence = currentSentence.replace(/<\/?mark>/g, "");
        currentSentence = currentSentence.replace(
          new RegExp(`\\b${selectedText}\\b`, "gi"),
          '<mark>$&</mark>'
        );
        sentence = currentSentence;
        break;
      }
    }
    if (sentence !== "") {
      break;
    }
    selectedElement = selectedElement.parentElement;
  }
  return sentence;
}
