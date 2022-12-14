const { EmbedBuilder } = require('discord.js');
const { messages } = require('../data/ooc.json');
require('dotenv').config();

module.exports = {
    content: 'rv ooc',
    exact: true,
    async execute(interaction) {
        if (interaction.channelId !== process.env.BOTSPAM_CHANNEL_ID) {
            interaction.reply({ content: `This command can only be used in <#${process.env.BOTSPAM_CHANNEL_ID}>`, ephemeral: true });
            return;
        }

        const message = messages[Math.floor(Math.random() * messages.length)];
        const author = await interaction.client.users.fetch(message.author);
        const embed = new EmbedBuilder()
            .setColor([Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)])
            .setAuthor({ name: author.username, iconURL: author.avatarURL() });
            // .setFooter({ text: 'OOC brought to you by Eval', iconURL: 'https://cdn.discordapp.com/attachments/1020439217375031327/1020439535995338842/asdfsdgsadf.png' })
            // .setTimestamp();

        if (message.image) {
            embed.setImage(message.image);
        } else if (message.content) {
            embed.setDescription(message.content);
        }

        await interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    },
};