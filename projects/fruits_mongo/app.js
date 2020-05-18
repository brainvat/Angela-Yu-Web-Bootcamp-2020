//jshint esversion:6
const mongoose = require('mongoose');

const fruitSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  review: String
});

const personSchema = new mongoose.Schema({
  name: String,
  age: Number
});

const Fruit = mongoose.model('Fruit', fruitSchema);
const Person = mongoose.model('Person', personSchema);

mongoose.connect('mongodb://localhost:27017/fruitsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

resetDB();

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
  mongoose.connection.close();
});

function resetDB() {

  // https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/
  var myArgs = process.argv.slice(2);
  if (myArgs.length == 0 || myArgs[0] != 'reset') {
    return;
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
  person.save();

}
