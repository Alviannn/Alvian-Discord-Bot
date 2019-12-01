const Discord = require('discord.js');
const Main = require('../Main.js');
const { Song } = require('../objects/Song.js');
const fs = require('fs');
const MusicHandler = require('../handler/MusicHandler.js');

module.exports = {
    name: "test",
    aliases: [],
    description: "",
    execute: async (message, args) => {
		if (!(message instanceof Discord.Message) || !Array.isArray(args)) {
            return;
        }
        if (message.member.user.id !== '217970261230747648') {
            return;
        }

        if (args.length === 0) {
            return message.reply("Invalid arguments!");
        }
        else {
            const result = MusicHandler.playMusic(new Song('', 'https://www.youtube.com/watch?v=lzsow8bnT3Y'), message);
            if (result instanceof Error) {
                message.channel.send("An error has occurred! \n\n" + result);
            }
        }
    }
};