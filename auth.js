// Generated by CoffeeScript 1.6.3
var BasicStrategy, BearerStrategy, ClientPasswordStrategy, GoogleStrategy, LocalStrategy, User, db, passport, utils,
  _this = this;

passport = require('passport');

LocalStrategy = require('passport-local').Strategy;

GoogleStrategy = require('passport-google').Strategy;

BasicStrategy = require('passport-http').BasicStrategy;

ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;

BearerStrategy = require('passport-http-bearer').Strategy;

User = require('./model/user');

utils = require('./lib/utils');

db = require('./db');

/*
LocalStrategy

This strategy is used to authenticate users based on a username and password.
Anytime a request is made to authorize an application, we must ensure that
a user is logged in before asking them to approve the request.
*/


passport.use(new LocalStrategy(function(email, password, done) {
  return db.users.findByEmail(email, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }
    if (user.password !== password) {
      return done(null, false);
    }
    return done(null, user);
  });
}));

passport.use(new GoogleStrategy({
  returnURL: 'http://localhost:9000/auth/google/callback',
  realm: 'http://localhost:9000/'
}, function(identifier, profile, done) {
  return process.nextTick(function() {
    profile.identifier = identifier;
    return User.findOne({
      email: profile.emails[0].value
    }, function(err, user) {
      if (err) {
        return done(err, null);
      } else if (user) {
        user.firstName = profile.name.givenName;
        user.lastName = profile.name.familyName;
        user.googleId = utils.getParameterByName(profile.identifier, "id");
        return user.save(function(err) {
          return done(err, profile);
        });
      } else {
        user = new User({
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          googleId: utils.getParameterByName(profile.identifier, "id")
        });
        user.lastName = profile.name.familyName;
        return user.save(function(err) {
          return done(err, profile);
        });
      }
    });
  });
}));

passport.serializeUser(function(user, done) {
  var googleId;
  googleId = utils.getParameterByName(user.identifier, "id");
  return done(null, googleId);
});

passport.deserializeUser(function(id, done) {
  return User.find({
    googleId: id
  }, function(err, user) {
    return done(err, user);
  });
});

/*
BasicStrategy & ClientPasswordStrategy

These strategies are used to authenticate registered OAuth clients.  They are
employed to protect the `token` endpoint, which consumers use to obtain
access tokens.  The OAuth 2.0 specification suggests that clients use the
HTTP Basic scheme to authenticate.  Use of the client password strategy
allows clients to send the same credentials in the request body (as opposed
to the `Authorization` header).  While this approach is not recommended by
the specification, in practice it is quite common.
*/


passport.use(new BasicStrategy(function(username, password, done) {
  return db.clients.findByClientId(username, function(err, client) {
    if (err) {
      return done(err);
    }
    if (!client) {
      return done(null, false);
    }
    if (client.clientSecret !== password) {
      return done(null, false);
    }
    return done(null, client);
  });
}));

passport.use(new ClientPasswordStrategy(function(clientId, clientSecret, done) {
  return db.clients.findByClientId(clientId, function(err, client) {
    if (err) {
      return done(err);
    }
    if (!client) {
      return done(null, false);
    }
    if (client.clientSecret !== clientSecret) {
      return done(null, false);
    }
    return done(null, client);
  });
}));

/*
BearerStrategy

This strategy is used to authenticate users based on an access token (aka a
bearer token).  The user must have previously authorized a client
application, which is issued an access token to make requests on behalf of
the authorizing user.
*/


passport.use(new BearerStrategy(function(accessToken, done) {
  return db.accessTokens.find(accessToken, function(err, token) {
    if (err) {
      return done(err);
    }
    if (!token) {
      return done(null, false);
    }
    return db.users.find(token.userID, function(err, user) {
      var info;
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      info = {
        scope: "*"
      };
      return done(null, user, info);
    });
  });
}));
