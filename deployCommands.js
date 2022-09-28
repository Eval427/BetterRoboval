const fs = require('node:fs');
const path = require('node:path');
const { Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.DISCORD_TOKEN;

// Dynamically execute all commands defined in the commands folder
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

commandFiles.forEach(file => {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
});

// Dynamically register all context menu commands
const contextMenuPath = path.join(__dirname, 'contextMenu');
const contextMenuFiles = fs.readdirSync(contextMenuPath).filter(file => file.endsWith('.js'));

contextMenuFiles.forEach(file => {
    const filePath = path.join(contextMenuPath, file);
    const contextMenuCommand = require(filePath);
    commands.push(contextMenuCommand.data.toJSON());
});

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);