const Guild = require('../../schemas/guild');
const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const mongoose = require('mongoose');
module.exports = {
    data: new SlashCommandBuilder()
    .setName("database")
    .setDescription("Returns information from a database."),
    /**
     * 
     *  @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        let guildProfile = await Guild.findOne({ guildId: interaction.guild.id });
        if (!guildProfile) {
            guildProfile = await new Guild({
                _id: mongoose.Types.ObjectId(),
                guildId: interaction.guild.id,
                guildName: interaction.guild.name,
                guildIcon: interaction.guild.iconURL() ? interaction.guild.iconURL() : "None."
            })
    
            await guildProfile.save().catch(console.error);
            await interaction.reply({ content: `Server Name: ${guildProfile.guildName}`, ephemeral: true });
            console.log(guildProfile);
        } else {
            await interaction.reply({ content: `Server Id: ${guildProfile.guildId}`, ephemeral: true });
            console.log(guildProfile);
        }
    }
}