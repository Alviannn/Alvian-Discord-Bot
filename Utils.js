module.exports = {
    randomNumber(min, max) {
        if (!(max instanceof Number) || !(min instanceof Number)) {
            return null;
        }

        const random = Math.floor(Math.random() * (max - min + 1) + min);
        if (random === max) {
            random--;
        }

        return random;
    },
    randomBoolean() {
        const booleans = [true, false];

        const random = this.randomNumber(booleans.length, 0);
        if (random > 1) {
            random--;
        }

        return booleans[random];
    },
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
    createUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);

            return v.toString(16);
        });
    }
};

