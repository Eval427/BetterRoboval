const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customId: 'musicSearchNext',
    async execute(interaction) {
        try {
            interaction.isRepliable();
            interaction.client.musicSearchInteraction.isRepliable();
        } catch (error) {
            return;
        }
        const musicSearchInteraction = interaction.client.musicSearchInteraction;
        musicSearchInteraction.searchIndex += 1;

        const searchItem = musicSearchInteraction.searchResults[musicSearchInteraction.searchIndex];
        const searchEmbed = new EmbedBuilder()
            .setColor('4faf96')
            .setTitle(searchItem.title)
            .setURL(searchItem.url)
            .setAuthor({ name:`Showing result ${musicSearchInteraction.searchIndex + 1} of 100 for "${musicSearchInteraction.options.getString('video')}"`, iconURL: musicSearchInteraction.client.user.avatarURL() })
            .setThumbnail(searchItem.author.bestAvatar.url)
            .setImage(searchItem.bestThumbnail.url)
            .addFields(
                { name: 'Length', value: searchItem.duration, inline: true },
                { name: 'Channel', value: searchItem.author.name, inline: true },
                { name: 'Views', value: searchItem.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','), inline: true },
            )
            .setTimestamp();

        const buttonRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('musicSearchSelect')
                        .setLabel('Play')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('musicSearchCancel')
                        .setLabel('Cancel')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId('musicSearchPrevious')
                        .setLabel('<')
                        .setStyle(ButtonStyle.Primary),
                );

        if (musicSearchInteraction.searchIndex + 1 !== musicSearchInteraction.searchResults.length) {
            buttonRow.addComponents(
                new ButtonBuilder()
                        .setCustomId('musicSearchNext')
                        .setLabel('>')
                        .setStyle(ButtonStyle.Primary),
            );
        }

        interaction.client.musicSearchInteraction = musicSearchInteraction;
        await interaction.update({ embeds: [searchEmbed], components: [buttonRow] });
    },
};