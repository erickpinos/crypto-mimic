const SlackBot = require('slackbots');
const dotenv = require('dotenv')
dotenv.config()

var twit = require('twit');
var config = require('../config.js');

var Twitter = new twit(config);

const CoinMarketCap = require('coinmarketcap-api')

const apiKey = `${process.env.COINMARKETCAP_KEY}`;
const client = new CoinMarketCap(apiKey)

//client.getTickers().then(console.log).catch(console.error)
//client.getGlobal().then(console.log).catch(console.error)

var methods = {
	runSlackAvatar: function() {
		const bot = new SlackBot({
    		token: `${process.env.BOT_TOKEN}`,
		})

    var points = 0;

    bot.on('start', () => {
      bot.postMessageToChannel('general', 'Hello');
    })

    bot.on('error', (err) => {
      console.log(err);
    })

    bot.on('message', (data) => {
      if(data.type !== 'message') {
        return;
      }

      if(data.subtype !== 'bot_message') {
        handleMessage(data.text);
      }
    })
	
    function handleMessage(message) {
      if(message.includes('@UR2E3FWQ5')) {
        if(message.includes(' get tweets')) {
          var username = message.substring(25);
          console.log(username);
          bot.postMessageToChannel('general', username);
          getTweets(username);
        } else if(message.includes('add')) {
            points += 1;
            string = 'You now have ' + points;
            bot.postMessageToChannel('general', string);
        } else if(message.includes(' bitcoin')) {
          runBitcoin()
        } else if(message.includes(' post')) {
          runBitcoin()
        } else if(message.includes(' help')) {
          runHelp()
        }
      }
    }

    function tweet(message){ 
      Twitter.post('statuses/update', { status: message }, function(err, data, response) {
        console.log(data)
        bot.postMessageToChannel('general', data);
      })
    }

    function parseTweets(data) {

      var result = '';
      for(let i = 0; i < data.length; i++){
//        console.log(i);
//        console.log(data[i].text);
        result += ("\nTweet #" + i +
        "\nText: " + data[i].text + 
        "\nRetweets: " + data[i].retweet_count +
        "\nFavorites: " + data[i].favorite_count);
        console.log(result);
      }

      console.log(result);
      bot.postMessageToChannel('general', result);
    }

    function getTweets(data) {
      Twitter.get('statuses/user_timeline', { screen_name: data, count: 5 }, function(err, data, response) {
        parseTweets(data);
      })
    }

    function runBitcoin() {
      const rp = require('request-promise');
      const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
        qs: {
          'id': '1'
        },
        headers: {
          'X-CMC_PRO_API_KEY': `${process.env.COINMARKETCAP_KEY}`
        },
        json: true,
        gzip: true
      };
        rp(requestOptions).then(response => {
        console.log('API call response:', response.data[1].name);
        var price = response.data[1].quote["USD"].price;
        console.log(price);
//        bot.postMessageToChannel('general', response.data[1].name);
//        bot.postMessageToChannel('general', response.data[1].quote["USD"].price);
        var message = "The current Bitcoin price is " + price + " USD.";
        console.log(message);
        bot.postMessageToChannel('general', message);
        tweet(message);
      }).catch((err) => {
        console.log('API call error:', err.message);
        bot.postMessageToChannel('general', "got nothing");
      });
    }

    function runHelp(){
      post("_Commands_ \
      \n `get tweets @username` return a list of your most recent tweets \
      \n `help` shows this message")
    }

    function post(message) {
      bot.postMessageToChannel(
        'general',
        message,
        );
    }

    function runMessage(message) {
      const params = {
    //    icon_emoji: ':male-technologist:'
      }

      bot.postMessageToChannel('general', message,params);
    }

  }
}

module.exports = methods;
