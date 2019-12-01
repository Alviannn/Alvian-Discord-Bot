const Discord = require('discord.js');
const os = require('os');

module.exports = {
    name: "stats",
    aliases: ["serverstats", "stat", "statistics"],
    description: "Shows the bot server stats (system)",
    execute: async (message, args) => {

		if (!(message instanceof Discord.Message) || !Array.isArray(args)) {
            return;
        }

        const conversionNumber = 1024 * 1024;
        const memoryUsage = (os.totalmem() - os.freemem()) /conversionNumber;
        const totalMemory = os.totalmem() / conversionNumber;
        
        const embed = new Discord.RichEmbed()
            .setTitle("Bot Status (System)")
            .setThumbnail("https://cdn1.iconfinder.com/data/icons/spectrum-flat-network/30/network_connection-stats-512.png")
            .setColor("#ff8000")
            .addField("**Memory Usage**", memoryUsage.toFixed(0) + " MB / " + totalMemory.toFixed(0) + " MB")
            .addField("**CPU Model(s)**", os.cpus()[0].model)

        message.channel.send(embed);

        if (message.deletable) {
            message.delete(100);
        }
    }
};