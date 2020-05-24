//jshint esversion:6
// https://www.npmjs.com/package/dateformat
const dateFormat = require('dateformat');
dateFormat.masks.taskTime = 'dddd, mmmm dS, yyyy, h:MM TT';

// https://www.npmjs.com/package/lorem-ipsum
const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 1,
    min: 1
  },
  wordsPerSentence: {
    max: 6,
    min: 2
  }
});

// https://www.npmjs.com/package/lodash
const _ = require('lodash');

var Todolist = (function() {
  this._tasks = [];
  this._name = 'Today';
  this._lastUpdated = null;

  this.name = function() {
    return _name;
  };

  this.lastUpdated = function() {
    return _lastUpdated ||  updateTime();
  };

  this.updateTime = function () {
    _lastUpdated = dateFormat(new Date(), "taskTime");
    return _lastUpdated;
  };

  this.forEach = function(callback) {
      return _.forEach(_tasks, callback);
  };

  this.add = function(title) {
    if (title.length < 1) return;
    var task = {
      title: title,
      date: updateTime(),
      id: _.kebabCase(title),
      finished: false
    };

    _tasks.push(task);
  };

  this.buildMocks = function(n = 3) {
    for (i=0; i < n; i++) {
      add(`${lorem.generateSentences(1)}`);
    }
    updateTime();
    console.log(`${i} mock tasks added to todolist`);
  };

  this.update = function(item) {
    _tasks.forEach(task => {
      if (task.id === item) {
        task.finished = !task.finished;
        console.log(task);
      }
    });
  };

  this.log = function() {
    console.log(JSON.stringify(_tasks));
  };

  console.log('Todolist singleton created');
  return this;
})();

module.exports = Todolist;
