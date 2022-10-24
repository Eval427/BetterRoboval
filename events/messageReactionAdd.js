// Event handler for the adding of a reaction to a messages
require('dotenv').config();
const client = require('../bot.js');

module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user) {
        if (user.id === process.env.CLIENT_ID) return;

        await addRole(reaction, user);
    },
};

const addRole = async (reaction, user) => {
    // Emoji id: Role id
    const reactionRoles = {
        '🔔': '961183420980011038',
        '456567567742402560': '961183618074574878',
        '754927593035399218': '961184096728535070',
        '833939858493931550': '961184215133732864',
        '<:Apex_Upvote:543577758689918976>': '961184267243778048',
        '904855079255965808': '961184413981483038',
        '📖': '961184500472238090',
        '🎨': '961184649957228554',
    };

    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Something went wrong when fetching the message:', error);
            return;
        }
    }

    if (reaction.message.id !== '961176028720562197') return;

    const guild = await client.guilds.cache.get('856279852406931507');
    const member = await guild.members.fetch({ user: user.id });

    let role;
    if (reaction.emoji.id) {
        role = await guild.roles.fetch(reactionRoles[reaction.emoji.id]);
    } else {
        role = await guild.roles.fetch(reactionRoles[reaction.emoji.name]);
    }

    member.roles.add(role);
};

/*
const archiveArt = async (reaction) => {
    if (reaction.message.channelId !== process.env.ARTSHARE_CHANNEL_ID) return;

    if (reaction.me) {
        let archiveImage;
        if (reaction.message.attachments.size > 0) {
            archiveImage = Array.from(reaction.message.attachments.values())[0].url;
        } else if (reaction.message.embeds.length > 0) {
            archiveImage = reaction.message.embeds[0].url;
        }

        if (archiveImages.images.indexOf(archiveImage) === -1) {
            const archiveChannel = await client.channels.resolve(process.env.ARCHIVE_CHANNEL_ID);
            await archiveChannel.send(archiveImage);
            archiveImages.images.push(archiveImage);
            fs.writeFileSync('archive.json', JSON.stringify(archiveImages, null, 4));
        }
    }
};
*/