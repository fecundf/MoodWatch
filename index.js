var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // create new FitbitApiClient object
  var FitbitApiClient = require('fitbit-node');
  // authenticate app to use Fitbit API, client is a global declared in app.js
  client = new FitbitApiClient("2282X4", "4425ec1dbcd9f8a60a884ee8288a5acb");
  res.redirect(client.getAuthorizeUrl(
    'activity heartrate location profile settings sleep weight',
    'https://api.scriptrapps.io/MoodWatch.js'));
});

module.exports = router;


