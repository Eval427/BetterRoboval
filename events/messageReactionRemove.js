// Event handler for the removal of a role from a message
require('dotenv').config();

module.exports = {
    name: 'messageReactionRemove',
    async execute(reaction, user) {
        if (user.id === process.env.CLIENT_ID) return;

        await removeRole(reaction, user);
    },
};

const removeRole = (reaction, user) => {
    return user;
};