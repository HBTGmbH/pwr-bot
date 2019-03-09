const loadCommands = require("./command-loader").loadCommands;
const ProcessedMessageCache = require("./util/processed-message-cache");
const PwrLogger = require("./util/pwr-logger").PwrLogger;
const greetings = ["Achtung, Achtung! Eine Wichtige Mitteilung! {0} ist da!"];
const MAX_MSG_AGE_MS = 60 * 1000;


/**
 * A message is a direct message when the roomId starts with the userId
 */
function isDirectMessage(msg) {
    return msg.rid.startsWith(msg.u._id);
}

function isCommand(msg) {
    return msg.trim().startsWith("!")
}

function nameOf(command) {
    if (command && command.getName) {
        return command.getName();
    }
    if (command && command.constructor) {
        return  command.constructor.name;
    }
    return undefined;
}

function requireConfiguration(configuredValue, propertyName) {
    if (!configuredValue) {
        throw new Error(`Mandatory configuration paremeter '${propertyName}' is missing!`)
    }
}

const log = new PwrLogger("Manager");

module.exports = class Manager {

    constructor(driver, configuration, api /*rocketchat api*/) {
        this.systemCommands = [];
        this.customCommands = [];
        this.driver = driver;
        this.id = null;
        this.api = api;
        this.processingCache = new ProcessedMessageCache();
        this.applyConfiguration(configuration);
    }

    applyConfiguration(configuration) {
        // These are the rooms the bot listens to. Only if the message is received in one of those rooms
        // (or if the bot is DM'ed), it will respond to the message.
        this.rooms = configuration.bot["default-rooms"];
        this.botName = configuration.bot["name"];
        this.user = configuration.bot["user"];
        this.password = configuration.bot["password"];
        this.host = configuration.bot["host"];

        if (configuration.commands && configuration.commands.ignored) {
            this.ignored = configuration.commands.ignored;
        } else {
            this.ignored = [];
        }

        this.configuration = configuration;
        requireConfiguration(this.host, "bot.host");
        requireConfiguration(this.password, "bot.password");
        requireConfiguration(this.user, "bot.user");
        return this;
    }

    async login() {
        const conn = await this.driver.connect({host: this.host, useSsl: true})
        log.info("Connected! Now logging in to RocketChat server @ {0}", this.host);
        this.id = await this.driver.login({username: this.user, password: this.password});
        await this.api.login();
        log.info("Logged in! Login ID is {0}", this.id);
        await this.driver.subscribeToMessages();
        log.info("Subscribing to messages");
        await this.driver.reactToMessages(this.getHandler());
    }

    handleErrorInCommand(error, originalMessage, room) {
        log.error(error);
        this.driver.sendToRoom(error, room);
    }

    sendResponseToRoom(room) {
        return response => {
            this.driver.sendToRoom(response, room)
        }
    }

    handleOne(listener, commandArguments, room, originalMessage, messageOptions) {
        // Listener respondTo arguments:
        // commandArguments, roomname, originalMessage, messageOptions
        const response = listener.respondTo(commandArguments, room, originalMessage, messageOptions);
        if (response && response.then) {
            // We have a promise, use async
            response.then(this.sendResponseToRoom(originalMessage.rid))
                .catch(error => this.handleErrorInCommand(error, originalMessage.msg, originalMessage.rid))
        } else if (response && typeof response === "string") {
            // Not a promise, just a plain old string. Send to room
            this.driver.sendToRoom(response, originalMessage.rid);
        } else if (response) {
            // Command screwed up. Log it out.
            log.warn("Received unknown response {0} from command {1}", response, listener.getName());
        }

    }

    static messageOf(msg) {
        if (msg.msg.indexOf("@power") >= 0) {
            return /.*@power(.*)/.exec(msg.msg)[1];
        } else {
            return msg.msg;
        }
    }

    getHandler() {
        return (error, msg, messageOptions) => {
            this.driver.getRoomName(msg.rid).then(roomName => {
                const message = Manager.messageOf(msg);
                if (!this.isSelf(msg)
                    && isCommand(message)
                    && (this.rooms.contains(roomName) || isDirectMessage(msg)))
                {
                    const command = /!(\S*)\s*.*/.exec(message)[1];
                    if (command && !this.processingCache.contains(msg._id)) {
                        this.processingCache.add(msg._id);
                        const commandArguments = message.substr(command.length + 2, message.length - 1);
                        this.allCommands()
                            .filter(listener => listener.listensTo(command))
                            .forEach(listener => this.handleOne(listener, commandArguments, roomName, msg, messageOptions));
                    }
                }
            });
        }
    }

    join(room) {
        this.rooms.push(room);
        this.driver
            .joinRoom(room)
            .then(v => this.greetRoom(room))
            .catch(error => log.error("Could not join room " + room, error))
    }

    joinDefaultRooms() {
        this.rooms.forEach(room => this.join(room));
    }

    greetRoom(room) {
        const greeting = greetings.random();
        this.driver.sendToRoom(greeting.format(this.name), room);
    }

    isSelf(msg) {
        return msg.u._id === this.id;
    }

    getCommands() {
        return [...this.allCommands()];
    }

    reloadCustomCommands() {
        this.customCommands = [];
        loadCommands(this.configuration.commands["custom-location"], this.driver, null /* These commands dont get the manager*/)
            .forEach(command => this.registerCustomCommand(command));
    }

    reloadSystemCommands() {
        this.systemCommands = [];
        loadCommands(this.configuration.commands["system-location"], this.driver, this).forEach(command => this.registerSystemCommand(command));
    }

    registerCustomCommand(command) {
        this.registerCommand(command, this.customCommands);
    }

    registerSystemCommand(command) {
        this.registerCommand(command, this.systemCommands)
    };

    registerCommand(command, collection) {
        const commandName = nameOf(command);
        if (command && !this.ignored.contains(commandName)) {
            log.debug(`Registering "${commandName}"`);
            if (commandName && command.applyConfig) {
                const commandConfig = this.configuration["command-config"][commandName];
                command.applyConfig(commandConfig);
            }
            collection.push(command);
            if (command.onInit) {
                command.onInit();
            }

        }
    }

    allCommands() {
        return [...this.systemCommands, ...this.customCommands];
    }
};