const startTime = new Date().getTime();

const Discord = require('discord.js');
const { Server } = require('./objects/Server');
const config = require('./config.json');
const fs = require("fs");
const Utils = require('./Utils');

let commands = new Map();

/**
 * initializes the client variable (discord client instance)
 */
const client = new Discord.Client({
	disableEveryone: true
});

const botToken = config.token;
let prefix = config.default_prefix;

// ------------------------------------------ //

/**
 * handles all functions exporting
 */
module.exports = {
	/**
	 * checks the time elapsed between millis and the real time
	 * 
	 * @param {Number} millis 	the speficied time millis 
	 * @returns {Number}		the times elapsed
	 */
	elapsed(millis) {
		return new Date().getTime() - millis;
	},

	/**
	 * formats the date into a more readable string
	 * 
	 * @param {Date} date 	the date
	 * @returns {String} 	the formatted date
	 */
	formatDate(date) {
		if (!(date instanceof Date)) {
        	return null;
		}
		return (date.getUTCFullYear() + '/' + date.getUTCMonth() + '/' + date.getUTCDay() + ' - ' + date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds());
	},
	
	/**
	 * @returns {Discord.Client} the client variable
	 */
	client() {
		return client;
	},

	/**
	 * @returns {String} the prefix variable
	 */
	prefix() {
		return prefix;
	},

	/**
	 * checks if value is a number
	 * 
	 * @param {String} value	the possible number value
	 * @returns {Boolean} 		true if value is number, otherwise false
	 */
	isNumber(value) {
		return !isNaN(parseFloat(value)) && isFinite(value);
	},

	/**
	 * checks file existence
	 * 
	 * @param {String} filePath	the file path
	 * @returns {Boolean}		true if file exists, otherwise false
	 */
	fileExists(filePath) {
		return fs.existsSync(filePath);
	},
	
	/**
	 * creates empty file
	 * 
	 * @param {String} filePath the file path
	 */
	createEmptyFile(filePath) {
		if (!this.fileExists(filePath)) {
			fs.writeFileSync(filePath, "", {encoding: 'utf8'});
		}
	},

	/**
	 * @returns {Utils} utils instance
	 */
	Utils() {
		return Utils;
	},

	/**
	 * retrieves (or create if it doesn't exists) the server
	 * 
	 * @param {String} guildId 	the guild id
	 * @returns {Server} 		the server instance
	 */
	getOrCreateServer(guildId) {
		const filePath = './servers.json';
		let content = null;

		this.createEmptyFile(filePath);

		if (!this.fileExists(filePath)) {
			return new Server(guildId, prefix, 0);
		}

		try {
			const bufferData = fs.readFileSync(filePath, {encoding: 'utf8'});

			if (bufferData) {
				content = JSON.parse(bufferData);
			}
		} catch (error) {
			return console.log("An error has occurred! \n" + error);
		}

		let server = null;
		if (content) {
			server = Server.fromJson(JSON.stringify(content, null, 4), guildId);
		}
		if (!content || !server) {
			server = new Server(guildId, prefix, 0);
		}

		return server;
	},

	/**
	 * saves all servers to data
	 * 
	 * @param {Array} servers the server array
	 */
	saveServers(servers) {
		const filePath = './servers.json';
		let content = null;

		this.createEmptyFile(filePath);

		try {
			const bufferData = fs.readFileSync(filePath, {encoding: 'utf8'});

			if (bufferData) {
				content = JSON.parse(bufferData);
			}
		} catch (error) {
			console.log(error);
		}

		if (!content) {
			content = {};
		}

		servers.forEach((server) => {
			content[server.guildId] = server.toObject();
		});

		fs.writeFileSync(filePath, JSON.stringify(content, null, 4), {encoding: 'utf8'});
	},

	/**
	 * inserts a command list to the 'commands' variable
	 * 
	 * @param {Map} commandList the command list
	 */
	insertCommands(commandList) {
		if (!commandList) {
			return;
		}
		
		commands = commandList;
	},

	/**
	 * @returns {Map} the command list
	 */
	getCommandList() {
		return commands;
	}
};


// ------------------------------------------ //

const ListenerHandler = require('./handlers/ListenerHandler.js');
ListenerHandler.handleRegister(client);

// handles the client login
client.login(botToken);

/**
 * re-setups the existing servers
 * 
 * could be used to create new server while the bot was online
 */
setTimeout(() => {
	const serverArray = [];

	client.guilds.forEach((guild) => {
		const server = module.exports.getOrCreateServer(guild.id);
		serverArray.push(server);
	});

	module.exports.saveServers(serverArray);
}, 2000);