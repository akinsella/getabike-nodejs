Mongoose = require '../lib/mongo'

Station = new Mongoose.Schema(
	station: { type: Number, index: true }
	contract: Number
	bikes: Number
	stands: Number
	freeStands: Number
	createdAt: { type: Date, "default": Date.now }
)

stationModel = Mongoose.client.model 'Station', Station

module.exports = stationModel

