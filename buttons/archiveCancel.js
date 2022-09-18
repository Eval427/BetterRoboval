const { EmbedBuilder } = require('discord.js');

module.exports = {
    customId: 'archiveCancel',
    async execute(interaction) {
        const cancelEmbed = new EmbedBuilder()
            .setColor('c5803c')
            .setTitle('Art archival canceled')
            .setImage(interaction.client.archiveUrl)
            .setFooter({ text:'Hehehe foot-er', iconURL: 'https://cdn.discordapp.com/attachments/933086711649546240/1019031233516281916/doNotTheEval-Naflaar.png' })
            .setTimestamp();

        interaction.update({ embeds: [cancelEmbed], components: [] });
    },
};