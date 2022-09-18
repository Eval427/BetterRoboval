// Event handler for the creation of any message
const client = require('../bot.js');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author === client.user) return;

        const exactMessage = client.exactMessages.get(message.cleanContent);
        if (exactMessage) {
            try {
                await exactMessage(message);
            } catch (error) {
                console.error(error);
            }
        }

        const includesMessages = Array.from(client.messages);
        for await (const includesMessage of includesMessages) {
            if (message.cleanContent.toLowerCase().includes(includesMessage[0])) {
                try {
                    await includesMessage[1](message);
                    break;
                } catch (error) {
                    console.error(error);
                }
            }
        }

        for await (const anyMessage of Array.from(client.anyMessages)) {
            anyMessage[1](message);
        }
    },
};