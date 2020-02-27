// make config file available
require('dotenv').config();

// server.js - load the modules
const express = require('express');
const request = require('request');
const app = express();

// server.js - set the route
app.get('/forecast/:lat,:long', (req,res) => {
  // darksky url we will send the request to 
  var dsURL = 'https://api.darksky.net/forecast/';
  // define a variable pointing to our secret key
  var dsSecret = process.env.DARKSKY_SECRET;
  // additional darksky url parameters (these are optional)
  var dsSettings = '?exclude=minutely,hourly,daily,alerts,flags&units=auto';
  // build the full Darksky url
  var url = dsURL + dsSecret + '/' + req.params.lat + ',' + req.params.long + dsSettings
  // send the request and direct the results back to the user
  req.pipe(request(url)).pipe(res);
});
// server options
const port = process.env.PORT || 3001
// app starts a server and listens on port 3000 for connections
app.listen(port, () => console.log(`server ready and listening on port ${port}`));
