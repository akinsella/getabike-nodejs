Mongoose = require '../lib/mongo'
pureautoinc  = require('mongoose-pureautoinc');

Notification = new Mongoose.Schema(
  id: Number
  message: { type : String, "default" : '', trim : true }
)

notificationModel = Mongoose.client.model 'Notification', Notification

Notification.plugin(pureautoinc.plugin, {
    model: 'Notification',
    field: 'id'
});

module.exports = notificationModel

