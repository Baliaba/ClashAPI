var mongoose = require('mongoose');
var TraitementBattle = (data, conf, schemas,clanTag) => {
    var promise = new Promise((resolve, reject) => {
       //  console.log(data[0][0].type);
        var BattleL = mongoose.model('battlelight', schemas.battleLightSchema);
        var Battle = mongoose.model('battle', schemas.battleSchema);
        data.forEach((player) => {
            doStaff(player,conf,schemas,BattleL,Battle,clanTag);
        })
        let msg = " Battles was updated  on " + Date.now() + " Great job !";
        resolve(msg);
    });
    return promise;
}

function doStaff(player, conf, schemas ,BattleL,Battle,clanTag) {
    let battle = player
    let idBattle = battle.utcTime + '_' + battle.team[0].tag;
    battle.maj = Date.now();
    Battle.findOneAndUpdate({
            _id: idBattle
        }, {
            _id: idBattle,
            clan: clanTag,
            json: battle
        }, {
            upsert: true,
            new: true,
            runValidators: true
        },
        function (err, battle) {
            if (err) {
                console.log(err)
            }
        });
    battle.arena = {};
    battle.deckType = {};
//    battle.mode = {};
    battle.deckType = {};
    battle.opponent = {};
    battle.teamSize = {};
    var arrayTeam = [];
    var tabTag = [] ;
    battle.team.forEach((b) => {
        var clan = null;
        if (b.clan !== null) {
            clan = b.clan.tag;
        }
        arrayTeam.push({
            name: b.name,
            tag: b.tag,
            clan: clan
        });
        tabTag.push(b.tag);
    });
    var combo = false;
    if (arrayTeam.length === 2 && arrayTeam[0].clan === arrayTeam[1].clan) {
        combo = true;
    }
    battle.team = arrayTeam;
    battle.combo = combo;
    battle.idTeam = tabTag.sort().join('_');
    const resultat=battle.teamCrowns-battle.opponentCrowns
    BattleL.findOneAndUpdate({
            _id: idBattle
        }, {
            _id: idBattle,
            clan: clanTag,
            json: battle , 
            resultat : resultat,
            idTeam: battle.idTeam,
            tabTag : tabTag
        }, {
            upsert: true,
            new: true,
            runValidators: true
        },
        function (err, _light) {
            if (err) {
                console.log(err)
            }
        });
}
module.exports = {
    TraitementBattle
}
