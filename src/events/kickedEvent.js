const { AuditLogEvent } = require('discord.js');
const kickObject = require('../objects/kickTracker')
const client = require('../index')
module.exports = {
    name: "voiceStateUpdate",
    once: false,
    async execute(oldstate, newstate) {
        console.log(`Im ready to tussle ${oldstate}`);
        runEvent(newstate)
    }
}

const kickTracker = {};
const timeOutTimer = 30000;
const airingOutTimer = 100000;
const bootedPeopleLimit = 1;
let timeOutCorner = new Map();

function bootGiver() {
    discordJail = new Map();
    for (let [member, time] of timeOutCorner) {
        let laspedTime = Date.now() - time
        if (laspedTime >= timeOutTimer) {
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
    let laspedTimeSinceFirstKick = Date.now() - abuser.firstKickTime
    if ((abuser.peopleKicked > bootedPeopleLimit) && (laspedTimeSinceFirstKick < airingOutTimer)) {
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

async function runEvent(newstate) {
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
        const tagInKickTracker = tagName in kickTracker
        const recentlyCreatedLog = kickLog.createdTimestamp >= (Date.now() - 5000)
        
        if ((tagInKickTracker && recentlyCreatedLog) || (tagInKickTracker && kickTracker[tagName].lastKickLogCount < kickLog.extra.count)) {
            console.log("block boy")
            
            kickTracker[tagName].increaseKickCount()
            kickTracker[tagName].kickLogCounter(kickLog.extra.count)
            const memberOBJ = await client.guilds.cache.get(newstate.guild.id).members.fetch(kickLog.executor.id)
            console.log(`${newstate.member.displayName} was booted by ${kickLog.executor.username}`)
            if (kickFrequencyCheck(kickTracker[tagName])) {
                bootRevoker(memberOBJ)
            }
        } else if (!(tagInKickTracker)) {
            
            const kickNumberOrDefault = kickLog.extra.count <= 0 ? 0 : kickLog.extra.count
            kickTracker[tagName] = newKickTracker(kickNumberOrDefault)
            console.log(`${newstate.member.displayName} was booted by ${kickLog.executor.username}`)
        }
    }
}