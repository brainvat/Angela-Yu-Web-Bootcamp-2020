//jshint esversion:6
const mongoose = require('mongoose');

const myArgs = process.argv.slice(2);
var shouldThrow = false;
if (myArgs.length > 0 && myArgs[0] == 'throws') {
  shouldThrow = true;
}

mongoose.connect('mongodb://localhost:27017/fruitsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const fruitSchema = new mongoose.Schema({
  name: String,
  rating: {
    type: Number,
    min: 1,
    max: 10
  },
  review: String
});

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function() {
      return this.name.length > 3;
    }
  },
  age: {
    type: Number,
    min: 1
  },
  favoriteFruit: fruitSchema
});

const Fruit = mongoose.model('Fruit', fruitSchema);
const Person = mongoose.model('Person', personSchema);

if (!resetDB()) {
  const peach = new Fruit({
    name: 'Peach',
    rating: shouldThrow ? 24 : 10,
    review: 'Exceptionally amazing fruit'
  });

  peach.save().catch(e => {
    if (e) {
      console.log(`Coud not save Peach\n${e}`);
    }
  });

  const angela = new Person({
    name: shouldThrow ? 'An' : 'Angela',
    age: 24
  });

  angela.save().catch(e => {
    if (e) {
      console.log(`Could not save Angela\n${e}`);
    }
  });

  const john = new Person({
    name: 'John',
    age: 34,
    favoriteFruit: peach,
  });

  john.save().catch(e => {
    if (e) {
      console.log(`Could not save John\n${e}`);
    }
  })

  Person.updateOne({
    name: 'Angela'
  }, {
    favoriteFruit: peach
  }, function(e, res) {
    if (e) {
      console.log(`Could not add peach to Angela ${e}`);
    } else {
      console.log('Updated angela');
    }
  });

  Fruit.find(function(err, fruits) {
    if (err) {
      console.log(`ERROR: ${err}`);
    } else {
      // console.log(`Fruits:\n ${fruits}');
      console.log(`Found ${fruits.length} fruits in collection`);
      fruits.forEach(fruit => {
        console.log(fruit.name);
      });
    }
  });

  Person.find(function(err, people) {
    if (err) {
      console.log(`ERROR: ${err}`);
    } else {
      console.log(`Found ${people.length} people in collection`);
      people.forEach(person => {
        console.log(`${person.name} age ${person.age}`);
      });
    }
  });

  Fruit.updateOne({
    name: 'Peach'
  }, {
    rating: 9
  }, e => {
    if (e) {
      console.log(`Error updating Peach ${e}`);
    } else {
      console.log('Updated Peach record');
    }
  });

  Fruit.deleteMany({
    name: 'Peach'
  }, function(e, res) {
    if (e) {
      console.log(`Error deleting Peach ${e}`);
    } else {
      console.log(`Succesfully deleted ${res.deletedCount} Peach`);
    }
  });

  Person.deleteMany({
    name: 'Angela'
  }, function(e, res) {
    if (e) {
      console.log(`Error deleting Person ${e}`);
    } else {
      console.log(`Succesfully deleted ${res.deletedCount} People`);
    }
    mongoose.connection.close();
  });

}

// mongoose.connection.close();

function resetDB() {

  // https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/
  if (myArgs.length == 0 || myArgs[0] != 'reset') {
    return false;
  }

  Fruit.deleteMany({
    _id: {
      $exists: 1
    }
  }, function(err) {
    if (err) {
      console.log(err);
    }
  });

  const fruit = new Fruit({
    name: 'Apple',
    rating: 7,
    review: 'Pretty solid as a fruit.'
  });
  fruit.save();

  const kiwi = new Fruit({
    name: 'Kiwi',
    score: 10,
    review: 'The best fruit'
  });

  const orange = new Fruit({
    name: 'Orange',
    score: 4,
    review: 'Too sour for me'
  });

  const banana = new Fruit({
    name: 'Banana',
    score: 3,
    review: 'Weird texture'
  });

  Fruit.insertMany([kiwi, orange, banana], function(err) {
    if (err) {
      console.log(`ERROR: ${err}`);
    } else {
      console.log('Successfully saved fruits to db');
    }
  });

  Person.deleteMany({
    _id: {
      $exists: 1
    }
  }, function(err) {
    if (err) {
      console.log(err);
    }
  });

  const person = new Person({
    name: 'Allen',
    age: '42'
  });

  person.save().then(e => {
    mongoose.connection.close()
  });

  return true;

}
