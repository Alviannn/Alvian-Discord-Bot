const Discord = require('discord.js');
const request = require('request');

function changeKey(key) {
    const keyId = {
        'minecraft.net': 'Minecraft',
        'session.minecraft.net': 'Session',
        'account.mojang.com': 'Account',
        'authserver.mojang.com': 'Authentication Server',
        'sessionserver.mojang.com': 'Session Server',
        'api.mojang.com': 'Mojang API',
        'textures.minecraft.net': 'Minecraft Textures',
        'mojang.com': 'Mojang'
    };

    return keyId[key];
}

function changeValue(value) {
    const valueId = {
        green: 'No issues :green_circle:',
        yellow: 'There are some issues :yellow_circle:',
        red: 'Service is currently unavailable :red_circle:'
    }

    return valueId[value];
}

module.exports = {
    name: "mojang",
    aliases: ["mojangstats"],
    description: "Checks the status of mojang server",
    execute: async (message, args) => {
		if (!(message instanceof Discord.Message) || !Array.isArray(args)) {
            return;
        }
        
        request('https://status.mojang.com/check', function (error, response, body) {
            if (error) {
                return message.channel.send("An error has occurred! \n\n" + error);
            }

            if (!body) {
                return message.channel.send("Failed to read the body/content of Mojang Stats API!");
            }
            const content = JSON.parse(body);
            if (!content || !Array.isArray(content)) {
                return message.channel.send("Failed to read the body/content of Mojang Stats API!");
            }

            const statusMap = new Map();

            for (const value of content) {
                if (!value) {
                    continue;
                }

                const keys = Object.keys(value);
                keys.forEach(function (key) {
                    statusMap.set(key, value[key]);
                });
            }

            const embed = new Discord.RichEmbed()
                .setTitle("Mojang Status")
                .setThumbnail('https://vgboxart.com/resources/logo/3993_mojang-prev.png');

            // const stringBuilder = new Array();
            statusMap.forEach(function (value, key) {
                const validKey = changeKey(key);
                const validValue = changeValue(value);

                embed.addField("**" + validKey + "**", validValue);
                // stringBuilder.push("**" + validKey + "** " + validValue);
            });

            // embed.setDescription(stringBuilder.join("\n"));

            message.channel.send(embed);
        }); 
    }
};