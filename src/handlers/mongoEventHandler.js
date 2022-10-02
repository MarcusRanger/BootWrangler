async function loadMongoEvents(client) {
    const { loadFiles } = require("../functions/fileLoader");
    const { connection } = require('mongoose');
    const ascii = require("ascii-table");
    const table = new ascii().setHeading("Database", "Status");

    const Files = await loadFiles("src/mongo");
    Files.forEach(file => {
        const event = require(file);

        const execute = (...args) => event.execute(...args, client);
        client.events.set(event.name, execute);

        if (event.once) {
            connection.once(event.name, execute)
        } else {
            connection.on(event.name, execute);
        }
        
        table.addRow(event.name, "🟩")
    });

    return console.log(table.toString());
}

module.exports = { loadMongoEvents };