var express = require('express');
var session = require('express-session');
var app = express();
var client;

app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(session({ secret: 'MWaaah', cookie: { maxAge: 60000 }}))

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
    var sess = req.session; // Need to store last time we requested heartreate in session

    // exchange the authorization code we just received for an access token
    client.getAccessToken(req.query.code, our_URI+'/callback').then(function (result) {
        var request = require("request");

        var previous_time = sess.previous_time ? sess.previous_time : '12:30';
	
        request.get("https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1sec/time/" + previous_time + "/23:59:59.json",
                    { 'auth': { 'bearer': result.access_token } },
      function(error, response, body) {
          console.log(body);

	  // Read through all heartrates- get latest time and highest rate
          var data=JSON.parse(body);
	  var d=data["activities-heart-intraday"]["dataset"];
          var rate=0;
	  var r;
	  for (var i=0;i<d.length;i++) {
	      r=d[i];
	      if (r["value"] > rate) rate = r["value"];
	  }

	  // If we read anything, then r will be the last record. Get its time.
	  if (r) sess.previous_time = r["time"].substr(0,5);
	  
          console.log('max rate='+rate+' between '+previous_time+' and '+sess.previous_time);
          var face;
          if (rate >=130 && rate <=140 ) {
              // res.send(":S") ;
                  face = 'uhoh.png';
          } else if (rate >140) {
              // res.send( ":(");
                 face = 'frown.png';
          } else {
              // res.send(":)");
              face = 'smile.jpg'
          }
          res.render('index', {face: face})
      });

    }).catch(function (error) {
        res.send(error);
    });
});

// launch the server
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
