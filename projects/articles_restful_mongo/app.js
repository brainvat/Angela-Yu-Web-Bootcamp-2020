//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const wiki = require('./models/wiki.js');
const lodash = require('lodash');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

app.get('/articles', function(req, resp) {
  wiki.fetchArticles(function(err, foundArticles) {
    if (!err) {
      resp.json(foundArticles);
    } else {
      resp.json([{}]);
      console.log(`GET ERROR:\n${err}`);
    }
  });
});

app.post('/articles', function(req, resp) {
  var post = {
    title: req.body.title,
    text: req.body.text
  };
  if (post.title && post.text) {
    wiki.publish(post, function(err, newArticle) {
      if (!err) {
        resp.json(newArticle);
      } else {
        resp.json({});
        console.log(`POST ERROR:\n${err}`);
      }
    });
  } else {
    resp.json({});
    console.log('Invalid request');
  }
});

app.delete('/articles', function(req, resp) {
    wiki.deleteArticles(function(err, deletedArticles) {
      if (!err) {
        resp.json(deletedArticles);
      } else {
        resp.json([{}]);
        console.log(`DELETE ERROR:\n${err}`);
      }
    });
});

// setup mock articles for testing
wiki.buildMocks(Math.floor(Math.random() * 12 + 1));

// use dotenv for port in case this is hosted on Heroku
const port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log(`Express server listening on port ${port}`);
});

//
// git subtree push --prefix projects/wiki_restful_mongo heroku-wiki master
//
