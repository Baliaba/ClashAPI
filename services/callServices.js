var fetch = require('node-fetch');

function callapi(link, param) {
  //console.log(link);
  var promise = new Promise((resolve, reject) => {
    fetch(link, param)
    .then(function(res) {
      return res.json();
    }).then(function(json) {
     resolve(json);
    })
    .catch(function(err) {
      console.log("err");
      resolve({error : "empty"})
    });
  });
  return promise;
}

var exports = module.exports = {
  callapi
}