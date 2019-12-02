const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const ytsearch = require('youtube-search');

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

        // starts searching the youtube title
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
     * @param url       the youtube url
     * @param message   the message instance
     * @returns         the result of playing the music (might get an error so use it wisely)
     */
    playMusic(url, message) {
        if (!(typeof url === 'string') || !(message instanceof Discord.Message)) {
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

        let finalResult = true;

        const asyncRetriever = function (error, info) {
            if (error) {
                return finalResult = error;
            }

            message.channel.send(info.title + " - " + info.video_url + " - " + info.video_id);
        }

        // gets the youtube info
        ytdl.getInfo(url, (error, info) => asyncRetriever(error, info));

        return finalResult;
    }
};
