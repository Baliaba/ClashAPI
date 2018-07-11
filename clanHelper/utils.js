var _ = require('lodash');
// retourne le battle combo:true only
 const filtreCombo=(data)=>{
    return _.filter(data,(b)=>{
        b.json.team=_.orderBy(b.json.team,'tag', 'asc');
        return b.json.combo;
    })
}

// création des des groupe de combo avec un id basé sur player tag
 const groupBattleByTeam=(data)=>{
    return _.groupBy(data,(b)=>{
      //  b.resultat=b.json.teamCrowns-b.json.opponentCrowns //
        b = {...b, ...{resultat : b.json.teamCrowns-b.json.opponentCrowns},...{idTeam : b.json.team[0].tag+'_'+b.json.team[1].tag}} 
        // b.idTeam=b.json.team[0].tag+'_'+b.json.team[1].tag; 
        return b.idTeam
    });
}


 const calculWDL=(data)=>{
    let wdl={w:0, d:0, l:0};
    data.forEach(b => {
        if (b.resultat>0){
            wdl.w++;
        }else if(b.resultat===0){
            wdl.d++;
        }else{
            wdl.l++;
        }
    });
    return wdl;
}

 const groupBattleByType=(data)=>{
    return _.groupBy(data,(b)=>{
        let tabTag=[];
        b.json.team.forEach((t)=>{
            tabTag.push(t.tag)
        })
        b.tabTag=tabTag; //
        b.resultat=b.json.teamCrowns-b.json.opponentCrowns;//
        return b.json.type
    });
}

var exports = module.exports = {
    groupBattleByType, 
    calculWDL,
    groupBattleByTeam,
    filtreCombo
};
       