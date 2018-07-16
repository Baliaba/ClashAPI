///////////////////// FIREBASE Credentials 
var admin = require("firebase-admin");
var serviceAccount = require("./stats-cr-clan-firebase-adminsdk-frtl6-2777fcdae1.json");
var mongoose = require('mongoose');
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://stats-cr-clan.firebaseio.com"
});

///////////////////// CR_API_KEY											
const params = {
	method: 'GET',
	headers: {
		'auth' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzLCJpZGVuIjoiNDA2MDE5ODI4MTE0MTI4ODk2IiwibWQiOnsidXNlcm5hbWUiOiJ0cml6b21lIiwia2V5VmVyc2lvbiI6MywiZGlzY3JpbWluYXRvciI6IjQwNTUifSwidHMiOjE1MzA4ODk3MTIyOTl9.qVVv6uTe_TMGYS_NqX52XVU0TEmXrRz-zjRmVZVUpVw',
		'Content-Type': 'application/json'
	}
};
///////////////////// API_BASE_URL
const url_clan = 'https://api.royaleapi.com/clan/';
const url_player = 'https://api.royaleapi.com/player/';
const database = admin.database();

const db_params_dev = {
	_host: 'mongodb://localhost:27017/stats-cr-clan',
	_user: '',
	_password: '',
	_port: '',
	_db_name: 'stats-cr-clan'
}
const db_params_prod = {
	_host: 'http://sd-55264.dedibox.fr:',
	_user: 'pierre',
	_password: 'systraPierre',
	_port: '27017/',
	_db_name: 'stats-cr-clan'
}
const PORT = 80;
const options = {
	useMongoClient: true,
	reconnectTries: Number.MAX_VALUE,
	reconnectInterval: 500,
	poolSize: 10,
	bufferMaxEntries: 0
};
mongoose.set('debug', false);
var db = mongoose.connect(db_params_dev._host, options);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log("we are connected!")
});
 var freeOfBattlesCardsPath ="?exclude=battles,card,decks",
	 freeOfOpponent ="?exlude=opponent";
var exports = module.exports = {
	database,
	params,
	url_clan,
	url_player,
	db_params_dev,
	db_params_prod,
	PORT,
	db,
	freeOfBattlesCardsPath,
	freeOfOpponent
};
