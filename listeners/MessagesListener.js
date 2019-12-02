const Discord = require('discord.js');
const Main = require('../Main.js');
const fs = require('fs');

const CommandHandler = require('../handler/CommandHandler.js');
const commands = CommandHandler(fs.readdirSync("./commands/"));

Main.insertCommands(commands);

module.exports = {
    call: async function () {
		const client = Main.client();
        if (!(client instanceof Discord.Client)) {
            return;
		}
        
        client.on('message', async (message) => {
            const guildPrefix = Main.getOrCreateServer(message.guild.id).prefix;
            if (message.author.bot || !message.guild || !message.content.startsWith(guildPrefix)) {
                return;
            }
        
            const args = message.content.substring(guildPrefix.length).trim().split(' ');
            const cmd = args.shift().toLowerCase();
        
            const command = commands.get(cmd);
        
            if (command) {
                return command.execute(message, args);
            }
                
            commands.forEach(value => {
                if (value.aliases.includes(cmd)) {
                    return value.execute(message, args);
                }
            });
        });
    }
};