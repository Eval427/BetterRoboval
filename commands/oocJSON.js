const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('oocjson')
        .setDescription('Generates the JSON file parsed by roboval if you need that for some strange reason'),
    async execute(interaction) {
        if (interaction.channelId !== process.env.BOTSPAM_CHANNEL_ID) {
            interaction.reply({ content: `This command can only be used in <#${process.env.BOTSPAM_CHANNEL_ID}>`, ephemeral: true });
            return;
        }

        await interaction.reply({ files: ['./data/ooc.json'] });
    },
};