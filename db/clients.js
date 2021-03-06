// Generated by CoffeeScript 1.6.3
var Client, apn, utils, _;

utils = require('../lib/utils');

_ = require('underscore')._;

apn = require('apn');

Client = require("../model/client");

exports.find = function(id, done) {
  return Client.find({
    id: id
  }, function(err, client) {
    if (err) {
      return done(err, null);
    } else {
      return done(null, client);
    }
  });
};

exports.findById = function(clientId, done) {
  return Client.find({
    clientId: clientId
  }, function(err, client) {
    if (err) {
      return done(err, null);
    } else {
      return done(null, client);
    }
  });
};
