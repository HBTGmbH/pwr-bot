const fs = require('fs');
yaml = require('js-yaml');

function loadFromLocation(location) {
    const fileContent = fs.readFileSync(location);
    if (!fileContent) {
        throw new Error("Could not load bot configuration file from location " + location);
    }
    const parsedConfig =  yaml.safeLoad(fileContent);
    if (!parsedConfig) {
        throw new Error("Could not parse config from location" + fullPath);
    }
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
        return loadFromLocation("config.yaml");
    }
}

module.exports.loadConfiguration = loadConfiguration;



