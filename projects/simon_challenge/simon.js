$(document).ready(function() {
  var okayToStart = false;
  var buttonColors = ['red', 'blue', 'green', 'yellow'];
  var gamePattern = [];
  var gameLength = 0;
  var pos = 1;

  $(document).keypress(function() {
    if (!okayToStart) {
      okayToStart = true;
      $('#level-title').text('Play!');
      nextPlay();
    }
  });

  $('.btn').click(function(e) {
    var finished = false;
    var restart_game = false;
    if (!okayToStart) return;
    var btnColor = e.target.id;
    var soundFile = 'sounds/wrong.mp3';
    if (btnColor == gamePattern[pos - 1]) {
      soundFile = 'sounds/' + btnColor + '.mp3';
      pos += 1;
      if (pos > gamePattern.length) finished = true;
    } else {
      sound = 'sounds/wrong.mp3';
      restart_game = true;
    }
    var sound = new Audio(soundFile);
    sound.play();
    flashButton(btnColor);
    setTimeout(function(){
      if (finished) {
        nextPlay();
      } else if (restart_game) {
        restart();
      }
    }, 1000);
  });

  function nextPlay() {
    $('#level-title').text('High Score: ' + gameLength);
    gameLength += 1;
    var color = nextSequence();
    gamePattern.push(color);
    // only show the last button in the current sequence
    // for(i = 0; i < gamePattern.length; i++) {
    //   flashButton(gamePattern[i]);
    //   sleep(300);
    // }
    // recursiveFlash(gamePattern.length);
    flashButton(gamePattern[gamePattern.length - 1]);
    console.log(gamePattern);
    pos = 1;
  }

  // function recursiveFlash(i) {
  //   if (i<0) return;
  //   setTimeout(function(){
  //     flashButton(gamePattern[gamePattern.legnth - i]);
  //     recursiveFlash(i-1);
  //   }, 300);
  // }

  function flashButton(c) {
    // $("#" + c).fadeOut(100).fadeIn(100);
    // sleep(1000);
    // Use Angela's solution
    $('#' + c).addClass('pressed');
    setTimeout(function(){
      $('#' + c).removeClass('pressed');
    }, 300);
  }

  function restart() {
    okayToStart = false;
    gamePattern = [];
    gameLength = 0;
    pos = 1;
    $('#level-title').text('Wrong! Press a Key to Play Again');
  }

  function nextSequence() {
    return buttonColors[Math.floor(Math.random() * 4)];
  }

  function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
});
