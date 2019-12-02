const Discord = require('discord.js');
const ascii = require('ascii-table');
const fs = require('fs')

module.exports = {
    handleRegister(client) {
        if (!(client instanceof Discord.Client)) {
            throw Error("The listener handler requires the Discord.Client instance!");
        }
    
        const table = new ascii().setHeading('Listener File', 'Status');
        const files = fs.readdirSync('./listeners/').filter(file => file.endsWith('.js'));
    
        files.forEach(function (file) {
            const listener = require('../listeners/' + file);
    
            if (listener) {
                listener.call();
                table.addRow(file, '✅');
            }
            else {
                table.addRow(file, '❌');
            }
        });
    
        console.log(table.toString());
    }
};