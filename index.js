var express = require('express');

/* GET home page. */
router.get('/', function(req, res, next) {
  // create new FitbitApiClient object
  var FitbitApiClient = require('fitbit-node');
  // authenticate app to use Fitbit API, client is a global declared in app.js
  client = new FitbitApiClient("2282XJ", "9b95c0621903b3bcfa7f63ecda863a5f");
  res.redirect(client.getAuthorizeUrl(
    'activity heartrate location profile settings sleep weight',
    'https://api.scriptrapps.io/MoodWatch.js'));
});


