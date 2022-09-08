// Event handler for the creation of any message
require('dotenv').config();

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.id == process.env.BOT_ID) return;
    },
};