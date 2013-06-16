Mongoose = require '../lib/mongo'
pureautoinc  = require('mongoose-pureautoinc');

AuthorizationCode = new Mongoose.Schema(
	id: Number
	token: { type: String, "default": '', trim: true }
	userID: { type: String, "default": '', trim: true }
	clientID: { type: String, "default": '', trim: true }
	redirectURI: { type: String, "default": '', trim: true }
	createdAt: { type: Date, "default": Date.now }
	lastModified: { type: Date, "default": Date.now }
)

authorizationCodeModel = Mongoose.client.model 'AuthorizationCode', AuthorizationCode

AuthorizationCode.plugin(pureautoinc.plugin, {
    model: 'AuthorizationCode',
    field: 'id'
});

module.exports = authorizationCodeModel

