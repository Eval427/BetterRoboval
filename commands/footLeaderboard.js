const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const footScores = require('../footScores');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('footleaderboard')
        .setDescription('Show a leaderboard of how many times people have said "feet" or "foot".'),
    async execute(interaction) {
        let foundUser = false;
        let statusText = '';
        const stats = Object.entries(footScores);
        stats.sort((a, b) => {return a[1] - b[1];}).reverse();

        for (const [index, score] of stats.entries()) {
            if (index > 4) {
                if (foundUser) {
                    const user = await interaction.client.users.fetch(score[0]);
                    statusText += `${index + 1}. ${user.username} - ${score[1]} foot messages\n`;
                } else if (score[0] === interaction.user.id) {
                    statusText += `**${index + 1}. ${interaction.user.username} - ${score[1]} foot messages**\n`;
                }
                break;
            } else {
                const user = await interaction.client.users.fetch(score[0]);
                if (interaction.user.id === score[0]) {
                    statusText += `**${index + 1}. ${user.username} - ${score[1]} foot messages**\n`;
                    foundUser = true;
                } else {
                    statusText += `${index + 1}. ${user.username} - ${score[1]} foot messages\n`;
                }
            }
        }

        const embed = new EmbedBuilder()
            .setColor('#4f9ccd')
            .setAuthor({ name: 'Eval\'s Emporium Foot Leaderboard', iconURL: 'https://cdn.discordapp.com/attachments/1020439217375031327/1020439535995338842/asdfsdgsadf.png' })
            .setDescription(statusText);

        await interaction.reply({ embeds: [embed] });
    },
};