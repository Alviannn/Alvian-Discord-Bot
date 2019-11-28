const Discord = require("discord.js");

module.exports = (fileNames) => {
    const ascii = require('ascii-table');
    const table = new ascii().setHeading("Command File", "Status", "Command", "Aliases")
    const commands = new Discord.Collection();

    const jsFiles = fileNames.filter(file => file.endsWith(".js"));

    jsFiles.forEach(file => {
        const command = require("../commands/" + file);

        if (command.name && Array.isArray(command.aliases) && !command.disabled) {
            commands.set(command.name, command);
            table.addRow(file, '✅', command.name, command.aliases);
        }
        else {
            table.addRow(file, '❌', command.name, command.aliases);
        }
    });

    console.log(table.toString());

    return commands;
};