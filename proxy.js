var request = require('request'),
		net = require('net'),
		TempoDBClient = require('tempodb').TempoDBClient;

var tempodb = new TempoDBClient('api-key', 'api-secret');