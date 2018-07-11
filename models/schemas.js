var mongoose = require('mongoose');
var Schema = mongoose.Schema();

var playerSchema = new mongoose.Schema({
  _id: 'string',
  clan: 'string',
  json: 'mixed',
}, {
  _id: false,
  versionKey: false
});

var clanSchema = new mongoose.Schema({
  _id: 'string',
  json: 'mixed'
}, {
  _id: false,
  versionKey: false
});

var clanHistorySchema = new mongoose.Schema({
  _id: 'string',
  key: 'string',
  heure : 'string',
  score: 'number'
}, {
  _id: false,
  versionKey: false
});

var playerHistorySchema = new mongoose.Schema({
  _id: 'string',
  key: 'string',
  json: 'mixed',
  heure:'string',
  clan : 'string'
}, {
  _id: false,
  versionKey: false
});

var battleLightSchema = new mongoose.Schema({
  _id: 'string',
  clan:'string',
  json: 'mixed',
  resultat : 'string',
  idTeam: 'string',
  tabTag : 'mixed'
}, {
  _id: false,
  versionKey: false
});

var battleSchema = new mongoose.Schema({
  _id: 'string',
  clan: 'string',
  json: 'mixed'
}, {
  _id: false,
  versionKey: false
});

var cardSchema = new mongoose.Schema({
  _id: 'string',
  json: 'mixed'
}, {
  _id: false,
  versionKey: false
});
var warSchema = new mongoose.Schema({
  _id: 'string',
  json: 'mixed'
}, {
  _id: false,
  versionKey: false
});
var warLogSchema = new mongoose.Schema({
  _id: 'string',
  clan : 'mixed',
  json: 'mixed'
}, {
  _id: false,
  versionKey: false
});

module.exports = {
  clanHistorySchema,
  clanSchema,
  battleSchema,
  battleLightSchema,
  cardSchema,
  playerHistorySchema,
  playerSchema,
  warLogSchema,
  warSchema
};