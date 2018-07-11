var mongoose = require('mongoose');


var TraitementWar = (data, conf, schemas,clanTag) =>{

        var WarlogModel =  mongoose.model('warlog', schemas.warLogSchema);
        var WarModel =  mongoose.model('war', schemas.warSchema)
       
        var promise = new Promise((resolve, reject) => {
            warJob(data, conf,clanTag,WarlogModel,WarModel)
            let msg = " War was updated  on " + Date.now() + " Great job !";
        resolve(msg);
        })
        return promise;
}
var warJob = (data, conf,clanTag,WarlogModel,WarModel) => {
        data.warlog.forEach(war => {
            warlogStaff(war,clanTag,WarlogModel);
        });
            warStaff(data.war,clanTag,WarModel);
        
   
}
var warlogStaff = (war,clanTag,WarlogModel) => {
    let id  = clanTag+"_"+war.createdDate
    let jsonData  = {
        'participants' : war.participants,
        'standings' : war.standings,
        'seasonNumber' : war.seasonNumber
    }
    WarlogModel.findOneAndUpdate({
        _id: id
    }, 
    {
        _id: id,
        clan:clanTag,
        json: jsonData
    }
    , {
        upsert: true,
        new: true,
        runValidators: true
    },
    (err, clan) =>{
        if (err) console.log(err);          
            //console.log("Warlog was updated");
    }
);
}
var warStaff = (war,clanTag,WarModel) => {
    let id = "";
    if(war.state == "collectionDay"){
       id = clanTag
    }else{
        id = clanTag
    }

    let jsonData  = {
        'participants' : war.participants,
        'standings' : war.standings,
        'state' : war.state
    }
    WarModel.findOneAndUpdate({
        _id: id
    }, 
    {
        _id: id,
        json: jsonData
    }
    , {
        upsert: true,
        new: true,
        runValidators: true
    },
    (err, clan) =>{
        if (err) console.log(err);          
           // console.log("War was updated");
    }
);
} 

var exports = module.exports = {
    TraitementWar
};