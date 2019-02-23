const Manager = require('./manager');
const loadConfiguration = require("./config-loader").loadConfiguration;
const {driver} = require('@rocket.chat/sdk');
const ignored = require("./utils");


async function connectManager() {
    console.log("Connecting bot manager and registering callbacks!");
    const manager = new Manager(driver, loadConfiguration());
    await manager.login();
    console.log("Bot manager is connected and is waiting for messages!");
    manager.reloadSystemCommands();
    manager.reloadCustomCommands();
    manager.joinDefaultRooms();
}

connectManager();