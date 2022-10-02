const { Schema, model } = require('mongoose');

const kickObject = new Schema({
    _id: Schema.Types.ObjectId,
    firstKickTime: Number,
    lastKickLogCount: Number,
    peopleKicked: Number,
    inJail: Boolean
})

module.exports = model("Abuser", kickObject, "kickObject");
