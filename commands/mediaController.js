const { getVoiceConnection } = require('@discordjs/voice');
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mediacontroller')
        .setDescription('Brings up an interactive media controller for Roboval'),
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guild.id);
        if (!connection) {
            await interaction.reply({ content: 'Roboval is not currently playing music!', ephemeral: true });
            return;
        }

        interaction.client.mediaControllerInteraction = interaction;

        let embedDescription = '';
        console.log(interaction.client.audioQueue);
        for (const [index, video] of interaction.client.audioQueue.entries()) {
            embedDescription += `${index + 2}. ${video.title}\n`;
        }
        if (embedDescription.length === 0) embedDescription = 'No More Audio Queued';

        const controllerEmbed = new EmbedBuilder()
            .setColor('abdce2')
            .setTitle(`1. ${interaction.client.currentlyPlaying.title}`)
            .setURL(interaction.client.currentlyPlaying.url)
            .setDescription(embedDescription)
            .setAuthor({ name: 'Current Audio Queue:', iconURL: interaction.client.user.avatarURL() })
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

        await interaction.reply({ embeds: [controllerEmbed], components: [buttonRow] });
    },
};