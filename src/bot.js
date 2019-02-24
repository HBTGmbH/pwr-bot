const loadConfiguration = require("./config-loader").loadConfiguration;
const config = loadConfiguration();
process.env["ROCKETCHAT_URL"] = config.bot.host;
process.env["ROCKETCHAT_USER"] = config.bot.user;
process.env["ROCKETCHAT_PASSWORD"] = config.bot.password;


const Manager = require('./manager');
const {driver, api} = require('@rocket.chat/sdk');
const ignored = require("./utils");

async function connectManager() {
    console.log("Connecting bot manager and registering callbacks!");
    const manager = new Manager(driver, config, api);
    await manager.login();
    console.log("Bot manager is connected and is waiting for messages!");
    manager.reloadSystemCommands();
    manager.reloadCustomCommands();
    manager.joinDefaultRooms();
}

function disconnectAndExit() {
    console.log("Disconnecting bot and closing app.");
    driver.disconnect()
        .then(() => process.exit())
        .catch(() => process.exit());
}

process.on('exit', disconnectAndExit);
process.on('SIGUSR1', disconnectAndExit);
process.on('SIGUSR2', disconnectAndExit);
process.on('SIGINT', disconnectAndExit);
process.on('SIGTERM', disconnectAndExit);
connectManager();