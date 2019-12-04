/**
 * Utilities module
 */
module.exports = {
    /**
     * Do a random number between min and max
     * 
     * @param {Number} min  the minimum number
     * @param {Number} max  the maximum number
     * @returns {Number}    the random number between the min and max number
     */
    randomNumber(min, max) {
        if (!(max instanceof Number) || !(min instanceof Number)) {
            return null;
        }

        let random = Math.floor(Math.random() * (max - min + 1) + min);
        if (random === max) {
            random--;
        }

        return random;
    },

    /**
     * Do a random boolean
     * 
     * @returns {Boolean} the random boolean
     */
    randomBoolean() {
        const booleans = [true, false];

        let random = this.randomNumber(booleans.length, 0);
        if (random > 1) {
            random--;
        }

        return booleans[random];
    },

    /**
     * Creates a random string
     * 
     * @param {Number} length       the string length
     * @param {Boolean} useCapital  true if you want to use capital
     * @param {Boolean} useNumber   true if you want to use number
     */
    randomString(length, useCapital, useNumber) {
        if (!(length instanceof Number) || !(useCapital instanceof Boolean) || !(useNumber instanceof Boolean)) {
            return null;;
        }

        const normalChars = "abcdefghijklmnopqrstuvwxyz".split("");
        const capsChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

        let strings = "";
        while (strings.length < length) {
            const random = this.randomNumber(26, 0);

            if (useCapital && this.randomBoolean()) {
                strings += capsChars[random];
                continue;
            }
            if (useNumber && this.randomBoolean()) {
                strings += this.randomNumber(10, 0);
                continue;
            }

            strings += normalChars[random];
        }

        return strings;
    },

    /**
     * Creates a UUID
     * 
     * @returns {String} the uuid
     */
    createUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);

            return v.toString(16);
        });
    }
};

