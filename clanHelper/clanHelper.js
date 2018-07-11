var mongoose = require('mongoose');

var initClan = (Clandata, conf, schemas, key) => {
    var promise = new Promise((resolve, reject) => {
        let data = Clandata;
        let players = [];
        data.members.forEach(function (player) {
            players.push(player.tag);
        });

        players = players.toString()
        data.members = [];
        data.Maj = Date.now();
        let id = roundDate(data.maj);

        var historyClan = mongoose.model('historyclan', schemas.clanHistorySchema);
        var Clan = mongoose.model('clan', schemas.clanSchema);

        let rounddate = roundDate(new Date().getTime());
        historyClan.findOneAndUpdate({
                _id: rounddate+"_"+ data.tag 
            },
            {
            _id: rounddate+"_"+ data.tag,
            key: data.tag,
            score: data.score,
            heure : rounddate
        }
            , {
                upsert: true,
                new: true,
                runValidators: true
            },
            function (err, clan) {
                if (err) {
                    console.log(err)
                } else {
                   // console.log("HistoryClan #" + data.tag + " was updated");
                }
            }
        );

        var newClan = new Clan({
            _id: data.tag,
            json: data
        });
        Clan.findOneAndUpdate({
                _id: data.tag
            }, 
            {
                json: data
            }
            , {
                upsert: true,
                new: true,
                runValidators: true
            },
            function (err, clan) {
                if (err) console.log(err);          
                    //console.log("Clan was #"+ data.tag +" updated");
            }
        );

        resolve(conf.url_player + players);
    });
    return promise;
}

function roundDate(timeStamp) {
    timeStamp -= timeStamp % (60 * 60 * 1000); //subtract amount of time since midnight
    timeStamp += new Date().getTimezoneOffset() * 60 * 1000; //add on the timezone offset
    return timeStamp;
}
var exports = module.exports = {
    initClan
};