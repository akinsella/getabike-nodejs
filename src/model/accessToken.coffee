Mongoose = require '../lib/mongo'
pureautoinc  = require('mongoose-pureautoinc');

AccessToken = new Mongoose.Schema(
	id: Number
	token: { type: String, "default": '', trim: true }
	userID: { type: String, "default": '', trim: true }
	clientID: { type: String, "default": '', trim: true }
	createdAt: { type: Date, "default": Date.now }
	lastModified: { type: Date, "default": Date.now }
)

accessTokenModel = Mongoose.client.model 'AccessToken', AccessToken

AccessToken.plugin(pureautoinc.plugin, {
    model: 'AccessToken',
    field: 'id'
});

module.exports = accessTokenModel

