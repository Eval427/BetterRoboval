const { createAudioResource, createAudioPlayer, NoSubscriberBehavior, AudioPlayerStatus, joinVoiceChannel } = require('@discordjs/voice');
// const { OpusEncoder } = require('@discordjs/opus');
const play = require('play-dl');
const client = require('./bot');

let connection;
const player = createAudioPlayer({
    behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
    },
});

const playAudio = async (interaction, force = false) => {
    if (player._state.status !== 'idle' && !force) return;
    connection = joinVoiceChannel({
        channelId: interaction.member.voice.channel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
    });
    const video = client.audioQueue.shift();
    interaction.client.currentlyPlaying = video;
    const stream = await play.stream(video.url, { discordPlayerCompatibility: true });

    const resource = createAudioResource(stream.stream, { inputType: stream.type });

    player.play(resource);
    connection.subscribe(player);
};

const pauseAudio = async () => {
    await player.pause();
};

const unpauseAudio = async () => {
    await player.unpause();
};

const stopAudio = async () => {
    await player.stop();
};

player.on(AudioPlayerStatus.Playing, () => {
    console.log('The audio player has started playing!');
});

player.on('error', error => {
    console.error(`Audio Error: ${error} with resource ${error.resource.metadata}`);
    player.stop();
});

player.on(AudioPlayerStatus.Idle, async () => {
    setTimeout(() => {
        if (player._state.status === 'idle') {
            try {
                client.audioQueue = [];
                client.currentlyPlaying = null;
                connection.destroy();
            } catch (_) {
                return;
            }
        }
    }, 30_000);

    const voiceChannel = await client.channels.resolve(connection.joinConfig.channelId);
    if (voiceChannel.members.size === 1) {
        client.audioQueue = [];
        client.currentlyPlaying = null;
        try {
            connection.destroy();
        } catch (_) {
            return;
        }
        return;
    }

    if (client.audioQueue.length > 0) {
        const video = client.audioQueue.shift();
        const stream = await play.stream(video.url, { discordPlayerCompatibility: true });
        const resource = createAudioResource(stream.stream, { inputType: stream.type });

        player.play(resource);
    }
});

module.exports = { playAudio, pauseAudio, unpauseAudio, stopAudio };