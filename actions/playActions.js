var qeueu = require('./../controllers/queueController.js');
var helpers = require('./../clanHelper/playHelper.js');
var callApi = require('./../services/callServices.js');
var clanAction = require('./../actions/clanActions.js');
var battleHelpers = require('./../clanHelper/battleHelper.js');

  getData = (conf,schemas,refresh,clanTag="") =>{
    // get players url after updated clans dats
    clanAction.getData(conf, schemas,refresh,clanTag)
    .then((obj) => {
	console.log(obj.urlPlay+conf.freeOfBattlesCardsPath)
        let playerPromise = callApi.callapi(obj.urlPlay+conf.freeOfBattlesCardsPath, conf.params);
        let battlePromise = callApi.callapi(obj.urlPlay+"/battles"+conf.freeOfOpponent,conf.params);
        Promise.all([playerPromise,battlePromise])
        .then((responses)=>{
                let playerData = responses[0];
                let battleData = responses[1];
		console.log( responses[0] , responses[1])
                //Traitements
                helpers.traitementPlayer(playerData, schemas).then((mg) => {
                    battleHelpers.TraitementBattle(battleData,conf,schemas,obj.clanTag)
                    .then((msg)=>{
                        // console.log(playerData)
                        if(!refresh){
                            qeueu.removeQueue(conf,obj.key,obj.clanTag);
                        }
                      })
                      //.catch((err)=>{console.log("err battles --",err.message)})
                })
                //.catch((err)=>{console.log("err play --",err.message)})
        })
	console.log("Outside PromiseAll battlePlay")
    })
}

var exports = module.exports = {
    getData 
};
