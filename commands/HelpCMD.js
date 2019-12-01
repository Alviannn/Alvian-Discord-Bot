const Discord = require('discord.js');
const Main = require('../Main');

module.exports = {
    name: "help",
    aliases: ["helpme", "request"],
    description: "Shows the list of commands and its descriptions",
    execute: async (message, args) => {

		if (!(message instanceof Discord.Message) || !Array.isArray(args)) {
            return;
        }

        // message.reply("Sorry but there's no help command yet :3").then(msg => msg.delete(3000));

        const commands = Main.getCommandList();
        if (!(commands instanceof Discord.Collection)) {
            return;
        }

        const stringArray = new Array();
        const server = Main.getOrCreateServer(message.guild.id);
        commands.forEach((value, key, map) => {
             stringArray.push("● -- `" + server.prefix + key + "`" + (value.description ? " - _" + value.description + "_" : ""));
        });

        if (stringArray.length === 0) {
             return message.channel.send(new Discord.RichEmbed()
                .setTitle('Error!')
                .setColor('#ff0000')
                .setDescription('Failed to retrieve command list!')
                .setThumbnail(message.author.displayAvatarURL)
            );
        }
        else {
            return message.channel.send(new Discord.RichEmbed()
                  .setTitle('Information')
                  .setColor('#2fb1ff')
                 .setDescription('**Command List** \n ' + stringArray.join('\n'))
                 .setThumbnail('https://cdn2.iconfinder.com/data/icons/perfect-flat-icons-2/512/Info_information_user_about_card_button_symbol.png')
            );
        }
        
    }
};