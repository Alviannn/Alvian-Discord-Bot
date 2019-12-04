const Discord = require("discord.js");
const ascii = require('ascii-table');
const fs = require('fs');

const table = new ascii().setHeading('Command File', 'Status', 'Command', 'Aliases');
const commands = new Map();

/**
 * handles the command loading
 * 
 * @param {String} fullPath the full file path (including the file name)
 * @param {String} fileName the file name  
 */
function handleCommandLoad(fullPath, fileName) {
    // the command file can only be a .js file
    if (!fileName.endsWith('js') || !fullPath.endsWith('.js')) {
        return;
    }
    // creates a command instance
    const command = require('.' + fullPath);
    
    if (!command) {
        // adds a row for the fancy command loading stats (failed to create command instance)
        table.addRow(fileName, '❌❌', 'FAILED TO BE IDENTIFIED', 'FAILED TO BE IDENTIFIED');
        return;
    }

    // checks if the command instance:
    // * has the 'name' property
    // * the 'aliases' property is an array (also if it does exists)
    // * the 'disabled' property exists and sets as true (use this to disable a command from loading)
    if (command.name && Array.isArray(command.aliases) && !command.disabled) {
        // puts the command name (key) and command instance (value) to the 'commands' map
        commands.set(command.name, command);
        // adds a row for the fancy command loading stats (success state) :3
        table.addRow(fileName, '✅', command.name, command.aliases);
    }
    else {
        // adds a row for the fancy command loading stats (failed state) :3
        table.addRow(fileName, '❌', command.name, command.aliases);
    }
}

/**
 * loads the commands but as a system
 */
function loadCommands() {
    const files = fs.readdirSync('./commands/');

    for (let file of files) {
        const stats = fs.lstatSync('./commands/' + file);

        // checks if the file is a directory/folder
        if (stats.isDirectory()) {
            const anotherFiles = fs.readdirSync('./commands/' + file);

            for (let anotherFile of anotherFiles) {
                handleCommandLoad(anotherFile);
            }

            continue;
        }

        // uses the function to load a command
        handleCommandLoad('./commands/' + file, file);
    }
}

module.exports = {
    /**
     * loads the commands (completely)
     */
    handleCommands() {
        // self-explanatory
        loadCommands();

        console.log(table.toString());
        return commands;
    }
};