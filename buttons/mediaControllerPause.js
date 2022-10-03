const { getVoiceConnection } = require('@discordjs/voice');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { pauseAudio } = require('../audioManager');

module.exports = {
    customId: 'mediaControllerPause',
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

        await pauseAudio();

        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('mediaControllerUnpause')
                    .setLabel('Play')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('mediaControllerSkip')
                    .setLabel('Skip')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('mediaControllerStop')
                    .setLabel('Stop')
                    .setStyle(ButtonStyle.Danger),
            );

        await interaction.update({ components: [buttonRow] });
    },
};