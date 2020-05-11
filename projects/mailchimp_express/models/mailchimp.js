//jshint esversion:6
const https = require('https');
const md5 = require('md5');

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

var MailChimp = (function() {

  this.key = process.env.MAILCHIMP_API;
  this.listid = process.env.MAILCHIMP_LISTID;
  const url = `https://us8.api.mailchimp.com/3.0/lists/${this.listid}`;
  const options = {
    method: 'POST',
    auth: `user:${this.key}`
  };

  this.subscribe = function(vars) {
    console.log("MAILCHIMP subscribe() called with " + JSON.stringify(vars));

    const data = JSON.stringify({
      members: [{
        email_address: vars.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: vars.firstName,
          LNAME: vars.lastName
        },
        update_existing: vars.update_existing == 1
      }]
    });

    const req = https.request(url, options, res => {
      console.log(`statusCode: ${res.statusCode}\n`);
      console.log(`Options:\n${JSON.stringify(options)}\n`);
      console.log(`Data:\n${JSON.stringify(data)}\n`);

      var body = '';
      res.on('data', function(data) {
        body += data;
      });

      res.on('end', function() {
        console.log(`Response Body:\n${body}\n`);
      });
    });

    req.on('error', error => {
      console.log('Error: ' + error);
    });

    req.write(data);
    req.end();
    return 'Subscribed';
  };

  this.update = function(vars) {
    console.log("MAILCHIMP update() called with " + JSON.stringify(vars));

    const this_url = `https://us8.api.mailchimp.com/3.0/lists/${this.listid}/members/${md5(vars.email)}`;
    const this_options = {
      method: 'PATCH',
      auth: `user:${this.key}`
    };

    const data = JSON.stringify({
      status: vars.status
    });

    const req = https.request(this_url, this_options, res => {
      console.log(`statusCode: ${res.statusCode}\n`);
      console.log(`Options:\n${JSON.stringify(options)}\n`);
      console.log(`Data:\n${JSON.stringify(data)}\n`);

      var body = '';
      res.on('data', function(data) {
        body += data;
      });

      res.on('end', function() {
        console.log(`Response Body:\n${body}\n`);
      });
    });

    req.on('error', error => {
      console.log('Error: ' + error);
    });

    req.write(data);
    req.end();
    return `Status: ${vars.status}`;
  };

  console.log('Mailchimp API KEY is ', process.env.MAILCHIMP_API);
  return this;
})();

module.exports = MailChimp;
