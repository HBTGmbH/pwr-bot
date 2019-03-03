const LOGGING_CONFIGURATION = {
    error: true,
    warn: true,
    info: true,
    log: true,
    debug: false
};

module.exports.LOGGING_CONFIGURATION = LOGGING_CONFIGURATION;

/**
 * A simple logger abstraction that forwards to console.x, but makes it controllable by properties
 */
module.exports.PwrLogger = class {

    constructor(name) {
        this.name = name;
    }

    info(message, ...args) {
        if (LOGGING_CONFIGURATION.info) {
            console.info(this.formatMessage(message, "INFO"), args);
        }
    }
    warn(message, ...args) {
        if (LOGGING_CONFIGURATION.warn) {
            console.warn(this.formatMessage(message, "WARN"), args);
        }
    }
    log(message, ...args) {
        if (LOGGING_CONFIGURATION.log) {
            console.log(this.formatMessage(message, "LOG"), args);
        }
    }
    error(message, ...args) {
        if (LOGGING_CONFIGURATION.error) {
            console.error(this.formatMessage(message, "ERROR"), args);
        }
    }
    debug(message, ...args) {
        if (LOGGING_CONFIGURATION.debug) {
            console.error(this.formatMessage(message, "DEBUG"), args);
        }
    }

    formatMessage(message, level) {
        if (this.name) {
            return "[{0}] {1}: {2}".format(level, this.name, message);
        }
        return message;
    }
};