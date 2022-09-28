// Event handler for the creation of an interaction

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        await slashInteraction(interaction);
        await buttonInteraction(interaction);
        await contextMenuInteraction(interaction);
    },
};

const slashInteraction = async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
};

const buttonInteraction = async (interaction) => {
    if (!interaction.isButton()) return;

    const button = interaction.client.buttons.get(interaction.customId);

    if (!button) return;

    try {
        await button.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this button process!', ephemeral: true });
    }
};

const contextMenuInteraction = async (interaction) => {
    if (!interaction.isMessageContextMenuCommand()) return;

    const contextMenu = interaction.client.contextMenu.get(interaction.name);

    if (!contextMenu) return;

    try {
        await contextMenu.execute(interaction);
    } catch (error) {
        console.error(error);
    }
};