//jshint esversion:6
// https://www.npmjs.com/package/dateformat
const dateFormat = require('dateformat');
dateFormat.masks.blogTime = 'dddd, mmmm dS, yyyy, h:MM:ss TT';

// https://www.npmjs.com/package/lodash
const _ = require('lodash');

// https://www.npmjs.com/package/lorem-ipsum
const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 10,
    min: 4
  }
});

var Blog = (function() {
  this.posts = [];

  this.publish = function(post) {
    const now = new Date();
    const nowString = dateFormat(now, "blogTime");

    post.date = nowString;
    post.id = _.kebabCase(post.title);
    posts.push(post);
  };

  this.buildMocks = function(n = 8) {
    for (i=0; i < n; i++) {
      this.publish({
        title: `${lorem.generateSentences(1)}`,
        post: `${lorem.generateParagraphs(7).replace(/\n/g, '</p><p>')}`
      });
    }
    console.log(`${i} mock posts added to blog`);
  };

  this.findPosts = function(title) {
    const title_id = _.kebabCase(title);
    // console.log(`Kebabcase search term is ${title_id}`);
    var filteredPosts = [];

    posts.forEach(post => {
      // console.log(`Kebabcase title term is ${_.kebabCase(post.title)}`);
      if (post.id === title_id) {
        filteredPosts.push(post);
      }
    });

    return filteredPosts;
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
