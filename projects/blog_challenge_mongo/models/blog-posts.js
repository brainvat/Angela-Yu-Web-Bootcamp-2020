//jshint esversion:6
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

const mongoose = require('mongoose');
const _ = require('lodash');

// https://www.npmjs.com/package/dateformat
const dateFormat = require('dateformat');
dateFormat.masks.blogTime = 'dddd, mmmm dS, yyyy, h:MM:ss TT';

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

const blogPostSchema = {
  id: String,
  date: String,
  title: String,
  post: String
};
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

var mconnect = '';
const mauth = process.env.MONGO_USER ? `${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@` : '';
const mhost = process.env.MONGO_HOST || 'localhost';
const mport = process.env.MONGO_PORT || 27017;
if (process.env.USE_ATLAS == 'true') {
  mconnect = `mongodb://${mauth}${mhost}`;
} else {
  mconnect = `mongodb://${mauth}${mhost}:${mport}/blogDB`;
};

mongoose.connect(mconnect, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(err => {
  console.log(`Mongoose connection error:\n${mconnect}\n${err}`);
});

var Blog = (function() {
  this.fetchPosts = function(callback) {
    BlogPost.find({}, function(err, foundPosts) {
      if (!err) {
        callback(foundPosts);
      } else {
        callback([]);
      }
    });
  };

  this.publish = function(post) {
    const now = new Date();
    const nowString = dateFormat(now, "blogTime");

    post.date = nowString;
    post.id = _.kebabCase(post.title);

    var newBlogPost = new BlogPost(post);
    newBlogPost.save(function(err, insertedPost) {
      if (err) {
        console.log('Problem inserting new blog post into mongo');
      } else {
        console.log(`Inserted document ${insertedPost}`);
      }
    });
  };

  this.buildMocks = function(n = 8) {
    BlogPost.countDocuments({}, function(err, count) {
      if (count == 0) {
        for (i = 0; i < n; i++) {
          this.publish({
            title: `${lorem.generateSentences(1)}`,
            post: `${lorem.generateParagraphs(7).replace(/\n/g, '</p><p>')}`
          });
        }
        console.log(`${i} mock posts added to blog`);
      } else {
        console.log('BlogDB is not empty, skipping mocks');
      }
    });
  };

  this.findPosts = function(title, callback) {
    const title_id = _.kebabCase(title);
    BlogPost.find({id: title_id}, function(err, foundPosts) {
      if (!err) {
        callback(foundPosts);
      } else {
        callback([]);
      }
    });
  };

  console.log('Blog singleton created');
  return this;
})();

module.exports = Blog;
