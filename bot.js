const { Client, GatewayIntentBits, Partials } = require('discord.js');

// Create a new client instance
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers],
    partials: [Partials.Message, Partials.Reaction],
});

module.exports = client;