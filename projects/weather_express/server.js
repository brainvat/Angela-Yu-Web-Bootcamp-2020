const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require("dotenv");
  dotenv.config();
  console.log('Weather API Key is ', process.env.API_WEATHER);
}

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  const vars = {
    msg: 'Hello, world.'
  }
  res.render('pages/weather', vars);
});

app.get('/weather/:city', function(req, res) {
  // api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
  const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + req.params.city + '&appid=' + process.env.API_WEATHER;
  console.log('Fetching ', url);
  request(url, {
    json: true
  }, (err, response, body) => {
    if (err) {
      return console.log(err);
    }
    console.log(body);
    res.render("pages/weather", {msg: "Success!", city: req.params.city, weather: body.weather[0].description});
  });
});

app.listen(3000, function() {
  console.log("Listening on port 3000");
});
