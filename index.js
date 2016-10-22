var express = require('express');
var app = express();
//var heartbeat = require()

app.set('port', (process.env.PORT || 5000));

/* GET home page. */
app.get('/', function(req, res) {
  // create new FitbitApiClient object
  var FitbitApiClient = require('fitbit-node');
  // authenticate app to use Fitbit API, client is a global declared in app.js
  client = new FitbitApiClient("2282XJ", "9b95c0621903b3bcfa7f63ecda863a5f");
  res.redirect(client.getAuthorizeUrl(
    'activity heartrate location profile settings sleep weight',
    'https://api.scriptrapps.io/MoodWatch.js'));
});

// GET heartbeat info
/*app.get('/heartbeat', funtion(request, response) {
  response.send(heartbeat());
});*/

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
