const { Collection } = require('discord.js');
const fs = require('fs');
const client = require('../bot.js');
require('dotenv').config();

module.exports = {
    content: 'rv getooc',
    async execute(message) {
        if (!message.author.id === '284456566399172608') {
            await message.reply({ text: 'Goober you can\'t use that command.', ephemeral: true });
            return;
        }

        await message.delete();

        const messageAmount = /rv getooc\s?(\d+)?/g.exec(message.cleanContent) ? /rv getooc\s?(\d+)?/g.exec(message.cleanContent)[1] : 6750;
        const fetchedMessages = await fetchMessages(client.channels.resolve(process.env.OOC_CHANNEL_ID), messageAmount);
        const messagesToSave = [];

        fetchedMessages.forEach(channelMessage => {
            const messageToSave = {};
            messageToSave.author = channelMessage.author.id;
            if (channelMessage.attachments.size > 0 && !Array.from(channelMessage.attachments.values())[0].url.includes('.gif')) {
                messageToSave.image = Array.from(channelMessage.attachments.values())[0].url;
                messagesToSave.push(messageToSave);
            } else if (/(?:.+)?".+"(?:.+)?/g.exec(channelMessage.cleanContent) !== null) {
                messageToSave.content = channelMessage.cleanContent;
                messagesToSave.push(messageToSave);
            }
        });

        fs.writeFileSync('./data/ooc.json', JSON.stringify({ messages: messagesToSave }, null, 4));
    },
};

const fetchMessages = async (channel, limit = 250) => {
    let collection = new Collection();
    let lastId = null;
    const options = {};
    let remaining = limit;

    while (remaining > 0) {
        options.limit = remaining > 100 ? 100 : remaining;
        remaining = remaining > 100 ? remaining - 100 : 0;

        if (lastId) {
            options.before = lastId;
        }

        const messages = await channel.messages.fetch(options);

        if (!messages.last()) {
            break;
        }

        collection = collection.concat(messages);
        lastId = messages.last().id;
    }

    return collection;
};