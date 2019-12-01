const Discord = require('discord.js');
const Main = require('../Main.js');

/**
 * handles guild delete event
 */
module.exports = {
    call: async function (client) {
        if (!(client instanceof Discord.Client)) {
            return;
		}
		
		client.on('guildDelete', function (guild) {
			const serverArray = [];

			client.guilds.forEach(function (tempGuild) {
				if (guild.id !== tempGuild.id) {
					const server = Main.getOrCreateServer(tempGuild.id);
					serverArray.push(server);
				}
			});

			Main.saveServers(serverArray);
		});
        
    }
}