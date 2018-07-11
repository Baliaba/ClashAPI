var
	express = require('express'),
	app = express(),
	router = express.Router(),
	mongoose = require('mongoose'),
	conf = require('./config/conf.js'),
	schemas = require('./models/schemas.js'),
	loop = require('./actions/playActions'),
	queue = require('./controllers/queueController.js');
	service = require('./services/callServices.js');
router.use(function (req, res, next) {
	console.log('requette lancé... ');
	next();
});
router.get('/clan/:clantag', function (req, res) {
	mongoose.model('clan', schemas.clanSchema).find((err, response) => {
		if (err) res.json('{ data : no datas }');
		else {
			let clanTag = req.params.clantag;
			response.forEach((obj) => {
				if (obj._id == clanTag) {
					//res.json(obj.json);
					mongoose.model('player', schemas.playerSchema).find({
						clan: clanTag
					}, (err, players) => {
						players.forEach((p) => {
							let playerTmp = {};
							playerTmp.name = p.json.name;
							playerTmp.tag = p.json.tag;
							playerTmp.trophies = p.json.trophies;
							playerTmp.donations = p.json.clan.donations;
							playerTmp.donationsDelta = p.json.clan.donationsDelta;
							obj.json.members.push(playerTmp)
						})
						// res.json(obj.json);
					})

					mongoose.model('battlelight', schemas.battleLightSchema).find({
						clan: clanTag
					}, (err, battlelights) => {
						// obj.json.battles = battleLights.json;
						let data = {
							clan: obj.json,
							battlelight: battlelights
						}
						res.json(data);
					})
				}
			})

		}
	});
});
router.get('/clan/players/:clantag', function (req, res) {
	let clanTag = req.params.clantag;
	mongoose.model('player', schemas.playerSchema).find({
		clan: clanTag
	}, (err, response) => {
		if (err) res.json('{ data : no datas }');
		res.json(response);
	});
});

router.get('/player/:id', function (req, res) {
	let id = req.params.id;
	mongoose.model('player', schemas.playerSchema).find({
		_id: id
	}, (err, players) => {
		res.json(players[0]);
	});
});

router.get('/players', function (req, res) {
	mongoose.model('player', schemas.playerSchema).find((err, players) => {
		if (err) res.json('{ data : no datas }');
		else res.json(players);
	});
});
router.get('/clans', function (req, res) {
	mongoose.model('clan', schemas.clanSchema).find((err, clan) => {
		if (err) res.json('{ data : no datas }');
		else res.json(clan);
	});
});
router.get('/historyplays', function (req, res) {
	mongoose.model('historyplay', schemas.playerHistorySchema).find((err, historyplay) => {
		if (err) res.json('{ data : no datas }');
		else res.json(historyplay);
	});
});
router.get('/historyplay/:clanTag', function (req, res) {
	let clanTag = req.params.clanTag;
	mongoose.model('historyplay', schemas.playerHistorySchema).find({
		clan: clanTag
	}, (err, historyplays) => {
		if (err) res.json('{ data : no datas }');
		let result = [];
		historyplays.forEach((obj) => {
			let line = {
				'id': obj._id,
				'score': obj.json
			}
			result.push(line)
		})
		res.json(result);
	});
});

router.get('/historyplaySingle/:id', function (req, res) {
	let id = req.params.id;
	mongoose.model('historyplay', schemas.playerHistorySchema).find({
		key: id
	}, (err, historyplays) => {
		if (err) res.json('{ data : no datas }');


		let result = [];
		historyplays.forEach((obj) => {
			let line = {
				'heure': obj.heure,
				'score': obj.json
			}
			result.push(line)
		})
		res.json({
			"historyplays": result
		});
	});
});



