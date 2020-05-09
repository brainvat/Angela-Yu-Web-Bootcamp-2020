//jshint esversion:6
const https = require('https');

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

var MailChimp = (function() {

  this.key = process.env.MAILCHIMP_API;
  const options = {
    hostname: 'apple.com',
    port: 443,
    path: '/nowhere',
    method: 'GET',
    headers: {
      'Authorization': 'Basic ' + new Buffer('user:' + this.key).toString('base64')
    }
  };

  this.subscribe = function(vars) {
    console.log("MAILCHIMP subscribe() called with " + JSON.stringify(vars));

    const req = https.request(options, res => {
      console.log(`statusCode: ${res.statusCode}`);

      var body = '';
      res.on('data', function(data) {
        body += data;
      });

      res.on('end', function() {
        console.log(`${req.method} ${req.baseUrl}`);
      })
    });

    req.on('error', error => {
      console.log('Error: ' + error);
    });

    req.end();
    return true;
  };

  console.log('Mailchimp API KEY is ', process.env.MAILCHIMP_API);
  return this;
})();

module.exports = MailChimp;
