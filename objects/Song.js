class Song {

	constructor(title, url) {
        this.title = title;
        this.url = url;
    }

    /**
     * converts the song instance to JSON string
     * 
     */
    toJson() {
        return JSON.stringify(this, null, 4);
    }
	
};

module.exports.Song = Song;