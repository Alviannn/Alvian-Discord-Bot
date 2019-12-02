const Discord = require('discord.js');
const Main = require('../Main.js');

/**
 * handles the stuff to do when the client is ready
 */
module.exports = {
    call: async function () {
		const client = Main.client();
        if (!(client instanceof Discord.Client)) {
            return;
		}
		
		client.on('ready', async () => {
            console.log('Discord bot has been started!');
        
            // console.log('It took ' + Main.elapsed(startTime) + ' ms to start!');
        
            client.user.setPresence({
                status: 'online',
                game: {
                    type: 'WATCHING',
                    name: 'NOTHING'
                }
            });
        });
        
    }
}