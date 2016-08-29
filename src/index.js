/**    
	Developed Aug 2016
	Author: @joshuacaputo ['http://be9concepts.com']
*/

/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
/**
 * OctoPrint KEY for the API
 */
var OCTO_KEY = '254B1CA2E1D948A88E56D43538189215'; //to find key look in OctoPrint's settings under API;
var OCTO_PATH = '174.22.231.46'; //path to OctoPrint's remote API. ['92.112.131:80/api/']

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/* Require HTTP connection for use */
var http = require('http');

/**
 * HelloWorld is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var HelloWorld = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
HelloWorld.prototype = Object.create(AlexaSkill.prototype);
HelloWorld.prototype.constructor = HelloWorld;

HelloWorld.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("HelloWorld onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

HelloWorld.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("HelloWorld onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "This is My Robo. You can send commands such as start, stop, and request the status of your Robo 3D printer.";
    var repromptText = "";
    response.ask(speechOutput, repromptText);
};

HelloWorld.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("HelloWorld onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

HelloWorld.prototype.intentHandlers = {
    // register custom intent handlers
    "PrintStatusIntent": function (intent, session, response) {
    	
    
    // Options and headers for the HTTP request   
/*    var options = {
        host: '97.117.178.133',
        path: '/api/printer',
        method: 'GET',
        headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': '254B1CA2E1D948A88E56D43538189215',
                 }
    };*/
        var options = {
        host: OCTO_PATH,
        path: '/api/printer',
        method: 'GET',
        headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': OCTO_KEY,
                 }
    };
    
    // Setup the HTTP request
    var req = http.request(options, function (res) {

        res.setEncoding('utf-8');
              
        // Collect response data as it comes back.
        var responseString = '';
        res.on('data', function (data) {
            responseString += data;
        });
        
        // Log the responce received from Twilio.
        // Or could use JSON.parse(responseString) here to get at individual properties.
        res.on('end', function () {
            console.log('Twilio Response: ' + responseString);
                    response.ask(responseString);
        });
    });
    
    // Handler for HTTP request errors.
    req.on('error', function (e) {
        console.error('HTTP error: ' + e.message);
    });
    
    // Send the HTTP request to the Twilio API.
    // Log the message we are sending to Twilio.
    console.log('Twilio API call: ' + 'responseString');
    req.write('responseString');
    req.end();

    },
    "StartPrintIntent": function (intent, session, response) {
    	
    
    // Options and headers for the HTTP request   
/*    var options = {
        host: '97.117.178.133',
        path: '/api/printer',
        method: 'GET',
        headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': '254B1CA2E1D948A88E56D43538189215',
                 }
    };*/
        var options = {
        host: OCTO_PATH,
        path: '/api/job',
        method: 'POST',
        headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': OCTO_KEY,
                 },
        body: {
        	'command': 'start',
        }
    };
    
    // Setup the HTTP request
    var req = http.request(options, function (res) {

        res.setEncoding('utf-8');
              
        // Collect response data as it comes back.
        var responseString = '';
        res.on('data', function (data) {
            responseString += data;
        });
        
        // Log the responce received from Twilio.
        // Or could use JSON.parse(responseString) here to get at individual properties.
        res.on('end', function () {
            console.log('Twilio Response: ' + responseString);
                    response.ask(responseString);
        });
    });
    
    // Handler for HTTP request errors.
    req.on('error', function (e) {
        console.error('HTTP error: ' + e.message);
    });
    
    // Send the HTTP request to the Twilio API.
    // Log the message we are sending to Twilio.
    console.log('Twilio API call: ' + 'responseString');
    req.write('responseString');
    req.end();

    },
    "StopPrintIntent": function (intent, session, response) {
    	
    
    // Options and headers for the HTTP request   
/*    var options = {
        host: '97.117.178.133',
        path: '/api/printer',
        method: 'GET',
        headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': '254B1CA2E1D948A88E56D43538189215',
                 }
    };*/
        var options = {
        host: OCTO_PATH,
        path: '/api/job',
        method: 'POST',
        headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': OCTO_KEY,
                 },
        body: {
        	'command': 'stop',
        }
    };
    
    // Setup the HTTP request
    var req = http.request(options, function (res) {

        res.setEncoding('utf-8');
              
        // Collect response data as it comes back.
        var responseString = '';
        res.on('data', function (data) {
            responseString += data;
        });
        
        // Log the responce received from Twilio.
        // Or could use JSON.parse(responseString) here to get at individual properties.
        res.on('end', function () {
            console.log('Twilio Response: ' + responseString);
                    response.ask(responseString);
        });
    });
    
    // Handler for HTTP request errors.
    req.on('error', function (e) {
        console.error('HTTP error: ' + e.message);
    });
    
    // Send the HTTP request to the Twilio API.
    // Log the message we are sending to Twilio.
    console.log('Twilio API call: ' + 'responseString');
    req.write('responseString');
    req.end();

    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("This is My Robo. You can send commands such as start, stop, and request the status of your Robo 3D printer.");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the HelloWorld skill.
    var helloWorld = new HelloWorld();
    helloWorld.execute(event, context);
};