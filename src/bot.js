const loadConfiguration = require("./config-loader").loadConfiguration;
const config = loadConfiguration();
process.env["ROCKETCHAT_URL"] = config.bot.host;
process.env["ROCKETCHAT_USER"] = config.bot.user;
process.env["ROCKETCHAT_PASSWORD"] = config.bot.password;


const Manager = require('./manager');
const {driver, api} = require('@rocket.chat/sdk');
const ignored = require("./utils");
const LOGGING_CONFIGURATION = require("./util/pwr-logger").LOGGING_CONFIGURATION;
const {PwrLogger} = require("./util/pwr-logger");

const botLog = new PwrLogger("BotInitializer");
const rocketChatLog = new PwrLogger("RocketChatSDK");

async function connectManager() {
    botLog.info("Bootstrapping bot.");
    const manager = new Manager(driver, config, api);
    await manager.login();
    botLog.info("Bootstrapping completed. Loading commands.");
    manager.reloadSystemCommands();
    manager.reloadCustomCommands();
    manager.joinDefaultRooms();
}

function disconnectAndExit() {
    botLog.info("Disconnecting bot and closing app.");
    driver.disconnect()
        .then(() => process.exit())
        .catch(() => process.exit());
}

function patchLogging(loggingConfig) {
    if (loggingConfig) {
        if (loggingConfig.error !== undefined) {
            LOGGING_CONFIGURATION.error = loggingConfig.error
        }
        if (loggingConfig.warn !== undefined) {
            LOGGING_CONFIGURATION.warn = loggingConfig.warn
        }
        if (loggingConfig.info !== undefined) {
            LOGGING_CONFIGURATION.info = loggingConfig.info
        }
        if (loggingConfig.debug !== undefined) {
            LOGGING_CONFIGURATION.debug = loggingConfig.debug
        }
        if (loggingConfig.info !== undefined) {
            LOGGING_CONFIGURATION.info = loggingConfig.info
        }
    }
}
botLog.info("Bootstrapping Pwr-bot. Configuration: ({0})".format(config ? "YES" : "NO"));
patchLogging(config.logging);
process.on('exit', disconnectAndExit);
process.on('SIGUSR1', disconnectAndExit);
process.on('SIGUSR2', disconnectAndExit);
process.on('SIGINT', disconnectAndExit);
process.on('SIGTERM', disconnectAndExit);
driver.useLog(rocketChatLog);
connectManager();