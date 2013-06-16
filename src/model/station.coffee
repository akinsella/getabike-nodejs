Mongoose = require '../../lib/mongo'
pureautoinc  = require 'mongoose-pureautoinc'

Station = new Mongoose.Schema(
	id: Number
	number: { type: Number, index: true }
	name: { type: String, "default": '', trim: true }
	address: { type: String, "default": '', trim: true }
	postion: {
		lat: Number,
		lng: Number
	}
	banking: Boolean
	bonus: Boolean
	status: { type: String, "enum" : ['OPEN', 'CLOSED'] }
	contract_name: { type: String, "default": '', trim: true }
	bike_stands: Number
	available_bike_stands: Number
	available_bikes: Number
	last_update: Number
	createdAt: { type: Date, "default": Date.now }
)

stationModel = Mongoose.client.model 'Station', Station
Station.plugin pureautoinc.plugin,
    model: 'Station'
    field: 'id'

module.exports = stationModel

