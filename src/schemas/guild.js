const { Schema, model } = require('mongoose');

const guildSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guildId: String,
    guildName: String,
    timeOutTimer: Number,
    airingOutTimer: Number,
    bootedPeopleLimit: Number,
})

module.exports = model("Guild", guildSchema, "guilds");
