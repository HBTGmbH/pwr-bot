module.exports = class Help {

    constructor(driver, manager) {
        this.manager = manager;
    }

    handleHelp() {
        const helps = this.manager.getCommands()
            .map(listener => listener.helpMessage())
            .filter(msg => !!msg)
            .join("\n");
        return "*{0} kennt folgendes: *\n{1}".format(this.manager.botName, helps);
    }

    helpPromise() {
        return (resolve, reject) => resolve(this.handleHelp());
    }

    respondTo(commandArguments, roomname, originalMessage, messageOptions) {
        return this.handleHelp();
    }

    listensTo(command) {
        return this.keywords.contains(command);
    }

    helpMessage() {
        return "*!help*\n" + "Gibt diese Hilfe aus"
    }

    /**
     * Identifies the command for config resolving
     */
    getName() {
        return "help";
    }

    applyConfig(config) {
        this.keywords = config.keywords;
    }
};