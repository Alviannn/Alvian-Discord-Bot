const Discord = require("discord.js");

module.exports = {
    name: "shutdown",
    disabled: true,
    aliases: ["end", "stop"],
    description: "Stops the bot (safely)",
    execute: async (message, args) => {
        if (!(message instanceof Discord.Message))
            return;

        if (!message.member.hasPermission("ADMINISTRATOR") && message.guild.ownerID !== message.author.id) {
            const embed = new Discord.RichEmbed();

            embed.setDescription("⚠ You don't have the permission to execute this! ⚠");
            embed.setColor("#f70000");
            embed.setThumbnail(message.author.displayAvatarURL);

            message.channel.sendMessage(embed).then(() => {
                if (message.deletable) 
                    message.delete(3000);
            });
        }

        message.reply('Shutting down...').then((msg) => msg.delete(3000));
        
        setTimeout(() => require("../Main.js").client().destroy(), 5000);
    }
};