// server.js
// make config file available
require('dotenv').config();

// load the modules
const express = require('express');
const request = require('request');
const helmet = require('helmet');
const hostValidation = require('host-validation');
const rateLimit = require('express-rate-limit');
const app = express();

// server options
const port = process.env.PORT || 3001

// add rate limiting
// app.enable("trust proxy"); // if already behind a reverse proxy
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20 // limit each IP to 20 requests per windowMs (5 minutes)
});
app.use(limiter); // apply to all requests

// configure hostValidation to only accept requests from a specific host () and referer
// if the following hosts/referers don't match the client, the request will be rejected
app.use(hostValidation({ hosts: ['127.0.0.1',
                                 `localhost:${port}`,
                                 'gavingreer.com', 
                                 /.*\.gavingreer\.com$/,
                                 'g4v.in', 
                                 /.*\.g4v\.in$/] })); //, referers: ['https://gavingreer.com/wx']

// user default helmet rules for added security 
app.use(helmet());

// server.js - set the route
app.get('/forecast/:lat,:long', (req,res) => {
  var dsURL = 'https://api.darksky.net/forecast/';
  var dsSecret = process.env.DARKSKY_SECRET;
  var dsSettings = '?exclude=minutely,hourly,daily,alerts,flags&units=auto';
  var url = dsURL + dsSecret + '/' + req.params.lat + ',' + req.params.long + dsSettings
  console.log(url)
  // send the request and direct the results back to the user
  req.pipe(request(url)).pipe(res);
});

// app starts a server and listens on port 3000 for connections
app.listen(port, () => console.log(`server ready and listening on port ${port}`));
