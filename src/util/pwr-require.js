const PwrLogger = require("./pwr-logger").PwrLogger;
const { execSync } = require('child_process');

const log = new PwrLogger("PwrRequire");

let config = {
    installScript: "npm install --save {0}",
};

module.exports.setInstallScript = function (script) {
    config.installScript = script;
};

module.exports.pwrRequire = async function (dependencyName) {
    try {
        log.debug(`Requiring "${dependencyName}".`);
        return require(dependencyName);
    } catch (e) {
        log.debug(`Module "${dependencyName}" not found. Installing with {0}`.format(config.installScript.format(dependencyName)));
        execSync(config.installScript.format(dependencyName));
        log.debug(`Module "${dependencyName}" installed!`);
        await setImmediate(() => {});
        try {
            return require(dependencyName);
        } catch (e) {
            log.error(`Could not include "${dependencyName}". Restart the script!`);
            throw e;
        }
    }
};