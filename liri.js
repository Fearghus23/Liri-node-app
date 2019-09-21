require("dotenv").config();

// Import keys
var keys = require("./keys.js");

// Access Spotify keys
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

// Include axios package
var axios = require("axios");

// Include moment package
var moment = require('moment');

// Include fs package (internal to node)
var fs = require("fs");

// Command line arguments
var args = process.argv;

var command = args[2];
var title = args[3];
