const { Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.DISCORD_TOKEN;

// EDIT ARRAY WITH IDs OF COMMAND(s) TO DELETE
// ------------
const toDelete = [];
// ------------

const rest = new REST({ version: '10' }).setToken(token);

toDelete.forEach(command => {
    rest.delete(Routes.applicationGuildCommand(clientId, guildId, command))
        .then(() => console.log(`Successfully deleted guild command of id ${command}`))
        .catch(console.error);
});