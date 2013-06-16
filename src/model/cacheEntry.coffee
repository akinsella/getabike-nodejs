Mongoose = require '../lib/mongo'
pureautoinc  = require('mongoose-pureautoinc');

CacheEntry = new Mongoose.Schema(
	id: Number
	key: { type: String, "default": '', trim: true }
	data: { type: String, "default": '', trim: false }
	ttl: Number
	createdAt: { type: Date, "default": Date.now }
	lastModified: { type: Date, "default": Date.now }
)

cacheEntryModel = Mongoose.client.model 'Cache', CacheEntry

CacheEntry.plugin(pureautoinc.plugin, {
    model: 'Cache',
    field: 'id'
});

module.exports = cacheEntryModel

