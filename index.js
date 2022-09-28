const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();
const { Collection } = require('discord.js');
const client = require('./bot.js');

// Dynamic command collection creation
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

commandFiles.forEach(file => {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
});

// Dynamic button collection creation
client.buttons = new Collection();
const buttonsPath = path.join(__dirname, 'buttons');
const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));

buttonFiles.forEach(file => {
    const filePath = path.join(buttonsPath, file);
    const button = require(filePath);
    client.buttons.set(button.customId, button);
});

// Dynamic context menu collection creation
client.contextMenu = new Collection();
const contextMenuPath = path.join(__dirname, 'contextMenu');
const contextMenuFiles = fs.readdirSync(contextMenuPath).filter(file => file.endsWith('.js'));

contextMenuFiles.forEach(file => {
    const filePath = path.join(contextMenuPath, file);
    const contextMenuCommand = require(filePath);
    client.contextMenu.set(contextMenuCommand.name, contextMenuCommand);
});

// Dynamic message collection creation (message content to parse for)
// client.messages includes NONEXACT matches
// client.exactMessages includes EXACT matches
// client.anyMessages is message events that will fire on ANY message (mostly for regex)
client.messages = new Collection();
client.exactMessages = new Collection();
client.anyMessages = new Collection();
const messagesPath = path.join(__dirname, 'messages');
const messageFiles = fs.readdirSync(messagesPath).filter(file => file.endsWith('.js'));

messageFiles.forEach(file => {
    const filePath = path.join(messagesPath, file);
    const message = require(filePath);

    // Note that at this moment all regex based message searches will not be loaded by this
    if (message.content) {
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
    } else {
        client.anyMessages.set(message.name, message.execute);
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