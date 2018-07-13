var qeueu = require('./../controllers/queueController.js');
var clanHelpers = require('./../clanHelper/clanHelper.js');
var callApi = require('./../services/callServices.js');
var warHelper = require('./../clanHelper/warHelper.js');
 getData = (conf, schemas,refresh,clanTag) => {
     var promise = new Promise((resolve, reject) => {
       if(!refresh){
            // call queueController to get url
            qeueu.getUrl(conf.database)
            .then((response) => {
                //console.log(response.url);
                promiseClan = callApi.callapi(response.url, conf.params);
                promiseWar = callApi.callapi(conf.url_clan+response.clan+"/war",conf.params);
                promiseWarlog = callApi.callapi(conf.url_clan+response.clan+"/warlog",conf.params);
                Promise.all([promiseClan,promiseWar,promiseWarlog])
                .then((resp) => {
                    console.log("-------RESP CLAN", resp[0])
                clanHelpers.initClan(resp[0], conf, schemas, response.key)
                    .then((urlPlay) => {
                        let data = {
                            urlPlay: urlPlay,
                            clanTag: response.clan,
                        }
                       console.log("--", resp[1].state );
                        if(resp[1].state !="notInWar" && resp[2].length > 0){
                            obj ={
                                war : resp[1],
                                warlog : resp[2]
                            }
                            warHelper.TraitementWar(obj,conf,schemas,response.clan)
                            .then(talk =>{
                               // console.log(talk);
                            })
                        }
                        resolve(data);
                    })
                    //.catch((err)=>{console.log("tratiement clan  Error ",err.message)})
                })
            }).catch((err)=>{console.log("Fetch queue Error",err.message)})
	console.log("Outside Then ")
       }else{
        promiseClan = callApi.callapi(conf.url_clan+clanTag, conf.params);
        promiseWar = callApi.callapi(conf.url_clan+clanTag+"/war",conf.params);
        promiseWarlog = callApi.callapi(conf.url_clan+clanTag+"/warlog",conf.params);
        Promise.all([promiseClan,promiseWar,promiseWarlog])
        .then((resp) => {
        clanHelpers.initClan(resp[0], conf, schemas, '')
            .then((urlPlay) => {
                let data = {
                    urlPlay: urlPlay,
                    clanTag: clanTag,
                    key    :''
                }
	    if(resp[1].state != "notInWar" && resp[2].length >0){
                obj ={
                    war : resp[1],
                    warlog : resp[2]
                }
                warHelper.TraitementWar(obj,conf,schemas,clanTag)
                    .then(talk =>{
                        console.log(talk);
                    })
		}
                resolve(data);
            }).catch((err)=>{console.log("tratiement clan  Error ",err.message)})
        })
       }   
     })
     return promise;
}



var exports = module.exports = {
    getData
};
