//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const todolist = require('./models/todolist.js');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

app.get('/', function(req, resp) {
  resp.render('todolist', {todolist: todolist});
});

app.post('/', function(req, resp) {
  todolist.add(req.body.newItem);
  resp.redirect('/');
});

app.get('/about', function(req, resp) {
  resp.render('about');
});

app.post('/update', function(req, resp) {
  todolist.update(req.body.item);
  resp.redirect('/');
});

// set up Todolist
todolist.buildMocks();

// use dotenv for port in case this is hosted on Heroku
const port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log(`Express server listening on port ${port}`);
});
