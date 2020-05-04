//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
// const ejs = require('ejs');

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
  console.log('Mailchimp API KEY is ', process.env.MAILCHIMP_API);
}

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

app.get('/', function(req, resp){
  resp.render('pages/signup', {pageTitle: 'Sign Up'});
});

app.post('/subscribe', function(req, resp) {
  console.log(req.body);
  const vars = {
    firstName: req.body.firstName || '',
    lastName: req.body.lastName || '',
    email: req.body.email || '',
    unsubscribed: req.body.unsubscribed == "yes" ? 1 : 0,
    edit: req.body.edit || 0
  };

  if (vars.firstName == '' || vars.lastName == '' || vars.email == '') {
    resp.render('pages/failure', {pageTitle: 'Failure!', vars: vars});
  } else {
    if (req.body.edit == 1) {
      resp.render('pages/success', {pageTitle: 'Updated!', vars: vars});
    } else {
      resp.render('pages/success', {pageTitle: 'Success!', vars: vars});
    }
  }
});

app.listen(3000, function(){
  console.log('Express server listening on port 3000');
});







// Mailchimp recommended merge keys

// --------------------
// Merge Tag: FNAME
// Name: First Name
// Type: text (string)
// --------------------
// Merge Tag: LNAME
// Name: Last Name
// Type: text (string)
// --------------------
// Merge Tag: ADDRESS
// Name: Address
// Type: address
// --------------------
// Merge Tag: PHONE
// Name: Phone Number
// Type: phone (string)
// --------------------
// Merge Tag: BIRTHDAY
// Name: Birthday
// Type: birthday (string)
