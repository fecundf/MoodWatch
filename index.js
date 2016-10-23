var express = require('express');
var app = express();
var client;
//var jsdom = require('jsdom') for smileys

app.set('port', (process.env.PORT || 5000));

var our_URI='http://localhost:5000';

/* GET home page. */
app.get('/', function(req, res) {
  // create new FitbitApiClient object
  var FitbitApiClient = require('fitbit-node');
  // authenticate app to use Fitbit API, client is a global declared in app.js
  client = new FitbitApiClient("2282XJ", "9b95c0621903b3bcfa7f63ecda863a5f");
  res.redirect(client.getAuthorizeUrl(
    'activity heartrate location profile settings sleep weight',
    our_URI+'/callback'));
});

// handle the callback from the Fitbit authorization flow
app.get("/callback", function (req, res) {
    // exchange the authorization code we just received for an access token
    client.getAccessToken(req.query.code, our_URI+'/callback').then(function (result) {
	var request = require("request");
    // use the access token to fetch the user's heart rate
    // var curtime=
	request.get("https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1sec/time/08:00/09:01.json",
		    { 'auth': { 'bearer': result.access_token } },
		    function(error, response, body) {
          console.log(body);

          var data=JSON.parse(body);
          var rate=data["activities-heart-intraday"]["dataset"][0]["value"];
          console.log('rate='+rate);
          if (rate >=130 && rate <=140 ) {
            res.send(":S") ;
        } else if (rate >140) {
            res.send( ":(");
        } else {
            res.send(":)");
        }
		    });

    }).catch(function (error) {
        res.send(error);
    });
});

//change smileys to nice once
/*
jsdom.env({
    html: "<p><code>jhhh</code><em>:)</em></p>",
    done: function(errors, window) {
        emojify.run(window.document.body)
    }
});
*/

// launch the server
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
