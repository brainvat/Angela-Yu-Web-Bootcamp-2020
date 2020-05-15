function add(n1, n2) {
  return n1 + n2;
}

function subtract(n1, n2) {
  return n1 - n2;
}

function divide(n1, n2) {
  return n1 / n2;
}

function multiply(n1, n2) {
  return n1 * n2;
}

function operate(f, n1, n2) {
  return f(n1, n2);
}

var text = "<li>" + "3 + 5 = " + operate(add, 3, 5) + "</li>";
text += "<li>" + "3 - 5 = " + operate(subtract, 3, 5) + "</li>";
text += "<li>" + "3 / 5 = " + operate(divide, 3, 5) + "</li>";
text += "<li>" + "3 * 5 = " + operate(multiply, 3, 5) + "</li>";
document.querySelector('div').innerHTML = "<ul>" + text + "</ul>";
