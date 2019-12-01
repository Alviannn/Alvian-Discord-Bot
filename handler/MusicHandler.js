const Discord = require('discord.js');
const Main = require('../Main.js');
const ytdl = require('ytdl-core');
const ytsearch = require('youtube-search');

const { Song } = require('../objects/Song.js');
const youtubeKey = require('../config.json')['youtube-api-key'];

module.exports = {
    searchYouTube(string, message) {
        if (!(message instanceof Discord.Message)) {
            return;
        }

        ytsearch(string, {key: youtubeKey, maxResults: 10}, function (error, result) {
            if (error) {
                return console.log("An error has occurred! \n" + error);
            }

            const array = [];
            result.forEach(function (value) {
                array.push(value.title + " - " + value.link);
            });

            message.channel.send(array.join('\n'));
        });

        ytdl("", {filter: 'audioonly'})
    }
};
