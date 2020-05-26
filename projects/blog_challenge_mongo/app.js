//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const blog = require('./models/blog-posts.js');
const lodash = require('lodash');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

app.get('/', function(req, resp) {
  blog.fetchPosts(function(posts) {
    resp.render('home.ejs', {msg: homeStartingContent, posts: posts, _: lodash});
  });
});

app.get('/contact', function(req, resp) {
  resp.render('contact.ejs', {msg: contactContent});
});

app.get('/about', function(req, resp) {
  resp.render('about.ejs', {msg: aboutContent});
});

app.get('/post/:title', function(req, resp) {
  // console.log(`${req.params.title}`);
  const posts = blog.findPosts(req.params.title, function (posts){
    if (posts.length > 0) {
      resp.render('post.ejs', {msg: '', posts: posts});
    } else {
      resp.render('post.ejs', {msg: `No matching posts found for <strong>${req.params.title}</strong>.`, posts: null});
    }
  });
});

app.get('/compose', function(req, resp) {
  resp.render('compose.ejs');
});

app.post('/compose', function(req, resp) {
  const vars = {
    title: req.body.title || 'No title',
    post: req.body.post || 'No post'
  };
  blog.publish(vars);
  resp.redirect('/');
});

// setup mock blog posts for testing
blog.buildMocks(Math.floor(Math.random() * 12 + 1));

// use dotenv for port in case this is hosted on Heroku
const port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log(`Express server listening on port ${port}`);
});


//
// git subtree push --prefix projects/blog_mongo heroku-blog master
//
