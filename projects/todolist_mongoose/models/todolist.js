//jshint esversion:6
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

const mongoose = require('mongoose');
const _ = require('lodash');

const dateFormat = require('dateformat');
dateFormat.masks.taskTime = 'dddd, mmmm dS, yyyy, h:MM TT';

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

var Todolist = (function() {
  this._backend = 'array';
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

  this.enableMongo = function() {
    mongoose.connection.on('connected', function() {
      this._backend = 'mongo';
      console.log('Switched Todolist to mongo backend');
    });
    mongoose.connect(_mconnect, {useNewUrlParser: true, useUnifiedTopology: true});
  };

  const mauth = process.env.MONGO_USER ? `${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@` : '';
  const mhost = process.env.MONGO_HOST || 'localhost';
  const mport = process.env.MONGO_PORT || 27017;
  this._mconnect = `mongodb://${mauth}${mhost}:${mport}/todolist`;

  const tasksSchema = {
    title: String,
    date: String,
    finished: Boolean
  };
  this.Task = mongoose.model('Task', tasksSchema);

  console.log(`Todolist singleton created with backend ${_backend}`);
  return this;
})();

module.exports = Todolist;

// https://docs.mongodb.com/manual/tutorial/enable-authentication/
// use admin
// db.createUser(
//   {
//     user: “brainvat”,
//     pwd: passwordPrompt(), // or cleartext password
//     roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
//   }
// )
