// Adds reactions to all messages containing the word foot

module.exports = {
    content: ['foot', 'feet'],
    async execute(message) {
        await message.reply('FEET?!');
    },
};