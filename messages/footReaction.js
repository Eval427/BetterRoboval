// Adds reactions to all messages containing the word foot
const footScores = require('../footScores.json');
const fs = require('node:fs');

module.exports = {
    content: ['foot', 'feet'],
    async execute(message) {
        const footEmojis = ['<:evalFoot:893612650355908678>', '<:blueFoot:898274993073426492>', '<:venomFoot:927996868061970563>', '<:arkiefoot:915516951839801375>', '<:kosmosFoot:900486643327320154>', '<:lindaFoot:897563523671007342>', '<:deriFoot:931002635560046653>', '<:rubyFoot:922966658996383795>', '<:flouxFoot:922960765344960522>', '<:koemiFoot:922961250428813362>'];
        await message.react(footEmojis[Math.floor(Math.random() * footEmojis.length)]);

        footScores[message.author.id] += 1;
        fs.writeFileSync('footScores.json', JSON.stringify(footScores, null, 4));
    },
};