class Server {

	/**
	 * constructs the server instance
	 * 
	 * @param {String} guildId 			the guild id
	 * @param {String} modChannelId 	the mod channel id
	 * @param {String} prefix 			the prefix
	 */
	constructor(guildId, prefix, modChannelId) {
		this.guildId = guildId;
		this.prefix = prefix;
		this.modChannelId = modChannelId;
	}

	/**
	 * creates an Object
	 * 
	 * @returns {Object} the server object
	 */
	toObject() {
		return JSON.parse(JSON.stringify(this, null, 4));
	}

	/**
	 * creates server instance from json string
	 * 
	 * @param {String} json		the json string
	 * @param {String} guildId 	the guild ID
	 * @returns {Server} the server instance
	 */
	static fromJson(json, guildId) {
		if (!json || !guildId) {
			return null;
		}

		const object = JSON.parse(json);

		if (object[guildId]) {
			const server = object[guildId];
			return new Server(server.guildId, server.prefix, server.modChannelId);
		}
		
		return null;
	}

	/**
	 * creates server instance from object
	 * 
	 * @param {Object} object 	the object
	 * @param {String} guildId 	the guild ID
	 * @returns {Server} the server instance
	 */
	static fromObject(object, guildId) {
		if (!object || !guildId) {
			return null;
		}

		if (object[guildId]) {
			const server = object[guildId];
			return new Server(server.guildId, server.prefix, server.modChannelId);
		}
		
		return null;
	}
	
};

module.exports.Server = Server;