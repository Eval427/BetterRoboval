module.exports = {
    content: 'ball',
    async execute(message) {
        const ballsEmojis = ['🎱', '🎾', '🥎', '🏐'];
        await message.react(ballsEmojis[Math.floor(Math.random() * ballsEmojis.length)]);
    },
};