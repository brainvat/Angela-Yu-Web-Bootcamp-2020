//jshint esversion:6
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/fruitsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

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
  if (error) {
    console.log(err);
  } else {
    console.log('Successfully saved fruits to db');
  }
});

const person = new Person({
  name: 'Allen',
  age: '42'
});
person.save();

// // Connection URL
// const url = 'mongodb://localhost:27017';
//
// // Database Name
// const dbName = 'fruitsDB';
//
// // Create a new MongoClient
// const client = new MongoClient(url, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });
//
// // Use connect method to connect to the Server
// client.connect(function(err) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");
//
//   const db = client.db(dbName);
//
//   // https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/
//   var myArgs = process.argv.slice(2);
//   if (myArgs.length > 0 && myArgs[0] == 'reset') {
//     console.log('Deleting contents of fruits collection');
//     db.collection('fruits').deleteMany({
//       name: {
//         $exists: 1
//       }
//     });
//   }
//
//   insertDocuments(db, function() {
//     findDocuments(db, function() {
//       client.close();
//     });
//   });
// });
//
// const insertDocuments = function(db, callback) {
//   // Get the documents collection
//   const collection = db.collection('fruits');
//   // Insert some documents
//   collection.insertMany([{
//       name: 'Apple',
//       score: 8,
//       review: 'Great fruit'
//     },
//     {
//       name: 'Orange',
//       score: 6,
//       review: 'Kinda sour'
//     },
//     {
//       name: 'Banana',
//       score: 9,
//       review: 'Great stuff!!'
//     }
//   ], function(err, result) {
//     assert.equal(err, null);
//     assert.equal(3, result.result.n);
//     assert.equal(3, result.ops.length);
//     console.log("Inserted 3 documents into the collection");
//     callback(result);
//   });
// }
//
// const findDocuments = function(db, callback) {
//   // Get the documents collection
//   const collection = db.collection('fruits');
//   // Find some documents
//   collection.find({}).toArray(function(err, fruits) {
//     assert.equal(err, null);
//     console.log(`Found the ${fruits.length} fruits in the collection`);
//     console.log(fruits)
//     callback(fruits);
//   });
// }
