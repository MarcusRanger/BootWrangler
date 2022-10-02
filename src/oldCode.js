const kickObject = require('../objects/kickTracker')
const { Client, GatewayIntentBits, AuditLogEvent } = require('discord.js');
const { connect } = require('mongoose')
//removing powers for kicking someone works, now need to properly count the time inbetween disconnects

const kickTracker = {};
const timeOutTimer = 3000000;
const airingOutTimer = 100000;
const bootedPeopleLimit = 3;
let timeOutCorner = new Map();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates
    ]
})

client.commands = new Collection();
connect(mongoConnect, {
}).then(() => console.log("The client is now connected to the database."));

client.on('ready', () => {
    console.log("IM READY TO FLY")
})

function bootGiver() {
    discordJail = new Map();
    for (let [member, time] of timeOutCorner) {
        if (Date.now() - time >= timeOutTimer) {
            let role = member.guild.roles.cache.find(r => r.name === "Boot");
            member.roles.add(role).catch(console.error);
            console.log("you are free, friend")
        } else {
            discordJail.set(member, time);
        }
    }
    //people who are still locked up
    timeOutCorner = discordJail
}

function bootRevoker(abuser) {

    let role = abuser.guild.roles.cache.find(r => r.name === "Boot");
    //console.log(role)
    abuser.roles.remove(role).catch(console.error);
    timeOutCorner.set(abuser, Date.now())
    
}

function newKickTracker(kickNumberOrDefault) {
    let kickLog = new kickObject(Date.now(), kickNumberOrDefault, 1);
    return kickLog;
}

function kickFrequencyCheck(abuser) {
    //if the limit amount of people are kicked within a certain time slot
    if ((abuser.peopleKicked > bootedPeopleLimit) && (Date.now() - abuser.firstKickTime  <  airingOutTimer)) {
        return true
    } else if ((Date.now() - abuser.firstKickTime >= airingOutTimer)) {
        //they havent kicked in a while start back at 1
        abuser.firstKickLogged(Date.now())
        abuser.resetKickedCount()
        return false;
    } else {
        return false;
    }
}

client.on('voiceStateUpdate', async (oldstate, newstate) => {
    //console.log(oldstate.channel, newstate.channel)
    console.log("you are, friend")
    bootGiver()
    console.log("you are still, friend")
    if (!newstate.channel) {
        //console.log("WOTER BOGR")
        const fetchedLogs = await newstate.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberDisconnect,
        });
        
        const kickLog = fetchedLogs.entries.first()
        // Perform a coherence check to make sure that there's *something*
        if (!kickLog) return console.log(`${newstate.user.tag} left the guild, most likely of their own will.`)
        //console.log(kickLog)
        // Now grab the user object of the person who kicked the member
        // Also grab the target of this action to double-check things
        const tagName = kickLog.executor.tag
        //tagName in kickTracker &&
        
        if (tagName in kickTracker) {
            console.log(kickTracker[tagName].lastKickLogCount)
        }
        if ((tagName in kickTracker && kickLog.createdTimestamp >= (Date.now() - 5000)) || (tagName in kickTracker && kickTracker[tagName].lastKickLogCount < kickLog.extra.count)) {
            console.log("block boy")
            
            kickTracker[tagName].increaseKickCount()
            kickTracker[tagName].kickLogCounter(kickLog.extra.count) 
            const memberOBJ = await client.guilds.cache.get(newstate.guild.id).members.fetch(kickLog.executor.id)
            console.log(`${newstate.member.displayName} was booted by ${kickLog.executor.username}`)
            if (kickFrequencyCheck(kickTracker[tagName])) {
                bootRevoker(memberOBJ)
            }
        } else if (!(tagName in kickTracker)) {
         
            const kickNumberOrDefault = kickLog.extra.count <= 0 ? 0 : kickLog.extra.count
            kickTracker[tagName] = newKickTracker(kickNumberOrDefault)
            console.log(`${newstate.member.displayName} was booted by ${kickLog.executor.username}`)
        }
    }
})

client.login(TOKEN)