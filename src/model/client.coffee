Mongoose = require '../lib/mongo'
pureautoinc  = require('mongoose-pureautoinc');

Client = new Mongoose.Schema(
	id: Number
	name: { type: String, "default": '', trim: true }
	clientId: { type: String, "default": '', trim: true }
	clientSecret: { type: String, "default": '', trim: true }
	createdAt: { type: Date, "default": Date.now }
	lastModified: { type: Date, "default": Date.now }
)

clientModel = Mongoose.client.model 'Client', Client

Client.plugin(pureautoinc.plugin, {
    model: 'Client',
    field: 'id'
});

module.exports = clientModel

