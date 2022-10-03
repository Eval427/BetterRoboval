const { EmbedBuilder } = require('discord.js');
const { playAudio } = require('../audioManager');

module.exports = {
    customId: 'musicSearchSelect',
    async execute(interaction) {
        const musicSearchInteraction = interaction.client.musicSearchInteraction;
        interaction.client.audioQueue.push({
            title: musicSearchInteraction.searchResults[musicSearchInteraction.searchIndex].title,
            url: musicSearchInteraction.searchResults[musicSearchInteraction.searchIndex].url,
        });

        const playingEmbed = new EmbedBuilder()
        .setColor('4faf96')
        .setTitle(musicSearchInteraction.searchResults[musicSearchInteraction.searchIndex].title)
        .setURL(musicSearchInteraction.searchResults[musicSearchInteraction.searchIndex].url)
        .setAuthor({ name: 'Audio Queued!', iconURL: musicSearchInteraction.client.user.avatarURL() })
        .setThumbnail(musicSearchInteraction.searchResults[musicSearchInteraction.searchIndex].author.bestAvatar.url)
        .setImage(musicSearchInteraction.searchResults[musicSearchInteraction.searchIndex].bestThumbnail.url)
        .addFields(
            { name: 'Length', value: musicSearchInteraction.searchResults[musicSearchInteraction.searchIndex].duration, inline: true },
            { name: 'Channel', value: musicSearchInteraction.searchResults[musicSearchInteraction.searchIndex].author.name, inline: true },
            { name: 'Views', value: musicSearchInteraction.searchResults[musicSearchInteraction.searchIndex].views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','), inline: true },
        )
        .setTimestamp();

        interaction.client.musicSearchInteraction = null;
        await interaction.update({ embeds: [playingEmbed], components: [] });
        await playAudio(interaction);
    },
};