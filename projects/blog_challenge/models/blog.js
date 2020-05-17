//jshint esversion:6
// https://www.npmjs.com/package/dateformat
var dateFormat = require('dateformat');
dateFormat.masks.blogTime = 'dddd, mmmm dS, yyyy, h:MM:ss TT';

var Blog = (function() {
  this.posts = [];

  this.publish = function(post) {
    const now = new Date();
    const nowString = dateFormat(now, "blogTime");

    post.date = nowString;
    posts.push(post);
  };

  this.log = function() {
    console.log(JSON.stringify(this.posts));
  };

  console.log('Blog singleton created');
  return this;
})();

module.exports = Blog;