router.get('/historyclan/:clantag', function (req, res) {
	let clanTag = req.params.clantag;
	mongoose.model('historyclan', schemas.clanHistorySchema).find({
		key: clanTag
	}, (err, response) => {
		if (err) res.json('{ data : no datas }');
		let result = [];
		response.forEach((obj) => {
			let line = {
				'id': obj._id,
				'score': obj.score
			}
			result.push(line)
		})
		res.json(result);
	});
});
router.get('/battlelights', function (req, res) {
	mongoose.model('battlelight', schemas.battleLightSchema).find((err, battlelight) => {
		if (err) res.json('{ data : no datas }');
		else res.json(battlelight);
	});
});
router.get('/battlelights/:clanTag', function (req, res) {
	let clanTag = req.params.clanTag;
	mongoose.model('battlelight', schemas.battleLightSchema).find({clan : clanTag}, (err, battlelights) => {
		if (err) res.json('{ data : no datas }');
		else{
		let data = {
			clan: clanTag,
			battlelight: battlelights
		}
		res.json(data);
	}
	})
});
router.get('/battles', function (req, res) {
	mongoose.model('battle', schemas.battleSchema).find((err, battles) => {
		if (err) res.json('{ data : no datas }');
		else res.json(battles);
	});
});
router.get('/battles/:clanTag', function (req, res) {
	let clanTag = req.params.clanTag;
	mongoose.model('battle', schemas.battleSchema).find({
		clan: clanTag
	}, (err, battles) => {
		if (err) res.json('{ data : no datas }');
		else res.json(battles);
	});
});
// router.get('/cards', function (req, res) {
// 	mongoose.model('card', schemas.cardSchema).find((err, cards) => {
// 		if (err) res.json('{ data : no datas }');
// 		else res.json(cards);
// 	});
// });

router.get('/queue/add/:clantag', function (req, res) {
	let clanTag = req.params.clantag;
	//res.json(clanTag)
	queue.addQueue(conf, clanTag).then((response) => {
		res.json(response);
	})
});

router.get('/new/:clanTag', async function (req, res) {
	let clanTag = req.params.clanTag;
	await loop.getData(conf, schemas,refresh=true,clanTag);
		queue.addQueue(conf, req.params.clanTag);
		conf.database.ref('history/' + req.params.clanTag).set({
			maj: Date.now()
		}).then(() => {
			res.json({
				'result': 'done',
				'code': 200
			});
		}).catch((err) => {
			res.json({
				'result': 'error',
				'code': 500
			});
		})
})
router.get('/refresh/:clanTag', async function (req, res) {
	let clanTag = req.params.clanTag;
	await loop.getData(conf, schemas,refresh=true,clanTag);
		conf.database.ref('history/' + clanTag).set({
			maj: Date.now()
		}).then(() => {
			res.json({
				'result': 'done',
				'code': 200
			});
		})
	
	//Rajouter la date de mise a jour coté firebase
});

router.get('/warlog/:clantag', function (req, res){ 
	let clanTag = req.params.clantag;
	mongoose.model('warlog', schemas.warLogSchema).find({
		clan: clanTag
	}, (err, warlogData) => {
		if (err) res.json('{ data : no datas }');
		let result = [];
		warlogData.forEach((obj) => {
			let line = {
				'date':  obj._id.split("_")[1],
				'warlog': obj.json
			}
			result.push(line)
		})
		res.json(result);
	});
});

router.get('/war/:clantag', function (req, res){ 
	let clanTag = req.params.clantag;
	mongoose.model('war', schemas.warSchema).find({
		clan: clanTag
	}, (err, warData) => {
		if (err) res.json('{ data : no datas }');
		let result = [];
		warData.forEach((obj) => {
			let line = {
				'date':  obj._id.split("_")[1],
				'war': obj.json
			}
				result.push(line)
		})
		if(result.length>1)
			res.json(result);
			res.json(result[0]);	
		});
});

// PARAM POUR AGGREGATE
const tabDelay={
	h24		:	86400,		// 24 heures
	days7	:	604800,		// 7 jours
	month1	:	2592000,	// 30 jours
	all		:	1500000000	// ALL	
};
var battlesModel = mongoose.model('battleLights', schemas.battleLightSchema);
//
//


// route pure query battletype (clan)
router.get('/battletype/:clantag/:delay', function (req, res){
	let dateActu=Date.now()/1000;
	let clanTag = req.params.clantag;
	let delay = req.params.delay;
	let  cursor = battlesModel.aggregate([
		{ $project:
			{
				"dateDiff": { "$subtract": [dateActu,"$json.utcTime"] },
				'clan' : 1,
				"json.winner" : 1,
				"json.type" : 1
			}
		},
		{ $match:
			{
				"clan":clanTag,
				"dateDiff": { "$lt": Number(tabDelay[delay])}
			}
		},
		{ $group :
			{
				_id	:	"$json.type",
				w	:	{ $sum: { $cond: [ { $gt: ["$json.winner", 0] }, 1, 0 ] } },
				l	:	{ $sum: { $cond: [ { $lt: ["$json.winner", 0] }, 1, 0 ] } },
				t	: { $sum: 1 }
			}
		}
	])
	.cursor()
	.exec()
	cursor.toArray(function(err, result){
		console.log('fini')
		res.json({result});
   });
});


