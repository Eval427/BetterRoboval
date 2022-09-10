// Event handler for the adding of a reaction to a messages
require('dotenv').config();

module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user) {
        if (user.id === process.env.CLIENT_ID) return;

        await addRole(reaction, user);
    },
};

const addRole = (reaction, user) => {
    return user;
};