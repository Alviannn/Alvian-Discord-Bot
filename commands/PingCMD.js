const Discord = require("discord.js");
const Main = require('../Main.js');

module.exports = {
    name: "ping",
    aliases: [],
    description: "Shows the ping status",
    execute: async (message, args) => {
        if (!(message instanceof Discord.Message))
            return;

        if (message.author.bot)
            return message.channel.sendMessage("A bot cannot execute this command!").then(message.delete(3000));

        message.channel.send("Pinging...").then((msg) => {
            msg.edit(
                'Pong!' +
                '\nLatency is ' + Math.floor(msg.createdAt - message.createdAt) +' ms' +
                '\nAPI Latency is ' + Math.round(Main.client().ping) + ' ms'
            );

            if (msg.deletable) {
                msg.delete(3000);
            }
            if (message.deletable) {
                message.delete();
            }
        });
	}

};