// Event handler for the creation of any message
const client = require('../index.js');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        // if (message.author === client.user) return;

        console.log(client);
        const exactMessage = client.exactMessages.get(message.cleanContent);
        if (exactMessage) {
            try {
                await exactMessage.execute(message);
            } catch (error) {
                console.error(error);
            }
        }

        const includesMessages = Array.from(client.messages);
        for await (const includesMessage of includesMessages) {
            if (message.cleanContent.includes(includesMessage[0])) {
                try {
                    await includesMessage[1];
                    break;
                } catch (error) {
                    console.error(error);
                }
            }
        }
    },
};