const { getVoiceConnection } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const { stopAudio } = require('../audioManager.js');

module.exports = {
    customId: 'mediaControllerStop',
    async execute(interaction) {
        if (interaction.message.interaction.id !== interaction.client.mediaControllerInteraction.id) {
            const invalidEmbed = new EmbedBuilder()
                .setColor('FF0000')
                .setAuthor({ name: 'Media Controller Expired!', iconURL: interaction.client.user.avatarURL() })
                .setDescription('Roboval only reads input from the most recently generated media controller. Find that one or generate a new one with /mediacontroller')
                .setTimestamp();

            await interaction.update({ embeds: [invalidEmbed], components: [] });
            return;
        }

        if (interaction.member.voice.channel?.id !== getVoiceConnection(interaction.guild.id).joinConfig.channelId) return;

        const connection = getVoiceConnection(interaction.guild.id);
        await stopAudio();
        connection.destroy();
        interaction.client.mediaControllerInteraction = null;
        interaction.client.musicSearchInteraction = null;
        interaction.client.audioQueue = [];

        const stopEmbed = new EmbedBuilder()
            .setColor('FF0000')
            .setDescription('Roboval has stopped playing audio. Queue flushed')
            .setTimestamp();

        await interaction.update({ embeds: [stopEmbed], components: [] });
    },
};