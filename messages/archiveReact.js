require('dotenv').config();

module.exports = {
    name: 'archiveReact',
    async execute(message) {
        if (message.channelId !== process.env.ARTSHARE_CHANNEL_ID) return;

        if (message.attachments.size > 0 || message.embeds.length > 0) {
            await message.react('✨');
        }
    },
};