cf = require 'cloudfoundry'
underscore = require 'underscore'
_ = underscore._

if !cf.app

	LOCAL_CF_CONFIG =
		cloud: false,
		host: 'localhost',
		port: 9000,
		app:
			instance_id: '7bcc459686eda42a8d696b3b398ed6d1',
			instance_index: 0,
			name: 'getabike',
			uris: ['getabike.cloudfoundry.com'],
			users: ['alexis.kinsella@gmail.com'],
			version: '11ad1709af24f01286b2799bc90553454cdb96c6-1',
			start: '2012-08-29 00:09:39 +0000',
			runtime: 'node',
			state_timestamp: 1324796219,
			port: 9000,
			limits:
				fds: 256,
				mem: 134217728,
				disk: 2147483648
			host: 'localhost'
		services:
			'mongo-2.4': [
				name: 'getabike-mongodb',
				label: 'mongodb-2.4',
				plan: 'free',
				credentials:
					node_id: 'mongo_node_1',
					host: 'localhost',
					hostname: 'localhost',
					port: 27017,
#					password: 'Password123',
					name: 'getabike',
#					username: 'getabike'
				version: '2.4'
			]


	cf = _.extend(cf, LOCAL_CF_CONFIG)

mongoConfig = cf.services["mongo-2.4"][0]

module.exports =
	cf: cf,
	mongoConfig: mongoConfig

