// Content script
document.addEventListener("mouseup", function(event) {
  var selectedText = window.getSelection().toString().trim();
  if (selectedText !== "") {
    var wholeWord = getWholeWord(selectedText);
    if (wholeWord !== "") {
      var surroundingSentence = getSurroundingSentence(wholeWord);
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

function getWholeWord(selectedText) {
  var words = document.body.innerText.split(/\s+/);
  var wholeWord = "";
  for (var i = 0; i < words.length; i++) {
    if (words[i].includes(selectedText)) {
      wholeWord = words[i];
      break;
    }
  }
  return wholeWord;
}

function getSurroundingSentence(selectedText) {
  var sentence = "";
  var selectedElement = window.getSelection().anchorNode.parentElement;
  while (selectedElement && selectedElement.nodeName !== "BODY") {
    var text = selectedElement.innerText.trim();
    var sentences = text.split(/([.?!])\s+/);
    for (var i = sentences.length - 1; i >= 0; i--) {
      var currentSentence = sentences[i].trim();
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
