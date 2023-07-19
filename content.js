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

function getWholeWord(selectedText) {
  const words = document.body.innerText.split(/\s+/);
  let wholeWord = "";
  for (let i = 0; i < words.length; i++) {
    if (words[i].includes(selectedText)) {
      wholeWord = words[i];
      break;
    }
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
