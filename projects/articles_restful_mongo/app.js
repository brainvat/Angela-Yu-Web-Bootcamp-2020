//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const wiki = require('./models/wiki.js');
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

// route chaining
app.route('/articles')

.get(function(req, resp) {
  wiki.fetchArticles(function(err, foundArticles) {
    if (!err) {
      resp.json(foundArticles || [{}]);
    } else {
      resp.json([{}]);
      console.log(`GET ERROR:\n${err}`);
    }
  });
})

.post(function(req, resp) {
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
})

.delete(function(req, resp) {
  wiki.deleteArticles(function(err, results) {
    if (!err) {
      resp.json(results);
    } else {
      resp.json([{}]);
      console.log(`DELETE ALL ERROR:\n${err}`);
    }
  });
});

// no route chaining

app.get('/articles/:id', function(req, resp) {
  wiki.findArticle(req.params.id, function(err, foundArticle) {
    if (!err) {
      resp.json(foundArticle || {});
    } else {
      resp.json({});
      console.log(`FIND ONE ERROR: ${err}`);
    }
  });
});

app.put('/articles/:id', function(req, resp) {
  wiki.replaceArticle(req.params.id, req.body, function(err, results) {
    if (!err) {
      resp.json(results)
    } else {
      resp.json({});
      console.log(`REPLACE ARTICLE ERROR:\n${err}`);
    }
  });
});

app.patch('/articles/:id', function(req, resp) {
  wiki.updateArticle(req.params.id, req.body, function(err, results) {
    if (!err) {
      resp.json(results);
    } else {
      resp.json({});
      console.log(`UPDATE ARTICLE ERROR:\n${err}`);
    }
  })
});

app.delete('/articles/:id', function(req, resp) {
  wiki.deleteArticle(req.params.id, function(err) {
    if (err) {
      console.log(`DELETE ONE ERROR:\n${err}`);
    }
    resp.json({});
  });
});

// setup mock articles for testing
wiki.buildMocks(Math.floor(Math.random() * 12 + 1));

// use dotenv for port in case this is hosted on Heroku
const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`Express server listening on port ${port}`);
});

//
// git subtree push --prefix projects/articles_restful_mongo heroku-restful master
//
