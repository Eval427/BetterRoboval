const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const archiveImages = require('../archive.json');
const fs = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('archive')
        .setDescription('Saves the most recently posted art to the art archive.'),
    async execute(interaction) {
        const archiveChannelId = '932017472427679804';
        let archiveImage = undefined;
        let searchImage = true;
        let notFirst = false;

        if (!interaction.channelId === archiveChannelId) interaction.reply({ content: 'This command can only be used in <#934192953432367124>', ephemeral: true });
        await interaction.client.channels.resolve(archiveChannelId).messages
            .fetch({ limit: 50 })
            .then(messages => {
                // Search for message embeds
                messages.forEach(message => {
                    if (message.embeds && searchImage) {
                        // Handle case of attachments, which results in an embed array length 0
                        if (message.embeds.length === 0) {
                            archiveImage = Array.from(message.attachments.values())[0].url;
                        } else {
                            const embed = message.embeds[0];

                            // Twitter specific image url
                            if (embed.url.includes('twitter')) {
                                archiveImage = embed.image.url;
                            } else {
                                archiveImage = embed.url;
                            }
                        }

                        searchImage = false;
                        archiveImages.forEach(image => {
                            if (image === archiveImage) searchImage = true;
                            notFirst = false;
                        });
                    }
                });
            });

        const archiveEmbed = new EmbedBuilder()
            .setColor('#4f9ccd')
            .setTitle('Art Archive Assistant')
            .setDescription('Confirm archive submission')
            .setImage(archiveImage)
            .setFooter({ text:'Hehehe foot-er', iconURL: 'https://cdn.discordapp.com/attachments/933086711649546240/1019031233516281916/doNotTheEval-Naflaar.png' })
            .setTimestamp();

        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('archiveConfirm')
                    .setLabel('Confirm')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('archiveCancel')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger),
            );

        if (!notFirst) {
            await interaction.reply({ ephemeral: true, embeds: [archiveEmbed], components: [buttonRow] });
        } else {
            await interaction.reply({ text: 'WARNING: The first image in art-share was already located in the repository. Showing next image not in repo.', ephemeral: true, embeds: [archiveEmbed], components: [buttonRow] });
        }
        interaction.client.archiveUrl = archiveImage;

        archiveImages.images.push(archiveImage);
        fs.writeFileSync('archive.json', JSON.stringify(archiveImages, null, 4));
    },
};