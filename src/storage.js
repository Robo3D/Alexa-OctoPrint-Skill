/**
    2016 Joshua Caputo
    Manage DynamoDB

*/

'use strict';
var AWS = require("aws-sdk");

var storage = (function () {
    var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

    /*
     * The Game class stores all game states for the user
     */
    function Game(session, data) {
        if (data) {
            this.data = data;
        } else {
            this.data = {
                players: [],
                scores: {}
            };
        }
        this._session = session;
    }

    Game.prototype = {
        isEmptyScore: function () {
            //check if any one had non-zero score,
            //it can be used as an indication of whether the game has just started
            var allEmpty = true;
            var gameData = this.data;
            gameData.players.forEach(function (player) {
                if (gameData.scores[player] !== 0) {
                    allEmpty = false;
                }
            });
            return allEmpty;
        },
        save: function (callback) {
            this.gathered = {
                mfaKey: '123459',
                publicAddress: '123.456',
                privateAddress: '123.456',
                apiKey: '123.456'
            }
            //save the game states in the session,
            //so next time we can save a read from dynamoDB
            this._session.attributes.currentGame = this.data;
            dynamodb.putItem({
                TableName: 'ScoreKeeperUserData',
                Item: {
                    CustomerId: {
                        S: this._session.user.userId
                    },
                    Data: {
                        S: JSON.stringify(this.data)
                    },
                    Datb: {
                        S: JSON.stringify(this.gathered)
                    }
                }
            }, function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                }
                if (callback) {
                    callback();
                }
            });
        }
    };

    return {

        isAssociated: function (session, callback){
            dynamodb.getItem({
                TableName: 'ScoreKeeperUserData',
                ITEM: {
                    CustomerId: {
                        S: session.user.userId
                    }
                }
            }, function (err, data) {
                // work with the error
                 if ((err)||(data.Item === undefined)) {
                    if (err){
                        console.log(err);
                    }
                    callback(false);
                }
                else{ 

                // work with the data

                // collect the data
                
                callback(true);

                // callback the data to function operator
                
            }});
        },
        
        loadAuthData: function (session, callback) {
            dynamodb.getItem({
                TableName: 'authData2',
                Key: {
                    mfaKEY: {
                        S: session.attributes.code
                    }
                }
            }, function (err, data) {
                // work with the error
                 if ((err)||(data.Item === undefined)) {
                    if (err){
                        console.log(err);
                    }
                    callback('0');
                }
                else{ 

                // work with the data

                // collect the data
                var mfa_var = data.Item.mfaKEY;
                var dev_var = data.Item.deviceID;
                this.gathered = {
                    mfaKey: mfa_var,
                    deviceID: dev_var
                }
                //store the data in another database
                // (customerID, api_var, pub_var)
                // Alexa, I am {customerID}. Let me use {pub_var}/{api_var} to connect
                dynamodb.putItem({
                    TableName: 'ScoreKeeperUserData',
                    Item: {
                        CustomerId: {
                            S: session.user.userId
                        },
                        Data: {
                            S: JSON.stringify(this.gathered)
                        }
                    }
                }, function (err2, data2) {
                    if (err2) {
                        console.log(err2, err2.stack);
                    }
                    if (callback) {
                        callback('1');

                    }
                });



                // callback the data to function operator
                
            }});
        },
        loadGame: function (session, callback) {
            dynamodb.getItem({
                TableName: 'ScoreKeeperUserData',
                Key: {
                    CustomerId: {
                        S: session.user.userId
                    }
                }
            }, function (err, data) {
                // load game from database
                if ((err)||(data.Item === undefined)) {
                    if (err){
                        console.log(err);
                    }
                    // if no game create new game
                    callback(false);
                } else {
                    var userData = JSON.parse(data.Item.Data.S);
                    session.attributes.userData = userData;
                    callback(true, userData);
                }
            });
        },
        loadStatus: function (session, callback) {
            dynamodb.getItem({
                TableName: 'statusTable',
                Key: {
                    device: {
                        S: session.attributes.userData.deviceID.S
                    }
                }
            }, function (err, data) {
                // load game from database
                if ((err)||(data.Item === undefined)) {
                    if (err){
                        console.log(err);
                    }
                    // if no game create new game
                    callback(false);
                } else {
                    var userData = data.Item.status.S;
                    callback(true, userData);
                }
            });
        },
        postCommand: function (command, session, callback) {
            dynamodb.putItem({
                    TableName: 'commandTable',
                    Item: {
                        deviceID: {
                            S: session.attributes.userData.deviceID.S
                        },
                        command: {
                            S: command
                        }
                    }
                }, function (err2, data2) {
                    if (err2) {
                        console.log(err2, err2.stack);
                    }
                    if (callback) {
                        callback(command);

                    }
                });
        }
    };
})();
module.exports = storage;
