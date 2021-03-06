Mongoose = require '../lib/mongo'
pureautoinc  = require('mongoose-pureautoinc');

Device = new Mongoose.Schema(
  id: Number
  udid: { type : String, "default" : '', trim : true }
  token: { type : String, "default" : '', trim : true }
  createdAt: { type : Date, "default" : Date.now }
  lastModified: { type : Date, "default" : Date.now }
)

deviceModel = Mongoose.client.model 'Device', Device

Device.plugin(pureautoinc.plugin, {
    model: 'Device',
    field: 'id'
});

module.exports = deviceModel

