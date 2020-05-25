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

  this.refeshTasks = function(callback) {
    if (_backend == 'mongo') {
      Task.find(function(err, foundTasks){
        if (!err) {
          _tasks = foundTasks;
          callback();
        }
      });
    } else {
      callback();
    }
  };

  this.add = function(title) {
    if (title.length < 1) return;
    var task = {
      title: title,
      date: updateTime(),
      id: _.kebabCase(title),
      finished: false
    };

    if (_tasks.length > 10) {
        console.log('Safety precaution: stopping inserts to prevent spam');
        return;
    };

    _tasks.push(task);
    console.log(`Added task:\n ${JSON.stringify(task)}`);
    
    if (_backend == 'mongo') {
      var newTask = new Task(task);
      newTask.save(function(err, insertedTask) {
        if (err) {
          console.log('Problem inserting new task into mongo');
        } else {
          console.log(`Inserted document ${insertedTask}`);
        }
      });
    };
  };

  this.delete = function(item_id) {
    var filteredTasks = [];
    var deletedTasks = [];

    if (_backend == 'array') {
      _tasks.forEach(task => {
        if (task.id === item_id) {
          deletedTasks.push(task);
        } else {
          filteredTasks.push(task);
        }
      });
      _tasks = filteredTasks;
      console.log(`Deleted ${deletedTasks.length} tasks:\n ${JSON.stringify(deletedTasks)}`);
    } else {
      Task.deleteOne({id: item_id}, function(err, result) {
        if (!err) {
          console.log(`Mongo delete result:\n ${JSON.stringify(result)}`);
        } else {
          console.log(`Mongo error result: ${err}`);
        }
      });
    }
  };

  this.buildMocks = function(n = 3) {
    if (_backend == 'array' && _tasks.length < 1) {
      addMocks();
      return;
    } else {
      if (_backend == 'mongo') {
        console.log('Checking mongodb for existing tasks');
        Task.find(function(err, foundTasks) {
          if (err) {
            console.log('Error connecting to mongo, falling back to array');
            _backend = 'array';
            buildMocks();
          } else {
            if (foundTasks.length < 1) {
              addMocks(n);
            } else {
              _tasks = foundTasks;
              console.log(`Found ${foundTasks.length} tasks in mongodb, no need to create new ones`);
            }
          }
        });
        return;
      }
    }
    console.log('No mocks needed');
  };

  this.addMocks = function(n = 3) {
    console.log(`Building mock tasks on backend ${_backend}`);
    for (i=0; i < n; i++) {
      add(`${lorem.generateSentences(1)}`);
    }
    updateTime();
    console.log(`${i} mock tasks added to todolist at ${_lastUpdated}`);
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

  this.enableMongo = function(callback) {
    mongoose.connection.on('connected', function() {
      _backend = 'mongo';
      console.log('Switched Todolist to mongo backend');
      if (callback) {
        callback();
      } else {
        console.log('No callback for enableMongo function');
      }
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
    id: String,
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
//     user: 'brainvat',
//     pwd: passwordPrompt(), // or cleartext password
//     roles: [ { role: 'userAdminAnyDatabase', db: 'admin' }, 'readWriteAnyDatabase' ]
//   }
// )
