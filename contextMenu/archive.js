const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const fs = require('node:fs');
const archiveImages = require('../archive.json');
require('dotenv').config();

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Archive Art')
        .setType(ApplicationCommandType.Message),
    async execute(interaction) {
        if (interaction.channelId !== process.env.ARTSHARE_CHANNEL_ID) {
            await interaction.reply({ content: `This command can only be used in <#${process.env.ARTSHARE_CHANNEL_ID}>`, ephemeral: true });
            return;
        }

        const channel = await interaction.client.channels.resolve(interaction.channelId);
        const message = await channel.messages.fetch(interaction.targetId);

        let archiveImage;
        if (message.attachments.size > 0) {
            archiveImage = Array.from(message.attachments.values())[0].url;
        } else if (message.embeds.length > 0) {
            archiveImage = message.embeds[0].url;
        } else {
            await interaction.reply({ content: 'This message doesn\'t have an image to archive!', ephemeral: true });
            return;
        }

        if (archiveImages.images.indexOf(archiveImage) === -1) {
            const archiveChannel = await interaction.client.channels.resolve(process.env.ARCHIVE_CHANNEL_ID);
            await archiveChannel.send(archiveImage);
            archiveImages.images.push(archiveImage);
            fs.writeFileSync('archive.json', JSON.stringify(archiveImages, null, 4));
            await message.react('✨');
            await interaction.reply({ content: 'Art successfully archived!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'This art is already in the archive!', ephemeral: true });
            return;
        }
    },
};