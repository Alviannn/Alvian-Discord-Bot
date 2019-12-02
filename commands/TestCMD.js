const Discord = require('discord.js');
const MusicHandler = require('../handlers/MusicHandler.js');

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
            const result = MusicHandler.playMusic(args[0] + "", message);
            if (result instanceof Error) {
                return message.channel.send("An error has occurred! \n\n" + result);
            }
            if (result !== true) {
                return message.channel.send("An error has occurred! \n\nFailed to retrieve results!");
            }
        }

    }
};