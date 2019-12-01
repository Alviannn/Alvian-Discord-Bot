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
            const url = 'https://mcapi.us/server/status?ip=' + args[0];
            request(url, async function (error, response, body) {
                if (error) {
                    return console.log('An error has occurred! \n' + error);
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
                    const date = new Date();
                    date.setTime(Main.elapsed(content.duration));
                    
                    const imageData = content.favicon;
                    let attachment;

                    if (imageData) {
                        const buffer = Buffer.from(imageData.split(';base64,')[1], 'base64');
                        attachment = new Discord.Attachment(buffer, args[0] + '.png');         
                    }
                    
                    // if (!fs.existsSync('./image-cache')) {
                    //     fs.mkdirSync('./image-cache');
                    // }
                    // fs.writeFileSync('./image-cache/' + args[0] + '.png', buffer);

                    const embed = new Discord.RichEmbed()
                        .setTitle("Minecraft Server Status")
                        // .attachFile(attachment)
                        // .setColor("#9300c4")
                        // .setThumbnail("attachment://" + args[0] + ".png")
                        .setColor(content.online ? "#04ff04" : "#ff0000")
                        .addField("IP Address", args[0])
                        .addField("Status", content.online ? "ONLINE" : "OFFLINE")
                        .addField("Players", content["players"].now)

                    if (attachment) {
                        embed.attachFile(attachment).setThumbnail("attachment://" + args[0] + ".png")
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