var randomNumber1 = Math.floor((Math.random() * 6) + 1);
document.getElementById("img1").setAttribute("src", "images/dice" + randomNumber1 + ".png");

var randomNumber2 = Math.floor((Math.random() * 6) + 1);
document.getElementsByClassName("img2")[0].setAttribute("src", "images/dice" + randomNumber2 + ".png");

var winner = (randomNumber1 == randomNumber2) ? -1 : (randomNumber1 > randomNumber2 ? 1 : 2);
var winnerText = "";
if (winner == -1) {
    winnerText = "Draw!";
} else {
  winnerText = "Player " + winner + " Wins!";
  if (winner == 1) {
    winnerText = "🚩 " + winnerText;
  } else {
    winnerText += " 🚩";
  }
}
document.getElementsByTagName("h1")[0].innerHTML = winnerText;
