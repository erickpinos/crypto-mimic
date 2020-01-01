// Initialization Message
// TODO: replace with package info
console.log("---------------------------- \
  \nInitializing Crypto Mimic \
  \nVersion 1.0.0 \
  \n----------------------------");

console.log("Running");

// Imports
const SlackBot = require('slackbots');
const dotenv = require('dotenv')
const twit = require('twit');
const CoinMarketCap = require('coinmarketcap-api')

// Initialize .env using dotenv
dotenv.config()

// Create instances
const coinMarketCap = new CoinMarketCap(
	`${process.env.COINMARKETCAP_API_KEY}`
);

const twitterBot = new twit({
  consumer_key: `${process.env.TWITTER_CONSUMER_KEY}`,
  consumer_secret: `${process.env.TWITTER_CONSUMER_SECRET}`,
  access_token: `${process.env.TWITTER_ACCESS_TOKEN}`,
  access_token_secret: `${process.env.TWITTER_ACCESS_TOKEN_SECRET}`
});

const slackBot = new SlackBot({
 	token: `${process.env.SLACK_BOT_TOKEN}`,
})

// SlackBot variables
var points = 0;

// SlackBot methods
slackBot.on('start', () => {
	slackBot.postMessageToChannel('general', 'hello world');
})

slackBot.on('error', (err) => {
  console.log(err);
})

slackBot.on('message', (data) => {
	if(data.type !== 'message') {
  	return;
  }

  if(data.subtype !== 'bot_message') {
  	handleMessage(data.text);
  }
})

// SlackBot handle message
function handleMessage(message) {
	if(message.includes('')) { //TODO: Dynamically check for bot's name
  	if(message.includes(' get tweets')) {
  		runGetTweets(message);
    } else if(message.includes('add')) {
    	runAdd();
    } else if(message.includes(' get bitcoin price')) {
    	runGetBitcoinPrice()
    } else if(message.includes(' post bitcoin price')) {
    	runPostBitcoinPrice()
    } else if(message.includes(' help')) {
    	runHelp()
    }
  }
}

// Slackbot responses
function runHelp(){
	slackBot.postMessageToChannel('general', "_Commands_ \
  \n `get tweets @username` return a list of your most recent tweets \
  \n `add` adds 1 to the current list \
  \n `get bitcoin price` returns the current bitcoin price \
  \n `post bitcoin price` posts the current bitcoin price on Twitter \
  \n `help` shows this message")
}

function runAdd(){ 
	points += 1;
  response = 'You now have ' + points + ' points.';
  slackBot.postMessageToChannel('general', response);
}

function runGetTweets(message){
	var username = message.substring(25); //TODO: Dynamically pull twitter username
  console.log(username);
  response = 'Getting tweets for ' + username + '.';
  slackBot.postMessageToChannel('general', response);
  getTweets(username);
}

function runGetBitcoinPrice() {
	const rp = require('request-promise');
	const requestOptions = {
  	method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
    qs: {
    	'id': '1'
    },
    headers: {
    	'X-CMC_PRO_API_KEY': `${process.env.COINMARKETCAP_API_KEY}`
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
    slackBot.postMessageToChannel('general', message);
  }).catch((err) => {
  console.log('API call error:', err.message);
  slackBot.postMessageToChannel('general', "Couldn't return Bitcoin price.");
  });
}

function runPostBitcoinPrice() {
	const rp = require('request-promise');
	const requestOptions = {
  	method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
    qs: {
    	'id': '1'
    },
    headers: {
    	'X-CMC_PRO_API_KEY': `${process.env.COINMARKETCAP_API_KEY}`
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
    slackBot.postMessageToChannel('general', message);
    tweet(message);
  }).catch((err) => {
  console.log('API call error:', err.message);
  slackBot.postMessageToChannel('general', "Couldn't return Bitcoin price.");
  });
}

// SlackBot helper methods
function getTweets(data) {
	twitterBot.get('statuses/user_timeline', { screen_name: data, count: 5 }, function(err, data, response) {
  	parseTweets(data);
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
  slackBot.postMessageToChannel('general', result);
}

function tweet(message){ 
	twitterBot.post('statuses/update', { status: message }, function(err, data, response) {
  	console.log(data)
    slackBot.postMessageToChannel('general', data);
	})
}