// route pure query battletype_player (player)
router.get('/battletype_player/:playerid/:delay', function (req, res){
	let dateActu=Date.now()/1000;
	let playerid = req.params.playerid;
	let delay = req.params.delay;
	let  cursor = battlesModel.aggregate([
		{ $project:
			{
				"dateDiff": { "$subtract": [dateActu,"$json.utcTime"] },
				'tabTag' : 1,
				"json.winner" : 1,
				"json.type" : 1
			}
		},
		{ $match:
			{
				'tabTag' : playerid,
				"dateDiff": { "$lt": Number(tabDelay[delay])}
			}
		},
		{ $group :
			{
				_id	:	"$json.type",
				w	:	{ $sum : { $cond: [ { $gt: ["$json.winner", 0] }, 1, 0 ] } },
				l	:	{ $sum : { $cond: [ { $lt: ["$json.winner", 0] }, 1, 0 ] } },
				t: { $sum: 1 }
			}
		}
	])
	.cursor()
	.exec()
	cursor.toArray(function(err, result){
		console.log('fini')
		res.json({result});
   });
});


// route pure query combo (clan)
router.get('/combo/:clantag/:delay', function (req, res){
	let dateActu=Date.now()/1000;
	let delay = req.params.delay;
	let clanTag = req.params.clantag;
	let  cursor = battlesModel.aggregate([
		{ $project:
			{
				"dateDiff": { "$subtract": [dateActu,"$json.utcTime"] },
				'clan' : 1,
				"json.winner" : 1,
				"json.type" : 1,
				"json.combo":1,
				"idTeam":1,
				"tabTag":1
			}
		},
		{ $match:
			{
				"json.combo":true,
				"clan":clanTag,
				"dateDiff": { "$lt": Number(tabDelay[delay])}
			}
		},
		{ $group :
			{
				_id	: { idTeam: "$idTeam", tabTag: "$tabTag" },
				w	:	{ $sum : { $cond : [ { $gt: ["$json.winner", 0] }, 1, 0 ] } },
				l	:	{ $sum : { $cond : [ { $lt: ["$json.winner", 0] }, 1, 0 ] } },
				t	: { $sum: 1 }
			}
		}
	])
	.cursor()
	.exec()
	cursor.toArray(function(err, result){
		console.log('fini')
		res.json({result});
   });
});


// route pure query battlewarmode (clan)
router.get('/battlewarmode/:clantag/:delay', function (req, res){
	let dateActu=Date.now()/1000;
	let delay = req.params.delay;
	let clanTag = req.params.clantag;
	let  cursor = battlesModel.aggregate([
		{ $project:
			{
				"dateDiff": { "$subtract": [dateActu,"$json.utcTime"] },
				'clan' : 1,
				"json.winner" : 1,
				"json.type" : 1,
				"json.mode.name":1
			}
		},
		{ $match:
			{
				'json.type':'clanWarCollectionDay',
				'clan':clanTag,
				"dateDiff": { "$lt": Number(tabDelay[delay])}
			}
		},
		{ $group :
			{
				_id	:	"$json.mode.name",
				w	:	{ $sum: { $cond: [ { $gt: ["$json.winner", 0] }, 1, 0 ] } },
				l	:	{ $sum: { $cond: [ { $lt: ["$json.winner", 0] }, 1, 0 ] } },
				t	: { $sum: 1 }
			}
		}
	])
	.cursor()
	.exec()
	cursor.toArray(function(err, result){
		console.log('fini')
		res.json({result});
   });
});

// route pure query battlewarmode_player (player)
router.get('/battlewarmode_player/:playerid/:delay', function (req, res){
	let dateActu=Date.now()/1000;
	let delay = req.params.delay; 
	let playerid = req.params.playerid;
	let  cursor = battlesModel.aggregate([
		{ $project:
			{
				"dateDiff": { "$subtract": [dateActu,"$json.utcTime"] },
				"json.winner" : 1,
				"json.type" : 1,
				"tabTag":1,
				"json.mode.name":1
			}
		},
		{ $match:
			{
				'json.type':'clanWarCollectionDay',
				'tabTag' : playerid,
				"dateDiff": { "$lt": Number(tabDelay[delay])}
			}
		},
		{ $group :
			{
				_id	:	"$json.mode.name",
				w	:	{ $sum: { $cond: [ { $gt: ["$json.winner", 0] }, 1, 0 ] } },
				l	:	{ $sum: { $cond: [ { $lt: ["$json.winner", 0] }, 1, 0 ] } },
				t	: { $sum: 1 }
			}
		}
	])
	.cursor()
	.exec()
	cursor.toArray(function(err, result){
		console.log('fini')
		res.json({result});
   });
});


app.use('/api', router);
app.listen("443");
