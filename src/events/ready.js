const { loadCommands } = require('../handlers/commandHandler')

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        console.log("Im ready to tussle, your boots better be in order");
        loadCommands(client)
    }
}