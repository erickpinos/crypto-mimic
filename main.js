// Initialization Message
// TODO: replace with package info
console.log("---------------------------- \
  \nInitializing Crypto Mimic. \
  \nVersion 1.0.0 \
  \n----------------------------");

// Import Skills
var twitter = require('./skills/twitter');

// Import Avatars
var slack = require('./avatars/slack');

console.log("Running");

slack.runSlackAvatar();