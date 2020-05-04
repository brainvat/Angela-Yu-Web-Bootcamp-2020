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
  res.render("pages/weather", {
      msg: 'Please specify a city',
      city: '', weather: ''
    });
});

app.post('/weather', function(req, res) {
  const city = req.body.city;
  if (!city) {
    res.redirect('/');
  } else {
    res.redirect('/weather/' + city);
  }
});

app.get('/weather', function(req, res){
  res.redirect('/');
});

// use request module for HTTPS request and JSON parser of response
app.get('/weather/:city', function(req, res) {
  // api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
  if (!process.env.API_WEATHER) {
    res.send('Openweathermap API not properly configured.');
    console.log(process.env);
  } else {
    const url = 'https://api.openweathermap.org/data/2.5/weather?' +
                'units=imperial&q=' + req.params.city +
                '&appid=' + process.env.API_WEATHER;
    console.log('Fetching ', url);
    request(url, {
      json: true
    }, (err, response, body) => {
      if (err) {
        return console.log(err);
      }
      console.log(body);
      if (!req.params.city) {
        res.send('No city specified.');
      } else {
        if (!body.weather) {
          res.send('Problem retrieving weather from API.');
        } else {
          res.render("pages/weather", {
            msg: "Success!",
            city: req.params.city,
            weather: body.weather[0].description,
            temp: body.main.temp
          });
        }
      }
    });
  }
});

app.listen(3000, function() {
  console.log("Listening on port 3000");
});
