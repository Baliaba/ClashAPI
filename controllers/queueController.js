var myService = require('./../services/queueService.js');
var conf = require('./../config/conf.js');
function getUrl(database) {
  var promise = new Promise(function (resolve, reject) {
    myService.getQueue(database)
      .then((obj) => {
        var response = {
          url: conf.url_clan + obj._dataKey.clan,
          key: obj._key,
          clan: obj._dataKey.clan
        }
        resolve(response);

      })
      .catch(e => {
        console.log('queue controller failed', e.message);
      })
  })
  return promise;
}

var addQueue = (conf, clanTag) => {
  var promise = new Promise((resolve, reject) => {
    myService.addQueue(conf, clanTag);
    resolve(clanTag + "ajouté");
  })
  return promise;
}

var removeQueue = (conf, key , clanTag) => {
  var promise = new Promise((resolve, reject) => {
    myService.removeQueue(conf, key,clanTag);
    resolve("ok");
  })
  return promise;
}

var exports = module.exports = {
  getUrl,
  addQueue,
  removeQueue
};