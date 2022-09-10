const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers] });

// Dynamic command collection creation
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

commandFiles.forEach(file => {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
});

// Dynamic message collection creation (message content to parse for)
// client.messages includes NONEXACT matches. client.exactMessages includes EXACT matches
client.messages = new Collection();
client.exactMessages = new Collection();
const messagesPath = path.join(__dirname, 'messages');
const messageFiles = fs.readdirSync(messagesPath).filter(file => file.endsWith('.js'));

// aSFDSAFADSF temp thingy so uh the export module for any message should be with a content and execute section

messageFiles.forEach(file => {
    const filePath = path.join(messagesPath, file);
    const message = require(filePath);

    // Note that at this moment all regex based message searches will not be loaded by this
    if (!message.regex) {
        if (typeof (message.content) === 'string') {
            if (!message.exact) {
                client.messages.set(message.content, message.execute);
            } else {
                client.exactMessages.set(message.content, message.execute);
            }
        } else {
            if (!message.exact) {
                message.content.forEach(item => client.messages.set(item, message.execute));
            } else {
                client.exactMessages.set(message.content, message.execute);
            }
        }
    }
});

// Dynamic event file reading
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

eventFiles.forEach(file => {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

module.exports = client;