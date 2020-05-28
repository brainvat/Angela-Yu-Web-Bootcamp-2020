//jshint esversion:6
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// https://www.npmjs.com/package/dateformat
const dateFormat = require('dateformat');
dateFormat.masks.createdTime = 'dddd, mmmm dS, yyyy, h:MM:ss TT';

// LEVEL 4 - Password Hashing & Salting
const userSchema = new mongoose.Schema({
  email: String,
  created_on: String,
  password: String,
  first_name: String,
  last_name: String
});
const User = mongoose.model('User', userSchema);

var mconnect = '';
const mauth = process.env.MONGO_USER ? `${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@` : '';
const mhost = process.env.MONGO_HOST || 'localhost';
const mport = process.env.MONGO_PORT || 27017;
if (process.env.USE_ATLAS == 'true') {
  mconnect = `mongodb://${mauth}${mhost}`;
} else {
  mconnect = `mongodb://${mauth}${mhost}:${mport}/usersDB`;
};

mongoose.connect(mconnect, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(err => {
  console.log(`Mongoose connection error:\n${mconnect}\n${err}`);
});

var Users = (function() {
  this.register = function(user_info, callback) {
    bcrypt.hash(user_info.password, saltRounds, function(err, hash) {
      if (!err) {
        const newUser = new User({
          email: user_info.username,
          password: hash,
          created_on: dateFormat(new Date(), "createdTime")
        });
        newUser.save(function(error) {
          callback(error);
        });
      } else {
        callback(err);
      }
    });
  };

  this.login = function(user_info, callback) {
    User.findOne({
        email: user_info.username
      },
      function(err, foundUser) {
        if (err) {
          callback(err, false);
        } else {
          if (foundUser) {
            bcrypt.compare(user_info.password, foundUser.password, function(error, result) {
              if (result === true) {
                callback(error, true);
              } else {
                callback(error, false);
              }
            });
          } else {
            callback(err, false);
          }
        }
      });
  };

  console.log('Users singleton created');
  return this;
})();

module.exports = Users;
