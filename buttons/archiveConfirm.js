const { EmbedBuilder } = require('discord.js');

module.exports = {
    customId: 'archiveConfirm',
    async execute(interaction) {
        const archiveChannelId = '1002373315018625044';
        const archiveChannel = interaction.client.channels.resolve(archiveChannelId);
        await archiveChannel.send(interaction.client.archiveUrl);

        const confirmEmbed = new EmbedBuilder()
            .setColor('#62c43a')
            .setTitle('Success! Art uploaded')
            .setImage(interaction.client.archiveUrl)
            .setFooter({ text:'Hehehe foot-er', iconURL: 'https://cdn.discordapp.com/attachments/933086711649546240/1019031233516281916/doNotTheEval-Naflaar.png' })
            .setTimestamp();

        interaction.update({ embeds: [confirmEmbed], components: [] });
    },
};