const { getVoiceConnection } = require('@discordjs/voice');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { playAudio } = require('../audioManager');

module.exports = {
    customId: 'mediaControllerSkip',
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

        if (interaction.client.audioQueue.length === 0) return;

        await playAudio(interaction, true);

        let embedDescription = '';
        for (const [index, video] of interaction.client.audioQueue.entries()) {
            embedDescription += `${index + 2}. ${video.title}\n`;
        }
        if (embedDescription.length === 0) embedDescription = 'No More Audio Queued';

        const controllerEmbed = new EmbedBuilder()
            .setColor('abdce2')
            .setTitle(`1. ${interaction.client.currentlyPlaying.title}`)
            .setURL(interaction.client.currentlyPlaying.url)
            .setAuthor({ name: 'Current Audio Queue:', iconURL: interaction.client.user.avatarURL() })
            .setDescription(embedDescription)
            .setFooter({ text: 'This controller is only valid for 15 minutes. After that please generate a new one' })
            .setTimestamp();

        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('mediaControllerPause')
                    .setLabel('Pause')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('mediaControllerSkip')
                    .setLabel('Skip')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('mediaControllerStop')
                    .setLabel('Stop')
                    .setStyle(ButtonStyle.Danger),
            );

        await interaction.update({ embeds: [controllerEmbed], components: [buttonRow] });
    },
};