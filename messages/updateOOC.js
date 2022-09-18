const fs = require('fs');
const client = require('../bot.js');
const ooc = require('../ooc.json');

module.exports = {
    regex: true,
    async execute(message) {
        if (message.author === client.user) return;

        if (!/(?:.+)?".+"(?:.+)?/g.exec(message.cleanContent) && message.channelId !== '895518829860515870') {
            return;
        }

        const messageToSave = {};
        messageToSave.author = message.author.id;
        if (message.attachments.size > 0 && !Array.from(message.attachments.values())[0].url.includes('.gif')) {
            messageToSave.image = Array.from(message.attachments.values())[0].url;
        } else if (/(?:.+)?".+"(?:.+)?/g.exec(message.cleanContent) !== null) {
            messageToSave.content = message.cleanContent;
        }

        ooc.messages.push(messageToSave);
        fs.writeFileSync('ooc.json', JSON.stringify(ooc, null, 4));
    },
};