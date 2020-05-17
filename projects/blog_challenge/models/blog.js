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

  this.buildMocks = function(n = 3) {
    for (i=0; i < n; i++) {
      this.publish({
        title: `Test ${i}`,
        post: `Lorem ipsum dolor sit amet ${i}, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad ${i} minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
      });
    }
    console.log(`${i} mock posts added to blog`);
  };

  this.log = function() {
    console.log(JSON.stringify(this.posts));
    // this.posts.forEach(post => {
    //   console.log(post.title);
    // });
  };

  console.log('Blog singleton created');
  return this;
})();

module.exports = Blog;
