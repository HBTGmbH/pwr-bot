/**
 * A cache for all messages already processed by the bot.
 * This is necessary because for some weird reason, the Rocket Chat SDK reacts to messages twice
 */
module.exports = class ProcessedMessageCache {

    constructor() {
        this.procssed = new Set();
    }

    add(messageId) {
        this.procssed.add(messageId);
    }

    contains(messageId) {
        return this.procssed.has(messageId);
    }

};