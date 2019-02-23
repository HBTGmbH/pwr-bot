function toName(command) {
    if (command.getName && command.getName()) {
        return command.getName();
    }
    return command.constructor.name;
}

const TO_CSV = ", ";

module.exports = class ListCommands {

    constructor(driver, manager) {
        this.manager = manager;
    }

    listArguments() {
        const commandList = this.manager.getCommands()
            .map(toName)
            .join(TO_CSV);
        return "The following commands are registered: {0}".format(commandList);
    }

    listArgPromise() {
        return (resolve, reject) => resolve(this.listArguments());
    }

    respondTo(commandArguments, roomname, originalMessage, messageOptions) {
        // Original message structure:
        // originalMessage.u = user
        // originalMessage.u.username = login name of user
        // originalMessage.u._id = ID of user (also, room name of users DM channel)
        // originalMessage.u.name = display name of user
        const requestingUser = originalMessage.u.username;
        if (this.authorizedUsers.contains(requestingUser)) {
            return new Promise(this.listArgPromise());
        } else {
            return new Promise(resolve => resolve(""));
        }
    }

    listensTo(command) {
        return this.keywords.contains(command);
    }

    helpMessage() {
        return ""
    }

    /**
     * Identifies the command for config resolving
     */
    getName() {
        return "list-commands";
    }

    applyConfig(config) {
        this.keywords = config.keywords;
        this.authorizedUsers = config["authorized-users"];
    }
};