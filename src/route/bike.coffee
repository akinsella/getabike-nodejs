utils = require '../lib/utils'
_ = require('underscore')._
fs = require 'fs'
cronJob = require('cron').CronJob
request = require 'request'
Station = require '../model/statistic/station'
City = require '../service/city'
API_KEY = process.env["JCDECAUX_KEY"]


# To be refactored
processRequest = (req, res, url, transform) ->
	options = utils.buildOptions req, res, url, 5 * 60, transform
	utils.processRequest options

job = new cronJob
	cronTime: '0 */1 * * * *'
	onTick: () ->
		contract = "Paris"
		city = _.chain(City.cities()).filter((city) -> city.contract == contract).head().value()
		fetchStations(contract, (err, stations) ->
			console.log "Fetching stations data ..."
			if (err)
				console.log "Got some error: #{err}"
			else
				stations = _(stations).map( (station)->
					{
						station: station.number,
						contract: city.id,
						bikes: station.available_bikes,
						stands: station.bike_stands,
						freeStands: station.available_bike_stands
					}
				)
				Station.create stations, (err) ->
					if (err)
						console.log "Got some error: #{err}"
					else
						console.log "Stations data stored with success"
		)
	start: false
	timeZone: "Europe/Paris"

job.start()

fetchStations = (contract, callback) ->
	url = "https://api.jcdecaux.com/vls/v1/stations?contract=#{contract}&apiKey=#{API_KEY}"
	request.get {url:url, json:true, headers:{"User-Agent":"getabike-nodejs"}}, (err, response, data) ->
		contentType = utils.getContentType(response)
		console.log "[" + url + "] Http Response - Content-Type: " + contentType
		console.log "[" + url + "] Http Response - Headers: ", response.headers

		if !utils.isContentTypeJsonOrScript(contentType)
			console.log "[" + url + "] Content-Type is not json or javascript: Not caching data and returning response directly"
			callback(err, undefined)
		else
			callback(undefined, data)

stations = (req, res) ->
	processRequest req, res, "https://api.jcdecaux.com/vls/v1/stations?contract=#{req.params.contract}&apiKey=#{API_KEY}", (data) ->
		data

cities = (req, res) ->
	options =
		req:req,
		res:res

	cities = City.cities()
	utils.responseData 200, "", cities, options


module.exports =
	cities: cities,
	stations : stations