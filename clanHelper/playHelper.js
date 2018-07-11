var mongoose = require('mongoose');
var conf = require('./../config/conf.js');
var _ = require('lodash');

function traitementPlayer(data, schemas) {
    var promise = new Promise((resolve, reject) => {
        // traitement des battles
        let clanTag = "";
        data.forEach((player) => {
            //player.battles = [];
            player.achievements = [];
            player.maj = Date.now();
            var HistoryPlay = mongoose.model('historyplay', schemas.playerHistorySchema);
            HistoryPlay.findOneAndUpdate({
                    _id: roundDate(player.maj)+"_"+player.tag
                }, {
                    _id: roundDate(player.maj)+"_"+player.tag,
                    key: player.tag,
                    json: player.trophies,
                    heure : roundDate(new Date().getTime()),
                    clan  : player.clan.tag
                }, {
                    upsert: true,
                    new: true,
                    runValidators: true
                },
                function (err, hist) {
                    if (err) {
                        console.log(err)
                    }
                }
            );
            player.cards = [];
            clanTag = player.clan.tag;
        })
        let objPlayers = _.keyBy(data, 'tag');
        var Player = mongoose.model('player',schemas.playerSchema);
        Object.keys(objPlayers)
            .forEach(function eachKey(key) {
                Player.findOneAndUpdate({
                        _id: key
                    }, {
                        _id: key,
                        clan :objPlayers[key].clan.tag, 
                        json: objPlayers[key]
                    }, {
                        upsert: true,
                        new: true,
                        runValidators: true
                    },
                    function (err, player) {
                        if (err) {
                            console.log(err)
                        }
                        
                    }
                );
            });

        let msg = "player was update on " + Date.now() + " ";
        resolve(msg);

    });
    return promise;
}

function roundDate(timeStamp) {
    timeStamp -= timeStamp % (60 * 60 * 1000); //subtract amount of time since midnight
    timeStamp += new Date().getTimezoneOffset() * 60 * 1000; //add on the timezone offset
    return timeStamp;
}

module.exports = {
    traitementPlayer
}