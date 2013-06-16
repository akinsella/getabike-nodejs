// Generated by CoffeeScript 1.6.3
var User, apn, utils, _;

utils = require('../lib/utils');

_ = require('underscore')._;

apn = require('apn');

User = require("../model/user");

exports.find = function(id, done) {
  return User.find({
    id: id
  }, function(err, user) {
    if (err) {
      return done(err, null);
    } else {
      return done(null, user);
    }
  });
};

exports.findByEmail = function(email, done) {
  return User.find({
    email: email
  }, function(err, user) {
    if (err) {
      return done(err, null);
    } else {
      return done(null, user);
    }
  });
};
