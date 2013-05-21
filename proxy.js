var request = require('request'),
var net = require('net'),
var TempoDBClient = require('tempodb').TempoDBClient;

var tempodb = new TempoDBClient(process.env.tempdb_api_key, process.env.tempdb_api_secret);