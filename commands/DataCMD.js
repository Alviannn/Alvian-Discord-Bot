const Discord = require('discord.js');
const Main = require('../Main.js');
const fs = require('fs');

module.exports = {
    name: "data",
    aliases: [],
    description: "Checks the data of a file",
    execute: async (message, args) => {
		if (!(message instanceof Discord.Message) || !Array.isArray(args)) {
            return;
        }
        
        if (message.member.user.id !== "217970261230747648") {
            return message.reply("You don't have any access to do this!");
        }
        if (args.length === 0) {
            return message.reply("Usage: " + Main.prefix() + "data <path> \nExamples: " + Main.prefix() + "data ./servers.json");
        }
        
        const filePath = args[0] + "";
        if (!Main.fileExists(filePath)) {
            return message.reply("Cannot file path '" + filePath + "'!");
        }
        if (filePath.endsWith("/")) {
            filePath.substring(0, filePath.length - 1);
        }

        const splitArr = filePath.split(".");
        const fileType = splitArr[splitArr.length - 1];

        let content = null;
        try {
            const bufferData = fs.readFileSync(filePath, {encoding: 'utf8'});
            content = bufferData;
        } catch (error) {
            console.log(error);
        }

        if (!content) {
            return message.reply("Failed to read content of file!");
        }

        if (fileType === "json") {
            content = JSON.stringify(JSON.parse(content), null, 4);
        }

        message.channel.send("```" + fileType + "\n" + content + "\n```");
    }
};