const Discord = require("discord.js");
const Main = require('../Main.js');

function findMember(message, name) {
	if (!(message instanceof Discord.Message)) {
		return null;
	}

	const members = message.guild.members.values();

	while (true) {
		const result = members.next();
		const member = result.value;

		if (member instanceof Discord.GuildMember) {
			if (member.displayName === name || member.user.username === name) {
				return member;
			}
		}

		if (result.done) {
			return null;
		}
	}
}

module.exports = {
    name: "report",
	aliases: [],
	description: "Reports a user and logs it to the mod channel or the current channel",
    execute: async (message, args) => {
		if (!(message instanceof Discord.Message) || !Array.isArray(args)) {
			return;
		}

		const server = Main.getOrCreateServer(message.guild.id);
		if (args.length < 2) {
			return message.channel.send("Usage: " + server.prefix + "report <name> <reason>");
		}

        let reportedUser = message.guild.member(message.mentions.users.first());

		if (!reportedUser) {
			reportedUser = message.guild.members.get(args[0]);
		}
		if (!reportedUser) {
			reportedUser = findMember(message, args[0]);
		}
		if (!reportedUser) {
            return message.channel.send('Cannot find that user!');
		}

        if (reportedUser.user.bot) {
            return message.channel.send('You cannot report a bot bruh!');
        }

		const reason = args.join(' ').substring(args[0].length + 1);
		const reportEmbed = new Discord.RichEmbed()
			.setTitle('🔴 Reports 🔴')
			.setColor("#ff0909")
			// .setThumbnail("https://cdn2.iconfinder.com/data/icons/mix-color-5/100/Mix_color_5__info-512.png")
			.setThumbnail("https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-and-lines-1/2/63-512.png")
			.addField('**Reported user**', reportedUser.displayName + ' `[ID: ' + reportedUser.id + ']`')
			.addField('**Reported by**', message.member.displayName + ' `[ID: ' + message.member.id + ']`')
			.addField('**Reason**', reason)
			.addField('**Time**', Main.formatDate(message.createdAt))
			.addField('**Channel**', message.channel.name);

		const iterable = message.guild.channels.values();
		while (true) {
			const result = iterable.next();
			const channel = result.value;

			if (channel instanceof Discord.GuildChannel && channel.id === server.modChannelId) {
				return channel.send(reportEmbed);
			}

			if (result.done) {
				break;
			}
		}

		return message.channel.send(reportEmbed);
    }
};