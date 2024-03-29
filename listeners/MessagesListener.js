const Discord = require('discord.js');
const Main = require('../Main.js');
const fs = require('fs');

const CommandHandler = require('../handlers/CommandHandler.js');
const commands = CommandHandler.handleCommands();

Main.insertCommands(commands);

module.exports = {
    call: async function () {
		const client = Main.client();
        if (!(client instanceof Discord.Client)) {
            return;
        }
        
        async function handle(message) {
            if (!(message instanceof Discord.Message)) {
                return;
            }

            const botMentioned = message.isMentioned(message.client.user);
            if (botMentioned) {
                const server = Main.getOrCreateServer(message.guild.id);

                return message.channel.send("This server prefix is `" + server.prefix + "`!");
            }

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
        }
        
        client.on('message', async (message) => handle(message));
    }
};