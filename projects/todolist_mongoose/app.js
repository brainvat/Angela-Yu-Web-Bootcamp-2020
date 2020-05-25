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

const USE_MONGO = process.argv.includes('USE_ARRAY') ? false : true;

app.get('/', function(req, resp) {
  todolist.refeshTasks(function() {
    resp.render('todolist', {todolist: todolist});
  });
});

app.post('/', function(req, resp) {
  todolist.add(req.body.newItem);
  resp.redirect('/');
});

app.get('/about', function(req, resp) {
  resp.render('about');
});

app.post('/delete', function(req, resp) {
  todolist.delete(req.body.item_id);
  resp.redirect('/');
});

app.get('/activate-mongo', function(req, resp) {
  todolist.enableMongo(function() {
    todolist.buildMocks();
    resp.redirect('/');
  });
});

// set up Todolist
if (USE_MONGO) {
  todolist.enableMongo(function() {
    todolist.buildMocks();
  });
} else {
  todolist.buildMocks();
}

// use dotenv for port in case this is hosted on Heroku
const port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log(`Express server listening on port ${port}`);
});

//
// git subtree push --prefix projects/todolist_mongoose heroku-todolist master
//
