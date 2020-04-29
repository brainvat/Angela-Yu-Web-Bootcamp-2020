const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs')

var history = [];

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/bmicalculator", function(req, res) {
  res.sendFile(__dirname + "/bmiCalculator.html");
});

app.post("/", function(req, res){
  var num1 = Number(req.body.num1);
  var num2 = Number(req.body.num2);
  var sum = num1 + num2;
  var vars = {num1: num1, num2: num2, sum: sum};

  history.push(vars);
  res.render('pages/calculate', {current: vars, history: history});
});

app.post("/bmicalculator", function(req, res){
  var weight = Number(req.body.weight);
  var height = Number(req.body.height);
  var BMI = 703 * weight / (height * height);

  res.send("Your BMI for height = " + height + " and weight = " + weight + " is " + BMI);
});

app.listen(3000, function(){
  console.log("Calculator app listening on port 3000");
});
