const fs = require('fs');

function toCommand(basePath, driver, manager) {
    return (file) => {
        console.log(require(basePath + "/" + file));
        return new(require(basePath + "/" + file))(driver, manager);
    }
}

function loadCommandsFrom(directory, driver, manager) {
    console.log(fs.readdirSync(directory));
    return fs.readdirSync(directory)
        .filter(file => file.endsWith(".js"))
        .filter(file => !file.endsWith(".test.js"))
        .map(toCommand(directory, driver, manager));
}

module.exports.loadCommands = loadCommandsFrom;