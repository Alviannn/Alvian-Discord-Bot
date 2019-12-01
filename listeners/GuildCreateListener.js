const Discord = require('discord.js');
const Main = require('../Main.js');

/**
 * handles guild create event (on join)
 */
module.exports = {
    call: async function (client) {
        if (!(client instanceof Discord.Client)) {
            return;
        }

        client.on('guildCreate', function (guild) {
            const serverArray = [];
            client.guilds.forEach((guild) => {
                const server = Main.getOrCreateServer(guild.id);
                serverArray.push(server);
            });
    
            // confirms the guild existence
            let exists = false;
            for (const server in serverArray) {
                if (!(server instanceof Server)) {
                    continue;
                }
    
                if (server.guildId === guild.id) {
                    exists = true;
                    break;
                }
            }
    
            // adds the server if the server doesn't exist
            if (!exists) {
                serverArray.push(new Server(guild.id, prefix, 0));
            }
    
            Main.saveServers(serverArray);
        });
    }
}