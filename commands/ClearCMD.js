const Discord = require('discord.js');
const Main = require('../Main.js');

module.exports = {
    name: "clear",
    aliases: [],
    description: "Clears the specified amount of messages (max: 100)",
    execute: async (message, args) => {
		if (!(message instanceof Discord.Message) || !Array.isArray(args)) {
            return;
        }

        const server = Main.getOrCreateServer(message.guild.id);
        if (args.length < 1) {
            return message.channel.send("Usage: " + server.prefix + "clear <messages count>");
        }

        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            const embed = new Discord.RichEmbed();

            embed.setDescription("⚠ You don't have the permission to execute this! ⚠");
            embed.setColor("#f70000");
            embed.setThumbnail(message.author.displayAvatarURL);

            return message.channel.sendMessage(embed).then((msg) => {
                if (msg.deletable) {
                    msg.delete(3000);
                }
            });
        }

        if (!Main.isNumber(args[0])) {
            return message.reply("The value must be number!");
        }

        let messageCount = parseInt(args[0]);

        message.channel.bulkDelete(messageCount, true).then(() => {
            message.channel.send(new Discord.RichEmbed()
                    .setTitle("🔵 Cleared Messages! 🔵")
                    .setThumbnail("https://cdn2.iconfinder.com/data/icons/silhouette-icon-1/512/clear-512.png")
                    .setColor("#00c2fb")
                    .setDescription(messageCount + " messages has been cleared!")
                    
          ).then((msg) => {
            if (msg.deletable) {
                 msg.delete(3000);
            }
         });

        }).catch((error) => message.reply("An error has occurred! \n" + "```\n" + error + "```").then(msg => {
            if (msg.deletable) {
                msg.delete(3000);
            }
        }));
        
    }
};