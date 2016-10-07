/**
    2016 Joshua Caputo
    Manage Voice Interaction

*/
'use strict';
/* Require HTTP connection for use */
var http = require('http');
var textHelper = require('./textHelper'),
    storage = require('./storage');

var registerIntentHandlers = function(intentHandlers, skillContext) {

    intentHandlers.PrintStatusIntent = function(intent, session, response) {
        var speechOutput = '';
        if ((session.attributes.isConnected == false) || (session.attributes.isConnected == undefined)) {
            storage.loadGame(session, function(isConnected, userData) {
                if (isConnected) {
                    session.attributes.isConnected = true;
           // load status from dynamoDB
           storage.loadStatus(session, function(isConnected, userData) {
           response.ask(userData);
        });
                } else {
                    speechOutput = 'It seems you haven\'t connected a printer yet. Would you like to connect one now?';
                    session.attributes.setupIndex = 1;
                    response.ask(speechOutput);
                }
            });
        } 
        else {
        // load status from dynamoDB
        storage.loadStatus(session, function(isConnected, userData) {
        response.ask(userData);
            });  
        }
    }
    intentHandlers.StartPrintIntent = function(intent, session, response) {
        var speechOutput = '';
        if ((session.attributes.isConnected == false) || (session.attributes.isConnected == undefined)) {
            storage.loadGame(session, function(isConnected, userData) {
                if (isConnected) {
                    session.attributes.isConnected = true;
           // load status from dynamoDB
           storage.postCommand('start', session, function(userData) {
            response.ask(userData);
            });
                } else {
                    speechOutput = 'It seems you haven\'t connected a printer yet. Would you like to connect one now?';
                    session.attributes.setupIndex = 1;
                    response.ask(speechOutput);
                }
            });
        } 
        else {
        // load status from dynamoDB
        storage.postCommand('start', session, function(userData) {
            response.ask(userData);
            }); 
        }
    }
    intentHandlers.StopPrintIntent = function(intent, session, response) {
        var speechOutput = '';
        if ((session.attributes.isConnected == false) || (session.attributes.isConnected == undefined)) {
            storage.loadGame(session, function(isConnected, userData) {
                if (isConnected) {
                    session.attributes.isConnected = true;
           // load status from dynamoDB
            storage.postCommand('stop', session, function(userData) {
            response.ask(userData);
            }); 
                } else {
                    speechOutput = 'It seems you haven\'t connected a printer yet. Would you like to connect one now?';
                    session.attributes.setupIndex = 1;
                    response.ask(speechOutput);
                }
            });
        } 
        else {
        // load status from dynamoDB
        storage.postCommand('stop', session, function(userData) {
            response.ask(userData);
            });  
        }
    }
    intentHandlers.GetCodeIntent = function(intent, session, response) {

        // get code
        var code = intent.slots.code.value;
        if (code == undefined){
            code = 0;
        }
        code = code.toString();

        // check if code is 6 digits
        if (code.length != 6) {
            response.tell('the code you enetered: ' + code + " is not 6 digits!");
        } else {
            // check this code against the database in storage.js
            session.attributes.code = code;
            storage.loadAuthData(session, function(data) {
                var speechOutput = '';
                if (data == '0') {
                    speechOutput = 'This is not a valid code. Please check your OctoPrint plugin for the code.'
                } else if (data == '1') {
                    speechOutput = 'Your device has been successfully linked! You can send commands such as start, stop, and request the status of your Robo 3D printer.'
                }
                response.ask(speechOutput);
            });
        }
    }

    intentHandlers['AMAZON.HelpIntent'] = function(intent, session, response) {
        var speechOutput = textHelper.completeHelp;
        if (skillContext.needMoreHelp) {
            response.ask(textHelper.completeHelp + ' So, how can I help?', 'How can I help?');
        } else {
            response.tell(textHelper.completeHelp);
        }
    };

    intentHandlers['AMAZON.CancelIntent'] = function(intent, session, response) {
            response.tell('Okay. Bye.');
    };

    intentHandlers['AMAZON.StopIntent'] = function(intent, session, response) {
            response.tell('Okay. Bye.');
    };

    intentHandlers['AMAZON.NoIntent'] = function(intent, session, response) {
        if (session.attributes.setupIndex == 1) {
            response.tell('Okay. Bye.');
        }
    }

    intentHandlers['AMAZON.YesIntent'] = function(intent, session, response) {
        if (session.attributes.setupIndex == 1) {
            session.attributes.setupIndex = session.attributes.setupIndex + 1;
            response.ask('Okay. First, on your Robo 3D Printer install the Alexa Plugin. Once installed, say Ok.');
        } else if (session.attributes.setupIndex == 2) {
            session.attributes.setupIndex = session.attributes.setupIndex + 1;
            response.ask('Next open the Alexa Plugin and press "Authenticate". Once you have a code on your screen, you can say Ok.');
        } else if (session.attributes.setupIndex == 3) {
            session.attributes.setupIndex = session.attributes.setupIndex + 1;
            response.ask('Now, tell me the code by saying something like, "My Code Is: 1 2 3 4 5 6".');
        } else {
            response.ask('I am not sure what I am supposed to be helping you with ');
        }
    };
};
exports.register = registerIntentHandlers;