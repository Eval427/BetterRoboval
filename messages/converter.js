const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'converter',
    async execute(message) {
        const temperature = /(\d+\.?\d*)(F|C)\b/g.exec(message.cleanContent);
        const euroMeasurement = /(\d+\.?\d*)(?!mi|mm)(m|cm|km)\b/g.exec(message.cleanContent);
        const americanMeasurement = /(\d+\.?\d*)(in|ft|mi|\syards)\b/g.exec(message.cleanContent);
        const conversionEmbed = new EmbedBuilder()
            .setColor('4f9ccd')
            .setTimestamp()
            .setAuthor({ name: 'Conversion Found', iconURL: message.author.avatarURL() });

        if (temperature) {
            if (temperature[2] === 'F') {
                conversionEmbed.setDescription(`${temperature[1]}F is **${((parseFloat(temperature[1]) - 32) / 1.8).toFixed(1)}C** for the Europeans`);
            } else {
                conversionEmbed.setDescription(`${temperature[1]}C is **${((parseFloat(temperature[1]) * 1.8) + 32).toFixed(1)}F** for the Americans`);
            }
        } else if (euroMeasurement) {
            let value = parseFloat(euroMeasurement[1]);

            if (euroMeasurement[2] === 'cm') {
                value /= 100;
            } else if (euroMeasurement[2] === 'km') {
                value *= 1000;
            }

            value *= 3.28084;

            if (value > 500) {
                conversionEmbed.setDescription(`${euroMeasurement[1]}${euroMeasurement[2]} is **${(value * 0.0001893939).toFixed(2)} miles**`);
            } else if (value < 1) {
                conversionEmbed.setDescription(`${euroMeasurement[1]}${euroMeasurement[2]} is **${(value * 12).toFixed(2)} inches**`);
            } else {
                conversionEmbed.setDescription(`${euroMeasurement[1]}${euroMeasurement[2]} is **${value.toFixed(2)} *feet***`);
            }

            conversionEmbed.setDescription(`${conversionEmbed.data.description} for the Americans`);
        } else if (americanMeasurement) {
            let value = parseFloat(americanMeasurement[1]);

            if (americanMeasurement[2] === 'in') {
                value /= 12;
            } else if (americanMeasurement[2] === 'mi') {
                value *= 5280;
            } else if (americanMeasurement[2] === 'yards') {
                value /= 3;
            }

            value *= 0.3048;

            if (value > 750) {
                conversionEmbed.setDescription(`${americanMeasurement[1]}${americanMeasurement[2]} is **${(value / 1000).toFixed(2)}km**`);
            } else if (value < 1) {
                conversionEmbed.setDescription(`${americanMeasurement[1]}${americanMeasurement[2]} is **${(value * 100).toFixed(2)}cm**`);
            } else {
                conversionEmbed.setDescription(`${americanMeasurement[1]}${americanMeasurement[2]} is **${value.toFixed(2)}m**`);
            }

            conversionEmbed.setDescription(`${conversionEmbed.data.description} for the Europeans`);
        }

        await message.reply({ embeds: [conversionEmbed], allowedMentions: { repliedUser: false } });
    },
};