//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const lodash = require('lodash');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

app.get('/', function(req, resp) {
  resp.render('home.ejs');
});

app.route('/register')

.get(function(req, resp) {
  resp.render('register.ejs');
})

.post(function(req, resp) {
  resp.redirect('/');
});

app.route('/login')

.get(function(req, resp) {
  resp.render('login.ejs');
})

.post(function(req, resp) {
  resp.redirect('/');
});

app.route('/submit')

.get(function(req, resp) {
  resp.render('submit.ejs');
})

.post(function(req, resp) {
  resp.redirect('/');
});

// use dotenv for port in case this is hosted on Heroku
const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`Express server listening on port ${port}`);
});

//
// git subtree push --prefix projects/secrets_auth heroku-secrets master
//
