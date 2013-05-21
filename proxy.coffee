request = require 'request'
net = require 'net'
TempoDBClient = require('tempodb').TempoDBClient

tempodb = new TempoDBClient 'api-key', 'api-secret'

