document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get(['selectedWord', 'sentence'], function(result) {
      if (result.selectedWord && result.sentence) {
        document.getElementById('selected-word').textContent = result.selectedWord;
        document.getElementById('sentence').textContent = result.sentence;
        highlightSelectedWord(result.selectedWord);
      } else {
        document.getElementById('selected-word').textContent = 'No word selected.';
        document.getElementById('sentence').textContent = '';
      }
    });
  });
  
  function highlightSelectedWord(selectedWord) {
    var selectedWordElements = document.getElementsByClassName('selected-word');
    for (var i = 0; i < selectedWordElements.length; i++) {
      var element = selectedWordElements[i];
      element.innerHTML = element.innerHTML.replace(
        new RegExp(`\\b${selectedWord}\\b`, 'gi'),
        '<mark>$&</mark>'
      );
    }
  }
  