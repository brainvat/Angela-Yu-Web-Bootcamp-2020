let buttons = document.querySelectorAll('.drum');
buttons.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    playSound(event.target.innerText);
    event.target.classList.add('pressed');
    var clearPressed = function () {
      event.target.classList.remove('pressed');
    }
    window.setTimeout(clearPressed, 200);
  });
});

document.addEventListener("keypress", (event) => {
  const key = event.key;
  var button = document.querySelector('.' + key + '.drum');
  if (button) {
    button.click();
  }
});

function playSound(key) {
  var sound = '';
  switch (key) {
    case 'w':
      sound = 'crash.mp3';
      break;
    case 'a':
      sound = 'kick-bass.mp3';
      break;
    case 's':
      sound = 'snare.mp3';
      break;
    case 'd':
      sound = 'tom-1.mp3';
      break;
    case 'j':
      sound = 'tom-2.mp3';
      break;
    case 'k':
      sound = 'tom-3.mp3';
      break;
    case 'l':
      sound = 'tom-4.mp3';
      break;
    default:
      sound = false;
  }

  if (sound) {
    var audio = new Audio('sounds/' + sound);
    audio.play();
  }
}
