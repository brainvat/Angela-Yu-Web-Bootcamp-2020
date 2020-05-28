//jshint esversion:6
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

const mongoose = require('mongoose');
const md5 = require('md5');

// https://www.npmjs.com/package/dateformat
const dateFormat = require('dateformat');
dateFormat.masks.createdTime = 'dddd, mmmm dS, yyyy, h:MM:ss TT';

// LEVEL 3 - Password Hashing
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
    const newUser = new User({
      email: user_info.username,
      password: md5(user_info.password),
      created_on: dateFormat(new Date(), "createdTime")
    });
    newUser.save(function(err) {
      callback(err);
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
            if (foundUser.password === md5(user_info.password)) {
              callback(err, true);
            } else {
              callback(err, false);
            }
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
