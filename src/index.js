require('dotenv').config();
const { token, mongoToken } = process.env;
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { connect } = require('mongoose');
const { Guilds, GuildMembers, GuildMessages, GuildVoiceStates } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages, GuildVoiceStates],
    partials: [User, Message, GuildMember, ThreadMember]
});
const { loadEvents } = require('./handlers/eventHandler');
const { loadMongoEvents } = require('./handlers/mongoEventHandler');

client.events = new Collection();
client.commands = new Collection();
loadEvents(client);
loadMongoEvents(client);
client.login(token);
(async () => {
    await connect(mongoToken).catch(console.error);
})();

module.exports = client;

