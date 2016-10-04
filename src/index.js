/**
    2016 Joshua Caputo
    Generic Alexa Skill SDK

*/

'use strict';
var ScoreKeeper = require('./scoreKeeper');

exports.handler = function (event, context) {
    var scoreKeeper = new ScoreKeeper();
    scoreKeeper.execute(event, context);
};
