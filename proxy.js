var http = require('http');
var qs = require('querystring');
var TempoDBClient = require('tempodb').TempoDBClient;

// Settings for TempoDB as ENV VARS
var tempodb = new TempoDBClient(process.env.tempodb_api_key, process.env.tempodb_api_secret);
var now = new Date();


// Create a series based on the event type
function createSeriesFromInput(input) {
	
	eventType = input.event;

	// Increment the value for our Event
	// A new series will be created if the event hasn't been seen before
	function performWrite(seriesKey){
		tempodb.increment_key(seriesKey, [{t: new Date(now.getTime()), v: 1}], function(result){
		  if (result.response === 200){
		  	console.log('Wrote new value for '+input.event);
		  }
		}); 
	}

	performWrite(eventType);

}

// Define the server and listen for incoming data as POST
http.createServer(function (req, res){
	
	// If out request is to the top level and is a POST
	if (req.url === '/' && req.method === 'POST'){
		var requestBody = '';

		// Grab all the incoming data and write it out to a var
		req.on('data', function(chunks){
			requestBody += chunks.toString();
		});

		// When we have all the data, respond to SendGrid so we don't get it again
		req.on('end', function(){
			res.writeHead(200, "OK", {'Content-Type': 'application/json'});
			var decodedRequestBody = qs.parse(requestBody);
			createSeriesFromInput(decodedRequestBody);
			res.end();
		});

	// If the request is for elsewhere or is not POST
	} else {
		console.log('Request not supported');
		res.writeHead(405, 'Method not supported', {'Content-Type': 'text/html'});
		res.end('<html><head><title>405 - Method not supported</title></head><body><h1>Method not supported.</h1></body></html>');
	}
}).listen(8080, function(){ console.log('Listening for SendGrid activity on port 8080')});

