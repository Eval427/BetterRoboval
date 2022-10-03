// Event handler for the joining/leaving of anyone from a voice channel

const { getVoiceConnection } = require('@discordjs/voice');
const client = require('../bot');

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState) {
        if (oldState.member.id === client.id) return;

        const connection = getVoiceConnection(oldState.guild.id);
        if (!connection) return;

        const voiceChannel = await client.channels.resolve(connection.joinConfig.channelId);

        if (voiceChannel.members.size === 1) {
            setTimeout(() => {
                client.audioQueue = [];
                client.currentlyPlaying = null;
                connection.destroy();
            }, 5_000);
        }
    },
};