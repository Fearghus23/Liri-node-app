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
var args = process.argv;
var title = args[3];
var command = args[2];

console.log("Entered command: " + command);
console.log("Entered title: " + title);

switch (command) {
    case 'concert-this':
        concertThis(title);
        break;
    case 'spotify-this-song':
        spotifyThis(title);
        break;
    case 'movie-this':
        movieThis(title);
        break;
    case 'do-what-it-says':
        fs.readFile('./random.txt', 'utf8', function (error, data) {
            if (error) {
                return console.log(error);
            }
            var textCommand = data.split(",");
            var iCommand = textCommand[0];
            var iTitle;
            if (textCommand[1] !== undefined) {
                iTitle = textCommand[1].replace(/['"]+/g, '');
            }
            console.log("Text Command: " + iCommand);
            console.log("Text Title: " + iTitle);
            switch (iCommand) {
                case 'concert-this':
                    concertThis(iTitle);
                    break;
                case 'spotify-this-song':
                    spotifyThis(iTitle);
                    break;
                case 'movie-this':
                    movieThis(iTitle);
                    break;
                case 'do-what-it-says':
                    console.log("Keep from looping");
                    break;
                default:
                    console.log("Unknown command: " + iCommand);
            }
        });
}
function concertThis(artist) {
    if (artist !== undefined) {
        var query = artist.split(" ").join("+").split('.').join("");
        console.log("Query: " + query);
        axios.get("https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp")
            .then(function (response) {
                var concerts = response.data;
                console.log("Type of concerts: " + typeof concerts);
                if (typeof concerts === "object") {
                    if (concerts.length > 0) {
                        console.log("Concerts ==============");
                        concerts.forEach(function (concert, i) {
                            var venue = concert.venue;
                            console.log("CONCERT " + i + ":");
                            console.log("Venue: " + venue.name);
                            console.log("Location: " + venue.city + ", " + venue.region);
                            console.log("Date: " + moment(concert.datetime).format("MM/DD/YYYY"));
                            console.log("+++++");
                        });
                    } else {
                        console.log("No concerts found.");
                    }
                } else {
                    console.log("Artist not found.");
                }
                console.log("**********************");
            });
    }
}
function spotifyThis(title) {
    if (title === undefined) {
        title = 'ace of base';
    }
    spotify.search({ type: 'track', query: title, limit: 20 }, function (error, data) {
        if (error) {
            return console.log("Error occurred: " + error);
        }
        if (data.tracks.items.length > 0) {
            var track = data.tracks.items[0];
            var artistsObj = track.artists;
            var artists = [];
            artistsObj.forEach(function (artist) {
                if (artist.type === "artist") {
                    artists.push(artist.name);
                }
            });
            var song = track.name;
            var preview = track.preview_url;
            var album = track.album.name;
            console.log("Artists: " + artists.join(", "));
            console.log("Song Name: " + song);
            console.log("Preview Link: " + preview);
            console.log("Album: " + album);
            console.log("**********************");
        } else {
            console.log("Song not found");
        }
    });
}
function movieThis(title) {
    if (title === undefined) {
        title = 'Mr. Nobody';
    }
    var query = title.split(" ").join("+").split('.').join("");
    axios.get("http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy").
        then(function (response) {
            if (response.data.Error) {
                return console.log(response.data.Error);
            } else {
                console.log("Title: " + response.data.Title);
                console.log("Year: " + response.data.Year);
                console.log("IMDB Rating: " + response.data.imdbRating);
                var ratings = response.data.Ratings
                var tomatoRating = "N/A";
                if (typeof ratings === "object") {
                    for (key in ratings) {
                        var source = ratings[key].Source;
                        if (source === "Rotten Tomatoes") {
                            tomatoRating = ratings[key].Value;
                        }
                    }
                }
                console.log("Rotten Tomatoes Rating: " + tomatoRating);
                console.log("Country: " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
            }
            console.log("**********************");
        });
}