class kickObject {

    constructor(kickTime, kickLogCount, peopleKicked) {
        //refreshes every airingOutTimer interval, timestamp of first kick
        this.firstKickTime = kickTime;
        this.lastKickLogCount = kickLogCount;
        this.peopleKicked = peopleKicked;
    }

    firstKickLogged(time) {
        this.firstKickTime = time;
    }

    kickLogCounter(logValue) {
        this.lastKickLogCount = logValue;
    }
    resetKickedCount() {
        this.peopleKicked = 1;
    }
    
    increaseKickCount() {
        this.peopleKicked++;
    } 
}

module.exports = kickObject
