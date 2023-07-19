// Popup script
chrome.runtime.sendMessage({ type: "getWords" }, function(response) {
  var wordList = document.getElementById("wordList");
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
  });
});
