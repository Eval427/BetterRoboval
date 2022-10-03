const { EmbedBuilder } = require('discord.js');

module.exports = {
    customId: 'musicSearchCancel',
    async execute(interaction) {
        interaction.client.musicSearchInteraction = null;

        const cancelEmbed = new EmbedBuilder()
            .setColor('FF0000')
            .setTitle('Music Search Cancelled')
            .setTimestamp();

        await interaction.update({ embeds: [cancelEmbed], components: [] });
    },
};