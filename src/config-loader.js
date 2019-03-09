const fs = require('fs');
const PwrLogger = require("./util/pwr-logger").PwrLogger;
yaml = require('js-yaml');

const log = new PwrLogger();

function loadFromLocation(location) {
    let fileContent;
    try {
        fileContent = fs.readFileSync(location);
    } catch (e) {
        throw new Error(`Could not read bot configuration @ ${location}!` +
            `Make sure that file exists. If it's a relative path,` +
            `make sure that the configuration is relative to the executing location!`);
    }
    if (!fileContent) {
        throw new Error("Could not load bot configuration file from location " + location);
    }
    const parsedConfig =  yaml.safeLoad(fileContent);
    if (!parsedConfig) {
        throw new Error("Could not parse config from location" + fullPath);
    }
    log.info(`Found configration at location ${location}. Full path is ${fs.realpathSync(location)}`);
    return parsedConfig;
}

/**
 * Loads the configuration. Location is resolved via environment. If no env is set, default location is used.
 */
function loadConfiguration() {
    const envLocation = process.env["CONFIG_LOCATION"];
    if (envLocation) {
        return loadFromLocation(envLocation);
    } else {
        try {
            return loadFromLocation("./config.yaml");
        } catch (e) {
            return loadFromLocation("./../config.yaml");
        }

    }
}

module.exports.loadConfiguration = loadConfiguration;



