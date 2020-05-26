//jshint esversion:6
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

const mongoose = require('mongoose');
const _ = require('lodash');

// https://www.npmjs.com/package/dateformat
const dateFormat = require('dateformat');
dateFormat.masks.articleTime = 'dddd, mmmm dS, yyyy, h:MM:ss TT';

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

const articleSchema = {
  id: String,
  date: String,
  title: String,
  text: String
};
const Article = mongoose.model('Article', articleSchema);

var mconnect = '';
const mauth = process.env.MONGO_USER ? `${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@` : '';
const mhost = process.env.MONGO_HOST || 'localhost';
const mport = process.env.MONGO_PORT || 27017;
if (process.env.USE_ATLAS == 'true') {
  mconnect = `mongodb://${mauth}${mhost}`;
} else {
  mconnect = `mongodb://${mauth}${mhost}:${mport}/wikiDB`;
};

mongoose.connect(mconnect, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(err => {
  console.log(`Mongoose connection error:\n${mconnect}\n${err}`);
});

var Wiki = (function() {
  this.fetchArticles = function(callback) {
    Article.find({}, function(err, foundArticles) {
      if (!err) {
        callback(foundArticles);
      } else {
        callback([]);
      }
    });
  };

  this.publish = function(article) {
    const now = new Date();
    const nowString = dateFormat(now, "articleTime");

    article.date = nowString;
    article.id = _.kebabCase(article.title);

    var newArticle = new Article(article);
    newArticle.save(function(err, insertedArticle) {
      if (err) {
        console.log('Problem inserting new article into mongo');
      } else {
        console.log(`Inserted document ${insertedArticle}`);
      }
    });
  };

  this.buildMocks = function(n = 8) {
    Article.countDocuments({}, function(err, count) {
      if (count == 0) {
        for (i = 0; i < n; i++) {
          this.publish({
            title: `${lorem.generateSentences(1)}`,
            text: `${lorem.generateParagraphs(7).replace(/\n/g, '</p><p>')}`
          });
        }
        console.log(`${i} mock articles added to wiki`);
      } else {
        console.log('wikiDB is not empty, skipping mocks');
      }
    });
  };

  this.findArticles = function(title, callback) {
    const title_id = _.kebabCase(title);
    Article.find({id: title_id}, function(err, foundArticles) {
      if (!err) {
        callback(foundArticles);
      } else {
        callback([]);
      }
    });
  };

  console.log('Wiki singleton created');
  return this;
})();

module.exports = Wiki;
