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


 var OCTO_KEY = process.env.key
 var OCTO_PATH = process.env.path
 var OCTO_PORT = process.env.port
 var OCTO_NAME = process.env.name

/**
 * The AlexaSkill prototype and helper functions
 */

var AlexaSkill = require('./AlexaSkill');

/* Require HTTP connection for use */
var http = require('http');
var rp = require('request-promise');

// Closure
(function() {
  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (value === null || isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // If the value is negative...
    if (value < 0) {
      return -decimalAdjust(type, -value, exp);
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }
})();

// Clean up hours minutes seconds
function prettyDuration (seconds, flavor_text) {
  if (seconds < 3600) {
    if (Math.round10(seconds/60, -1) < 1) {
      return(seconds + " seconds are "+ flavor_text)
    } else if (Math.round(seconds/60) === 1) {
      return " one minute is " + flavor_text
    } else {
      return (Math.round10(seconds/60, -1) + " minutes are "+ flavor_text)
    }
  } else {
    if (Math.round(seconds/3600) === 1 ) {
      return " one hour is "+ flavor_text
    } else {
      return (Math.round10(seconds/3600, -1) + " hours are "+ flavor_text)
    }
  }
  return " an unknown amount of time is "
}

/**
 * OctoAlexa is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */

var OctoAlexa = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
OctoAlexa.prototype = Object.create(AlexaSkill.prototype);

OctoAlexa.prototype.constructor = OctoAlexa;

OctoAlexa.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("OctoAlexa onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

OctoAlexa.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("OctoAlexa onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "This is "+OCTO_NAME+". You can send commands such as start, stop, and request the status of your 3D printer.";
    var repromptText = "";
    response.ask(speechOutput, repromptText);
};

OctoAlexa.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("OctoAlexa onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

OctoAlexa.prototype.intentHandlers = {
    // register custom intent handlers
    "PrintStatusIntent": function (intent, session, response) {
        var options = {
            uri: OCTO_PATH + ':' + OCTO_PORT + '/api/printer',
            headers : {
                      'Content-Type': 'application/json',
                      'X-Api-Key':OCTO_KEY},
            json: true // Automatically parses the JSON string in the response
        }
        rp(options)
        .then(function(body) {
            response.tell(OCTO_NAME + " is now " + body.state.text);
        })
        .catch(function(err) {
            response.tell("err "+ err)
        })
    },
    "ExtruderTemperatureIntent": function (intent, session, response) {
        var options = {
            uri: OCTO_PATH + ':' + OCTO_PORT + '/api/printer',
            headers : {
                      'Content-Type': 'application/json',
                      'X-Api-Key': OCTO_KEY},
            json: true // Automatically parses the JSON string in the response
        }
        rp(options)
        .then(function(body) {
            response.tell(OCTO_NAME + " extruder temp is " + body.temperature.tool0.actual + "celsius. Extruder setpoint is" + body.temperature.tool0.target + "celsius");
        })
        .catch(function(err) {
            response.tell("err "+ err)
        })
    },
    "BedTemperatureIntent": function (intent, session, response) {
        var options = {
            uri: OCTO_PATH + ':' + OCTO_PORT + '/api/printer',
            headers : {
                      'Content-Type': 'application/json',
                      'X-Api-Key': OCTO_KEY},
            json: true // Automatically parses the JSON string in the response
        }
        rp(options)
        .then(function(body) {
          response.tell(OCTO_NAME + " bed temp is " + body.temperature.bed.actual + "celsius. Bed setpoint is " + body.temperature.bed.target + "celsius");
        })
        .catch(function(err) {
            response.tell("err "+ err)
        })
    },
    "TemperatureIntent": function (intent, session, response) {
        var options = {
            uri: OCTO_PATH+ ':' + OCTO_PORT + '/api/printer',
            headers : {
                      'Content-Type': 'application/json',
                      'X-Api-Key': OCTO_KEY},
            json: true // Automatically parses the JSON string in the response
        }
        rp(options)
        .then(function(body) {
          response.tell(OCTO_NAME + " bed temp is " + body.temperature.bed.actual + "celsius. Extruder temp is " + body.temperature.tool0.actual + "celsius");
        })
        .catch(function(err) {
            response.tell("err "+ err)
        })
    },
    "JobStatusIntent": function (intent, session, response) {
        var options = {
            uri: OCTO_PATH+ ':' + OCTO_PORT + '/api/job',
            headers : {
                      'Content-Type': 'application/json',
                      'X-Api-Key': OCTO_KEY },
            json: true // Automatically parses the JSON string in the response
        }
        rp(options)
        .then(function(body) {
          response.tell(OCTO_NAME + " is printing " + body.job.file.name.split('.')[0].replace(/_/g," ") + " and is " + Math.round10(body.progress.completion, -1) + " percent complete. " + prettyDuration(body.progress.printTime, " elapsed, and ") + prettyDuration(body.progress.printTimeLeft, " remaining."));
        })
        .catch(function(err) {
            response.tell("err "+ err)
        })
    },
    "StartPrintIntent": function (intent, session, response) {
    },
    "StopPrintIntent": function (intent, session, response) {
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.tell("This is Templeton" + OCTO_NAME + ". You can send commands such as start, stop, and request the status of your 3D printer. Get Rekt.");    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the OctoAlexa skill.
    var helloWorld = new OctoAlexa();
    helloWorld.execute(event, context);
};
