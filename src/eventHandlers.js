/**
    2016 Joshua Caputo

*/

'use strict';
var storage = require('./storage'),
    textHelper = require('./textHelper');

var registerEventHandlers = function (eventHandlers, skillContext) {
    eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
        //if user said a one shot command that triggered an intent event,
        //it will start a new session, and then we should avoid speaking too many words.
        skillContext.needMoreHelp = false;
    };
    eventHandlers.onLaunch = function (launchRequest, session, response) {
        // Speak welcome message and ask user questions
        // based on whether there is a printer connected or not.
        var speechOutput = ' This is My Robo.', reprompt = 'This is My Robo.';
        
        // check if the user has a printer connected to their account
        storage.loadGame(session, function(isConnected, userData){
	    // User is connected to a printer
            if (isConnected){
                session.attributes.isConnected = true;
                speechOutput = speechOutput + ' You can send commands such as start, stop, and request the status of your Robo 3D printer.';
            }
	    // Otherwise prompt them to connect and begin setupIndex (intentHandlers.js)
            else {
                session.attributes.isConnected = false;
                speechOutput = speechOutput + ' It seems you haven\'t connected a printer yet. Would you like to connect one now?';
                session.attributes.setupIndex = 1;
            }
            response.ask(speechOutput, reprompt);
        });
    };
};
exports.register = registerEventHandlers;
