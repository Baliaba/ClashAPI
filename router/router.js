var
	express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	conf = require('./../config/conf.js'),
	schemas = require('./../models/schemas.js'),
	queue = require('./../controllers/queueController.js');
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
				if (obj._id == clanTag){
					//res.json(obj.json);
				mongoose.model('player', schemas.playerSchema).find({clan : clanTag},(err, players) =>{
					
					players.forEach((p)=>{
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
			
					mongoose.model('battlelight', schemas.battleLightSchema).find({clan : clanTag},(err, battlelights) => {
					// obj.json.battles = battleLights.json;
					let data = {clan : obj.json , battlelight : battlelights }
					res.json(data);
				})
			 }
			})
			
		}
	});
});
router.get('/clan/players/:clantag', function (req, res) {
	mongoose.model('player', schemas.playerSchema).find((err, response) => {
		if (err) res.json('{ data : no datas }');
		else {
			let clanTag = req.params.clantag;
			let arrayPlayers = [];
			response.forEach((obj) => {
				if (obj.json.clan.tag == clanTag)
					arrayPlayers.push(obj);
			})
			res.json(arrayPlayers);
		}
	});
});

router.get('/player/:id', function (req, res) {
			mongoose.model('player', schemas.playerSchema).find({_id : id},(err, players) =>{
				if (err) res.json('{ data : no datas }');
				res.json(players);
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
	mongoose.model('historyplay', schemas.playerHistorySchema).find({clan : clanTag},(err, historyplays) => {
		if (err) res.json('{ data : no datas }');
		res.json(historyplays);
	});
});
router.get('/historyclans', function (req, res) {
	mongoose.model('historyclan', schemas.clanHistorySchema).find((err, historyclan) => {
		if (err) res.json('{ data : no datas }');
		else res.json(historyclan);
	});
});

router.get('/historyclan/:clantag', function (req, res) {
	let clanTag = req.params.clantag;
	mongoose.model('historyclan', schemas.clanHistorySchema).find({key : clanTag } , (err, response) => {
		if (err) res.json('{ data : no datas }');
		res.json(response);
	});
});
router.get('/battlelights', function (req, res) {
	mongoose.model('battlelight', schemas.battleLightSchema).find((err, battlelight) => {
		if (err) res.json('{ data : no datas }');
		else res.json(battlelight);
	});
});
router.get('/battles', function (req, res) {
	mongoose.model('battle', schemas.battleSchema).find((err, battles) => {
		if (err) res.json('{ data : no datas }');
		else res.json(battles);
	});
});
router.get('/cards', function (req, res) {
	mongoose.model('card', schemas.cardSchema).find((err, cards) => {
		if (err) res.json('{ data : no datas }');
		else res.json(cards);
	});
});

router.get('/queue/add/:clantag', function (req, res) {
	let clanTag = req.params.clantag;
	//res.json(clanTag)
	queue.addQueue(conf, clanTag).then((response) => {
		res.json(response);
	})
});

module.exports = {
	router
}
