const fs = require('fs');
const PwrLogger = require("./util/pwr-logger").PwrLogger;

const log = new PwrLogger("CommandLoader");

function toCommand(basePath, driver, manager) {
    return (file) => {
        const path = basePath + "/" + file;
        log.info(`Loading command ${path}`.format(path));
        delete require.cache[require.resolve(path)];
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