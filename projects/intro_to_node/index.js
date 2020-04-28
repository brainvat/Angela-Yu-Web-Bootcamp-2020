var superheroes = require("superheroes");
var villain = require("supervillains");

var mySuperHeroName = superheroes.random();
var myVillainName = villain.random();

console.log("Hero: " + mySuperHeroName);
console.log("Villain: " + myVillainName);
