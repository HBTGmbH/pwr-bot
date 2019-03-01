const COMMAND_NAME = "reload-commands";
const ARG_SYSTEM = "--system";
const ARG_CUSTOM = "--custom";
const {api} = require("@rocket.chat/sdk");

module.exports = class ReloadCommands {

    constructor(driver, manager) {
        this.driver = driver;
        this.manager = manager;
    }

    respondTo(commandArguments, roomname, originalMessage, messageOptions) {
        if (this.authorizedUsers.contains(originalMessage.u.username)) {
            let isSystem = !commandArguments || commandArguments === ARG_SYSTEM;
            let isCustom = !commandArguments || commandArguments === ARG_CUSTOM;
            if (isSystem) {
                this.manager.reloadSystemCommands();
            }
            if (isCustom) {
                this.manager.reloadCustomCommands();
            }
            return "Specified commands reloaded! Type !list-commands for a list of all loaded commands!";
        }
        return "I'm sorry, @" + originalMessage.u.username + ". You are not authorized to perform this action.";
    }

    listensTo(command) {
        return this.keywords.contains(command);
    }

    helpMessage() {

    }

    getName() {
        return COMMAND_NAME;
    }

    applyConfig(config) {
        if (config && config.keywords) {
            this.keywords = config.keywords;
        } else {
            this.keywords = [COMMAND_NAME];
        }

        if (config && config["authorized-users"]) {
            this.authorizedUsers = config["authorized-users"];
        } else {
            this.authorizedUsers = [];
        }
    }
};