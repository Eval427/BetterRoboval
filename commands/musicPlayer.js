const { getVoiceConnection } = require('@discordjs/voice');
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ytsr = require('ytsr');
const { playAudio } = require('../audioManager.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays the audio from a YouTube video')
        .addStringOption(option =>
            option.setName('video')
                .setDescription('The video to play. Can be a URL or search term')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.voice.channel?.id) {
            await interaction.reply({ content: 'You must join a VC to play audio', ephemeral: true });
            return;
        }

        // Add condition for if user is trying to make roboval join a diff VC
        const voiceConnection = getVoiceConnection(interaction.guild.id);
        if (voiceConnection && voiceConnection.joinConfig.channelId !== interaction.member.voice.channelId) {
            await interaction.reply({ content: `Roboval is already playing audio in <#${voiceConnection.joinConfig.channelid}>`, ephemeral: true });
            return;
        }

        await interaction.deferReply({ ephemeral: true });
        interaction.client.musicSearchInteraction = interaction;

        if (!interaction.options.getString('video').startsWith('http')) {
            interaction.searchResults = await ytsr(interaction.options.getString('video'), { limit: 10 });
            interaction.searchResults = interaction.searchResults.items.filter(item => item.type === 'video');
            interaction.searchIndex = 0;

            if (interaction.searchResults.length === 0) {
                interaction.client.musicSearchInteraction = null;
                await interaction.editReply(`*${interaction.options.getString('video')}* did not return any search results`);
                return;
            }

            const searchItem = interaction.searchResults[interaction.searchIndex];
            const searchEmbed = new EmbedBuilder()
                .setColor('4faf96')
                .setTitle(searchItem.title)
                .setURL(searchItem.url)
                .setAuthor({ name: `Showing result ${interaction.searchIndex + 1} of ${interaction.searchResults.length} for "${interaction.options.getString('video')}"`, iconURL: interaction.client.user.avatarURL() })
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
                            .setCustomId('musicSearchNext')
                            .setLabel('>')
                            .setStyle(ButtonStyle.Primary),
                    );

            await interaction.editReply({ embeds: [searchEmbed], components: [buttonRow] });
        } else {
            const videoInfo = await ytsr(interaction.options.getString('video'), { limit: 1 });
            const video = videoInfo.items[0];
            const playingEmbed = new EmbedBuilder()
                .setColor('4faf96')
                .setTitle(video.title)
                .setURL(video.url)
                .setAuthor({ name: 'Audio Queued!', iconURL: interaction.client.user.avatarURL() })
                .setThumbnail(video.author.bestAvatar.url)
                .setImage(video.bestThumbnail.url)
                .addFields(
                    { name: 'Length', value: video.duration, inline: true },
                    { name: 'Channel', value: video.author.name, inline: true },
                    { name: 'Views', value: video.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','), inline: true },
                )
                .setTimestamp();

            interaction.client.audioQueue.push({
                title: video.title,
                url: interaction.options.getString('video'),
            });

            interaction.client.musicSearchInteraction = null;
            await interaction.editReply({ embeds: [playingEmbed] });
            await playAudio(interaction);
        }
    },
};