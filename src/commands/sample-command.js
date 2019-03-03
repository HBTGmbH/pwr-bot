
/**
 * Bot that queries against HBTs internal API to find out who knows what!
 */
module.exports =  class SampleCommand {

    constructor() {
    }

    /**
     * You can use this method to initialize dependencies and necessary libraries.
     * This is a trade-off made to allow usage of the pwrRequire() function.
     */
    async onInit() {
        this.axios = await pwrRequire("axios");
    }

    /**
     * The manager will call this method if it thinks you should react to it.
     *
     * You can return either a string or a Promise. If you return a promise, make
     * sure that it resolves to string. A rejection of the promise will result in a
     * default error message to the room the original message was sent.
     *
     * Both the originalMessage and messageOptions are the rocketchats SDKs objects.
     */
    respondTo(commandArguments, roomname, originalMessage, messageOptions) {
        return "Sample command works!";
    }

    /**
     * Command will be everything between the first '!' and the first whitespace. Return true if you want to listen to the
     * command, return false if you don't
     * @param command
     * @returns {boolean}
     */
    listensTo(command) {
        return command === "sample";
    }

    /**
     * Implement this method if you want advanced control over your command.
     * In general, commands are identified by this name.
     *
     * If no name is provided, the class name is used, but this may not work on all features that
     * interact with other commands. Providing no name also removed the ability for the bot
     * to get configuration properties provided.
     * @returns {string}
     */
    getName() {
        return "sample";
    }


    /**
     * Config contains a sub-set of properties provided through the central configuration file.
     * See config file for more information on how to provide properties to a command!
     * @param config
     */
    applyConfig(config) {
        this.sampleProperty = config.sampleProperty;
    }

    /**
     * Implement this method to provide a help message when the !help command is issued to the bot.
     */
    helpMessage() {
        return "*!who-knows <skill-name>*\n" +
            "Gibt eine Liste von Kollegen zurück, die den angegebenen Skill beherrschen.\n" +
            "Die Liste wird durch die API von HBT Power bereitgestellt, die Suche ist (noch) case sensitive.\n" +
            " Alias: !wer-weiß, !häää?, !who-knows, wat?";
    }
}