utils = require '../lib/utils'
_ = require('underscore')._
fs = require 'fs'

cityArray = JSON.parse(fs.readFileSync("#{__dirname}/../data/city.json", "utf-8"))

cities = () ->
	cityArray

module.exports =
	cities: cities