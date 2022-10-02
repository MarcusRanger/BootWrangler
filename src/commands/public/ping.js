const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Will respond with hello."),
    /**
     * 
     *  @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction) {
        interaction.reply({ content: "Poggers", ephemeral: true });
    }
}