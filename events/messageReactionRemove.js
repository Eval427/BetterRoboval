// Event handler for the removal of a role from a message
require('dotenv').config();
const client = require('../bot.js');

module.exports = {
    name: 'messageReactionRemove',
    async execute(reaction, user) {
        if (user.id === process.env.CLIENT_ID) return;

        await removeRole(reaction, user);
    },
};

const removeRole = async (reaction, user) => {
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

    member.roles.remove(role);
};