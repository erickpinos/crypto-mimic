var twit = require('twit');
var config = require('../config.js');

var Twitter = new twit(config);

var methods = {
  getTweets: function(message, callback) {
    Twitter.get('statuses/user_timeline', { screen_name: 'erickpinos', count: 2 }, function(err, data, response) {
      console.log(data);
      callback(data);
    })
  }
}

module.exports = methods;