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
            if (args.length >= 1) {
                console.info(this.formatMessage(message, "INFO"), args);
            } else {
                console.info(this.formatMessage(message, "INFO"));
            }
        }
    }
    warn(message, ...args) {
        if (LOGGING_CONFIGURATION.warn) {
            if (args.length >= 1) {
                console.warn(this.formatMessage(message, "WARN"), args);
            } else {
                console.warn(this.formatMessage(message, "WARN"));
            }
        }
    }
    log(message, ...args) {
        if (LOGGING_CONFIGURATION.log) {
            if (args.length >= 1) {
                console.log(this.formatMessage(message, "LOG"), args);
            } else {
                console.log(this.formatMessage(message, "LOG"));
            }
        }
    }
    error(message, ...args) {
        if (LOGGING_CONFIGURATION.error) {
            if (args.length >= 1) {
                console.error(this.formatMessage(message, "ERROR"), args);
            } else {
                console.error(this.formatMessage(message, "ERROR"));
            }
        }
    }
    debug(message, ...args) {
        if (LOGGING_CONFIGURATION.debug) {
            if (args.length >= 1) {
                console.debug(this.formatMessage(message, "DEBUG"), args);
            } else {
                console.debug(this.formatMessage(message, "DEBUG"));
            }
        }
    }

    formatMessage(message, level) {
        if (this.name) {
            return "[{0}] {1}: {2}".format(level, this.name, message);
        }
        return message;
    }
};