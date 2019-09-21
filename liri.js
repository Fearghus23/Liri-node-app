require("dotenv").config();

var keys = require('./keys.js');

var spotify = require ('node-spotify-api');
var request = require('request');
var moment = require ('moment');

var spotify = new spotify(keys.spotify);

var fs = require('fs');

var nodeArgs = process.argv;
console.log(process.argv);

var userInput = "";
var nextUserInput = "";

for (var i =3;i<nodeArgs.length;i++){
  if (i>3 && i<nodeArgs.length){
    userInput = userInput + '%20' + nodeArgs[i];
  }

else {
  userInput =+ nodeArgs[i];

}
console.log(userInput);
}