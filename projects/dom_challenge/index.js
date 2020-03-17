document.querySelectorAll('.list')[2].innerHTML += " changed by JS";

document.querySelector('button').addEventListener('click', function () {
  document.querySelector('h1').classList.toggle('huge');
})
