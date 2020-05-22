//jshint esversion:6
// https://www.npmjs.com/package/dateformat
const dateFormat = require('dateformat');
dateFormat.masks.taskTime = 'dddd, mmmm dS, yyyy, h:MM:ss TT';

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
  this.tasks = [];
  this._name = 'Today';

  this.name = function() {
    return _name;
  };

  this.forEach = function(callback) {
      return _.forEach(tasks, callback);
  };

  this.add = function(title) {
    const now = new Date();
    const nowString = dateFormat(now, "taskTime");

    var task = {
      title: title,
      date: nowString,
      id: _.kebabCase(title),
      finished: false
    };

    tasks.push(task);
  };

  this.buildMocks = function(n = 3) {
    for (i=0; i < n; i++) {
      this.add(`${lorem.generateSentences(1)}`);
    }
    console.log(`${i} mock tasks added to todolist`);
  };

  this.delete = function(title) {
    const title_id = _.kebabCase(title);
    // console.log(`Kebabcase search term is ${title_id}`);
    var filteredTasks = [];
    var deletedTasks = []

    tasks.forEach(task => {
      // console.log(`Kebabcase title term is ${_.kebabCase(post.title)}`);
      if (task.id === title_id) {
        deletedTasks.push(task);
      } else {
        filteredTasks.push(task);
      }
    });

    tasks = filteredTasks;
    return deletedTasks;
  };

  this.log = function() {
    console.log(JSON.stringify(this.tasks));
  };

  console.log('Todolist singleton created');
  return this;
})();

module.exports = Todolist;
