const Discord = require('discord.js');
const Main = require('../Main.js');
const request = require('request');

module.exports = {
    name: "checkmc",
    aliases: [],
    description: "Shows the status of a specific minecraft server",
    execute: async (message, args) => {

		if (!(message instanceof Discord.Message) || !Array.isArray(args)) {
            return;
        }

        const server = Main.getOrCreateServer(message.guild.id);
        if (args.length == 0) {
            return message.channel.send(new Discord.RichEmbed()
                .setTitle("Usages")
                .setColor("#fcd701")
                .setThumbnail("https://images.vexels.com/media/users/3/152864/isolated/preview/2e095de08301a57890aad6898ad8ba4c-yellow-circle-question-mark-icon-by-vexels.png")
                .setDescription(
                    "● -- " + server.prefix + "checkmc <server IP>"
                )
            )
        }
        else {
            const address =  args[0].split(':');
            const addressName = address.join('-');
            let url = 'https://mcapi.us/server/status?ip=' + address[0];

            if (address.length === 2) {
                url += '&port=' + address[1];
            }

            request(url, async function (error, response, body) {
                if (error) {
                    return message.channel.send('An error has occurred! \n\n' + error);
                }

                const content = JSON.parse(body);

                if (args.length >= 2 && args[1].includes("raw")) {
                    delete content.motd_formatted;
                    delete content.favicon;
                    delete content.motd_extra;

                    message.channel.send('```json\n' + JSON.stringify(content, null, 4) + "\n```").catch(error => {
                        message.channel.send('Failed to send message! \n```\n' + error + '```');
                    });
                }
                else {                  
                    if (content['status'] === "error") {
                        if (content['error']) {
                            return message.channel.send("Failed to retrieve minecraft status! \n\n" + content['error']);
                        }
                        return message.channel.send("Failed to retrieve minecraft status!");
                    }

                    const imageData = content.favicon;
                    let attachment;

                    if (imageData) {
                        const buffer = Buffer.from(imageData.split(';base64,')[1], 'base64');
                        attachment = new Discord.Attachment(buffer, addressName + '.png');         
                    }
                    
                    // if (!fs.existsSync('./image-cache')) {
                    //     fs.mkdirSync('./image-cache');
                    // }
                    // fs.writeFileSync('./image-cache/' + args[0] + '.png', buffer);

                    const embed = new Discord.RichEmbed()
                        .setTitle("Minecraft Server Status")
                        .setColor(content.online ? "#04ff04" : "#ff0000")
                        .addField("IP Address", address.join(":"))
                        .addField("Status", content.online ? "ONLINE" : "OFFLINE")
                        .addField("Players", content["players"].now + " / " + content["players"].max)
                        .addField("Server", content["server"].name)
                        .addField("MOTD", content.motd);

                    if (attachment) {
                        embed.attachFile(attachment).setThumbnail("attachment://" + addressName + ".png")
                    }
                    else {
                        embed.setThumbnail("https://i.imgur.com/14COhR2.jpg");
                    }

                    message.channel.send(embed);
                }

            });
        }
    }
};