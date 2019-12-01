const Discord = require('discord.js');
const Main = require('../Main.js');

module.exports = {
    name: "server",
    aliases: [],
    description: "Bot settings for the current server (guild)",
    execute: async (message, args) => {
		if (!(message instanceof Discord.Message) || !Array.isArray(args)) {
            return;
        }

        if (!message.member.hasPermission("ADMINISTRATOR")) {
            const embed = new Discord.RichEmbed();

            embed.setDescription("⚠ You don't have the permission to execute this! ⚠");
            embed.setColor("#f70000");
            embed.setThumbnail(message.author.displayAvatarURL);

            return message.channel.sendMessage(embed).then((msg) => {
                if (msg.deletable) {
                    msg.delete(3000);
                }
            });
        }

        const server = Main.getOrCreateServer(message.guild.id);

        if (args.length == 0) {
            return message.channel.send(new Discord.RichEmbed()
                .setColor("#fcd701")
                .setThumbnail("https://images.vexels.com/media/users/3/152864/isolated/preview/2e095de08301a57890aad6898ad8ba4c-yellow-circle-question-mark-icon-by-vexels.png")
                .setDescription(
                    "● -- " + server.prefix + "server prefix [<prefix>] \n" +
                    "● -- " + server.prefix + "server modchannel [<channel id>] \n" +
                    "● -- " + server.prefix + "server modthischannel \n"
                )
                .setTitle("Usages")
            )
        }

        switch (args[0]) {
            case "prefix": {
                if (args.length < 2) {
                    return message.channel.send(new Discord.RichEmbed()
                        .setTitle("Prefix")
                        .setThumbnail("https://cdn2.iconfinder.com/data/icons/perfect-flat-icons-2/512/Info_information_user_about_card_button_symbol.png")
                        .setColor("#2fb1ff")
                        .addField("**Default prefix**", Main.prefix())
                        .addField("**Current prefix**", server.prefix)
                    );
                }
                else {
                    const oldPrefix = server.prefix;
                    const newPrefix = args[1];

                    server.prefix = args[1];
                    Main.saveServers([server]);

                    return message.channel.send(new Discord.RichEmbed()
                        .setTitle("Prefix")
                        .setThumbnail("https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/check-circle-green-512.png")
                        .setColor("#0fff09")
                        .addField("**Previous prefix**", oldPrefix)
                        .addField("**New prefix**", newPrefix)
                        .setFooter("Executor: " + message.member.user.username)
                    );
                }
            }
            case "modchannel": {
                if (args.length < 2) {
                    return message.channel.send(new Discord.RichEmbed()
                        .setTitle("Mod Channel")
                        .setThumbnail("https://cdn2.iconfinder.com/data/icons/perfect-flat-icons-2/512/Info_information_user_about_card_button_symbol.png")
                        .setColor("#2fb1ff")
                        .addField("**Mod Channel ID**", server.modChannelId)
                    )
                }
                else {
                    if (!Main.isNumber(args[1])) {
                        return message.reply("Value must be number!").then(msg => msg.delete(3000));
                    }

                    const oldChannel = server.modChannelId;
                    const newChannel = parseInt(args[1]);

                    const guild = message.guild;

                    guild.channels.forEach((channel) => {
                        if (channel.id === newChannel) {
                            server.modChannelId = newChannel;
                            Main.saveServers([server]);

                            return message.channel.send(new Discord.RichEmbed()
                                .setTitle("Mod Channel")
                                .setThumbnail("https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/check-circle-green-512.png")
                                .setColor("#0fff09")
                                .addField("**Previous mod channel ID**", oldChannel)
                                .addField("**New mod channel ID**", newChannel)
                            )
                        }
                    });

                    return message.channel.send(new Discord.RichEmbed()
                        .setTitle("Mod Channel")
                        .setThumbnail("https://cdn4.iconfinder.com/data/icons/user-needs-10/26/45_false_delete_remove_cross_wrong-512.png")
                        .setColor("#fb0000")
                        .setDescription("Cannot find any channels with that ID!")
                    )
                }
            }
            case "modthischannel": {
                server.modChannelId = message.channel.id;
                Main.saveServers([server]);

                return message.channel.send(new Discord.RichEmbed()
                    .setTitle("Mod Channel")
                    .setThumbnail("https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/check-circle-green-512.png")
                    .setColor("#0fff09")
                    .setDescription("This channel has been set as the mod channel! \n(Channel ID: " + message.channel.id + ")")
                )
            }
            case "resetmodchannel": {
                server.modChannelId = 0;
                Main.saveServers([server]);

                return message.channel.send(new Discord.RichEmbed()
                    .setTitle("Mod Channel")
                    .setThumbnail("https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/check-circle-green-512.png")
                    .setColor("#0fff09")
                    .setDescription("Mod channel ID has been cleared!")
                )
            }
            default: {
                return message.channel.send(new Discord.RichEmbed()
                    .setColor("#fcd701")
                    .setThumbnail("https://images.vexels.com/media/users/3/152864/isolated/preview/2e095de08301a57890aad6898ad8ba4c-yellow-circle-question-mark-icon-by-vexels.png")
                    .setDescription(
                        "● -- " + server.prefix + "server prefix [<prefix>] \n" +
                        "● -- " + server.prefix + "server modchannel [<channel id>] \n" +
                        "● -- " + server.prefix + "server modthischannel \n"
                    )
                    .setTitle("Usages")
                )
            }
        }
    }
};