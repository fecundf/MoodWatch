var express = require('express');
var app = express();
var client;

app.set('port', (process.env.PORT || 5000));

/* GET home page. */
app.get('/', function(req, res) {
  // create new FitbitApiClient object
  var FitbitApiClient = require('fitbit-node');
  // authenticate app to use Fitbit API, client is a global declared in app.js
  client = new FitbitApiClient("2282XJ", "9b95c0621903b3bcfa7f63ecda863a5f");
  res.redirect(client.getAuthorizeUrl(
    'activity heartrate location profile settings sleep weight',
    'https://secure-river-97770.herokuapp.com/callback'));
});

// handle the callback from the Fitbit authorization flow
app.get("/callback", function (req, res) {
    // exchange the authorization code we just received for an access token
    client.getAccessToken(req.query.code, 'https://secure-river-97770.herokuapp.com/callback').then(function (result) {
        // use the access token to fetch the user's profile information
        client.get("https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1sec/time/00:00/00:01.json", result.access_token).then(function (results) {
            res.send(results[0]);
        });
    }).catch(function (error) {
        res.send(error);
    });
});

// launch the server
//app.listen(3000);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
