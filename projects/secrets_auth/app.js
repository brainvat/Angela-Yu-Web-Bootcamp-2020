//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const users = require('./models/users.js');

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
  resp.render('home');
});

app.route('/register')

.get(function(req, resp) {
  resp.render('register', { errorMsg: false });
})

.post(function(req, resp) {
  users.register(req.body, function(err, results) {
    if (!err) {
      resp.render('secrets');
    } else {
      resp.render('register', { errorMsg: err });
    }
  });
});

app.route('/login')

.get(function(req, resp) {
  resp.render('login', { errorMsg: false });
})

.post(function(req, resp) {
  users.login(req.body, function(err, found) {
    if (err) {
      resp.render('login', { errorMsg: err });
      console.log(`LOGIN ERR:\n${err}`);
    } else {
      if (found) {
        resp.render('secrets');
      } else {
        resp.render('login', { errorMsg: 'User not found' });
        console.log('User not found');
      }
    }
  });
});

app.route('/logout')

.get(function(req, resp) {
  resp.redirect('/');
})

.post(function(req, resp) {
  resp.redirect('/');
});

app.route('/submit')

.get(function(req, resp) {
  resp.render('submit');
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
