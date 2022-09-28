const fs = require('fs');
const client = require('../bot.js');
const ooc = require('../data/ooc.json');
require('dotenv').config();

module.exports = {
    regex: true,
    async execute(message) {
        if (message.author === client.user) return;

        if (message.channelId !== process.env.OOC_CHANNEL_ID) return;

        const messageToSave = {};
        messageToSave.author = message.author.id;
        if (message.attachments.size > 0 && !Array.from(message.attachments.values())[0].url.includes('.gif')) {
            messageToSave.image = Array.from(message.attachments.values())[0].url;
        } else if (/".+"/g.exec(message.cleanContent) !== null) {
            messageToSave.content = message.cleanContent;
        }

        if (!(messageToSave.content || messageToSave.image)) return;

        ooc.messages.push(messageToSave);
        fs.writeFileSync('./data/ooc.json', JSON.stringify(ooc, null, 4));
    },
};