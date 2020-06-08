//jshint esversion:6
const express = require('express');
const favicon = require('express-favicon');
const path = require('path');
const bodyParser = require('body-parser');
// const ejs = require('ejs');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const dateFormat = require('dateformat');
dateFormat.masks.createdTime = 'dddd, mmmm dS, yyyy, h:MM:ss TT';

const assetsPath = path.join(__dirname, 'build');
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

const app = express();
app.use(favicon(__dirname + '/build/favicon.ico'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
// if (process.env.NODE_ENV !== 'production') {
//   app.use(express.static(__dirname));
//   app.use(express.static("public"));
// } else {
//  app.use(express.static(path.join(__dirname, 'build')));
// }

app.use(session({
  secret: process.env.SECRET || 'mylittlesecret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Connect to mongo
var mconnect = '';
const mauth = process.env.MONGO_USER ? `${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@` : '';
const mhost = process.env.MONGO_HOST || 'localhost';
const mport = process.env.MONGO_PORT || 27017;
if (process.env.USE_ATLAS === 'true') {
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
mongoose.set("useCreateIndex", true);

// LEVEL 6 - OATH via Google OATH 2.0
const userSchema = new mongoose.Schema({
  email: String,
  created_on: String,
  password: String,
  first_name: String,
  last_name: String,
  googleId: String,
  facebookId: String,
  secret: String
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CLIENT_HOST + 'auth/google/secrets',
    passReqToCallback: true
    // userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(request, accessToken, refreshToken, profile, done) {
    console.log(profile);
    User.findOrCreate({
      googleId: profile.id
    }, function(err, user) {
      return done(err, user);
    });
  }
));

// LEVEL 6 - OATH via Facebook OATH 2.0
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CLIENT_HOST + 'auth/facebook/secrets'
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    User.findOrCreate({
      facebookId: profile.id
    }, function(err, user) {
      if (err) {
        console.log(`PASSPORT LOGIN ERROR:\n${err}`);
        return done(err, null);
      } else {
        done(null, user);
      }
    });
  }
));

app.get('/', function(req, resp) {
  resp.render('home');
});

app.get('/ping', function(req, res) {
  return res.send('pong');
});

app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read']
  }));

app.get('/auth/google/secrets',
  passport.authenticate('google', {
    successRedirect: '/index.html',
    failureRedirect: '/login'
  }));

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/secrets',
  passport.authenticate('facebook', {
    successRedirect: '/index.html',
    failureRedirect: '/login'
  }));


app.get('/css/:path', function(req, resp) {
  resp.sendFile(path.join(assetsPath, 'css', req.params.path));
});

app.get('/static/js/:path', function(req, resp) {
  resp.sendFile(path.join(assetsPath, 'static', 'js', req.params.path));
});

app.get('/favicon.ico', function(req, resp) {
  resp.sendFile(path.join(assetsPath, 'favicon.ico'));
});

app.get('/index.html', function(req, resp) {
  if (req.isAuthenticated()) {
    User.find({
      secret: {
        $ne: null
      }
    }, function(err, foundUsers) {
      if (err) {
        console.log(`No secrets found:\n${err}`);
      }
      resp.sendFile(path.join(assetsPath, 'index.html'));
    });
  } else {
    resp.render('login', {
      errorMsg: 'You must be logged in to view the secret'
    });
  }
});

app.get('/secrets', function(req, resp) {
  if (req.isAuthenticated()) {
    User.find({
      secret: {
        $ne: null
      }
    }, function(err, foundUsers) {
      if (err) {
        console.log(`No secrets found:\n${err}`);
      }
      if (userIsSuper(req)) {
        resp.render('secrets', {
          usersWithSecrets: foundUsers || []
        });
      } else {
        resp.render('login', {
          errorMsg: 'Unauthorized user'
        });
      }
    });
  } else {
    resp.render('login', {
      errorMsg: 'You must be logged in to view the secret'
    });
  }
});


app.route('/register')

  .get(function(req, resp) {
    resp.render('register', {
      errorMsg: false
    });
  })

  .post(function(req, resp) {
    User.register({
      username: req.body.username
    }, req.body.password, function(err, newUser) {
      if (err) {
        console.log(`REGISTER ERROR:\n${err}`);
        resp.render('register', {
          errorMsg: err
        });
      } else {
        passport.authenticate("local")(req, resp, function() {
          resp.redirect('/index.html');
        });
      }
    });
  });

app.route('/login')

  .get(function(req, resp) {
    resp.render('login', {
      errorMsg: false
    });
  })

  .post(function(req, resp) {
    const user = new User({
      username: req.body.username,
      password: req.body.MONGO_PASSWORD
    });

    req.login(user, function(err) {
      if (err) {
        console.log(`LOGIN ERROR:\n${err}`);
        resp.render('login', {
          errorMsg: err
        });
      } else {
        passport.authenticate("local", {
          failureRedirect: '/login',
          failureFlash: true
        })(req, resp, function() {
          resp.redirect('/index.html');
        });
      }
    });
  });

app.route('/logout')

  .get(function(req, resp) {
    req.logout();
    resp.redirect('/');
  });

app.route('/submit')

  .get(function(req, resp) {
    if (req.isAuthenticated()) {
      if (!userIsSuper(req)) {
        console.log('Abort request, unauthorized user');
        resp.redirect('/');
        // TODO: to avoid crashing the app, since http headers are sent
        return;
      } else {
        resp.render('submit');
      }
    } else {
      resp.render('login', {
        errorMsg: 'You must be logged in to submit secrets'
      });
    }
  })

  .post(function(req, resp) {
    const submittedSecret = req.body.secret;
    console.log(req.user);

    if (!userIsSuper(req)) {
      console.log('Abort save secret, unauthorized user');
      resp.redirect('/');
      // TODO: to avoid crashing the app, since http headers are sent
      return;
    }

    User.findById(req.user.id, function(err, foundUser) {
      if (err) {
        console.log(`SUBMIT SECRET ERROR:\n${err}`);
        resp.render('login', {
          errorMsg: 'You must be logged in to submit secrets'
        });
      } else {
        if (foundUser) {
          foundUser.secret = submittedSecret;
          foundUser.save(function(error) {
            if (error) {
              console.log(`SECRET SAVE ERROR:\n${error}`);
              resp.redirect('/');
            } else {
              resp.redirect('/secrets');
            }
          });
        } else {
          resp.render('login', {
            errorMsg: 'You must be logged in to submit secrets'
          });
        }
      };
    });
  });

// use dotenv for port in case this is hosted on Heroku
const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`Express server listening on port ${port}`);
});

function userIsSuper(req) {
  return req.user && (req.user.username === process.env.SUPERUSER);
}

//
// git subtree push --prefix projects/keeper_react_node heroku-keeper master
//
