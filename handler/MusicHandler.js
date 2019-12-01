const Discord = require('discord.js');
const Main = require('../Main.js');
const ytdl = require('ytdl-core');
const ytsearch = require('youtube-search');

const { Song } = require('../objects/Song.js');
const youtubeKey = require('../config.json')['youtube-api-key'];

module.exports = {
    /**
     * searches a music and then plays it
     * 
     * @param title     the video title
     * @param message   the message instance
     * @returns         the result of playing the music (might get an error so use it wisely)
     */
    searchMusic(title, message) {
        if (!(message instanceof Discord.Message)) {
            return;
        }

        ytsearch(title, {key: youtubeKey, maxResults: 10}, function (error, result) {
            if (error) {
                return console.log("An error has occurred! \n" + error);
            }

            const array = [];
            result.forEach(function (value) {
                array.push(value.title + " - " + value.link);
            });

            message.channel.send(array.join('\n'));
        });
    },

    /**
     * plays a music
     * 
     * @param song      the song instance
     * @param message   the message instance
     * @returns         the result of playing the music (might get an error so use it wisely)
     */
    playMusic(song, message) {
        if (!(song instanceof Song) || !(message instanceof Discord.Message)) {
            return;
        }

        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) {
            return new Error("You have to be inside a voice channel first!");
        }

        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('SPEAK') || !permissions.has('CONNECT')) {
            return new Error("The bot doesn't have enough permission!");
        }

        if (message.guild.voiceConnection) {
            return new Error("The bot is already on a voice channel!");
        }

        ytdl.getInfo(song.url, function (error, info) {
            if (error) {
                message.channel.send("An error has occurred! \n\n" + error);
            }

            message.channel.send(info.title + " - " + info.video_url + " - " + info.baseUrl);
        });

        return true;
    }
};
