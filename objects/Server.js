module.exports.Server = class Server {

	guildId;
	prefix;
	modChannelId;

	/**
	 * constructs the server instance
	 * 
	 * @param guildId 
	 * @param modChannelId 
	 * @param prefix 
	 */
	constructor(guildId, prefix, modChannelId) {
		this.guildId = guildId;
		this.prefix = prefix;
		this.modChannelId = modChannelId;
	}

	/**
	 * creates an Object
	 */
	toObject() {
		return JSON.parse(JSON.stringify(this, null, 4));
	}

	/**
	 * creates server instance from json string
	 * 
	 * @param json the json string
	 * @param guildId  the guild ID
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
	 * @param object the object
	 * @param guildId the guild ID
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