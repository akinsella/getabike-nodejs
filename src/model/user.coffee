Mongoose = require '../lib/mongo'
pureautoinc  = require('mongoose-pureautoinc');

User = new Mongoose.Schema(
	id: Number
	email: { type: String, "default": '', trim: true }
	password: { type: String, "default": '', trim: true }
	firstName: { type: String, "default": '', trim: true }
	lastName: { type: String, "default": '', trim: true }
	googleId: { type: String, "default": '', trim: true }
	createdAt: { type: Date, "default": Date.now }
	lastModified: { type: Date, "default": Date.now }
)

userModel = Mongoose.client.model 'User', User

User.plugin(pureautoinc.plugin, {
    model: 'User',
    field: 'id'
});

module.exports = userModel

