const loadConfiguration = require("../config-loader").loadConfiguration;
const PwrLogger = require("../util/pwr-logger").PwrLogger;
const cmd = require("../util/cmd").cmd;

const log = new PwrLogger("SelfUpdate");

module.exports =  class SelfUpdate {

    constructor(driver, manager) {
        this.manager = manager;
        this.driver = driver;
        this.authorizedUsers = [];
    }

    respondTo(commandArguments, roomname, originalMessage, messageOptions) {
        if (!this.isAllowed(originalMessage.u)) {
            return "You are not authorized to perform this action.";
        }
        this.update(originalMessage.rid);
        return "Performing self-update. I will notify you of the onging process ...";
    }

    async update(room) {
        try {
            await cmd("git", ["pull"]);
            this.driver.sendToRoomId("... Updated source code to the latest version", room);
            this.manager.applyConfiguration(loadConfiguration());
            this.driver.sendToRoomId("... Applied configuration", room);
            this.manager.reloadSystemCommands();
            this.driver.sendToRoomId("... Reloaded system commands", room);
            this.manager.reloadCustomCommands();
            this.driver.sendToRoomId("... Reloaded custom commands", room);
            this.driver.sendToRoomId("... Self update completed. Type !help for more information.", room);
        } catch (e) {
            this.driver.sendToRoomId("... Self update failed! Reason: " + e, room);
        }
    }

    listensTo(command) {
        return command === "self-update";
    }

    getName() {
        return "self-update";
    }

    applyConfig(config) {
        this.authorizedUsers = config["authorized-users"];
    }

    helpMessage() {
        return ""; // no help message
    }

    isAllowed(user) {
        return this.authorizedUsers.contains(user.username);
    }
};