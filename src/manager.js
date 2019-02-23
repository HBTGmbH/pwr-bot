const loadCommands = require("./command-loader").loadCommands;
const greetings = ["Achtung, Achtung! Eine Wichtige Mitteilung! {0} ist da!"];
const MAX_MSG_AGE_MS = 60 * 1000;
module.exports = class Manager {

    constructor(driver, configuration) {
       this.commands = [];
       this.driver = driver;
       this.id = null;

       this.rooms = configuration.bot["default-rooms"];
       this.botName = configuration.bot["name"];
       this.user = configuration.bot["user"];
       this.password = configuration.bot["password"];
       this.host = configuration.bot["host"];

       this.configuration = configuration;
    }

    async login() {
        const conn = await this.driver.connect( { host: this.host, useSsl: true})
        console.log("Connected!");
        this.id = await this.driver.login({username: this.user, password: this.password});
        console.log("Logged in " + this.id);
        await this.driver.subscribeToMessages();
        console.log("Subscribed to messages");
        await this.driver.reactToMessages(this.getHandler());
    }

    register(command) {
        if (command) {
            if (command.getName && command.applyConfig && command.getName()) {
                const commandConfig = this.configuration["command-config"][command.getName()];
                command.applyConfig(commandConfig);
            }
            this.commands.push(command);
        }
    };

    handleErrorInCommand(error, originalMessage, room) {
        console.error(error);
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
        listener.respondTo(commandArguments, room, originalMessage,  messageOptions)
            .then(this.sendResponseToRoom(room))
            .catch(error => this.handleErrorInCommand(error, originalMessage.msg, room))
    }

    static messageOf(msg) {
        if (msg.msg.indexOf("@power") >= 0) {
            return /.*@power(.*)/.exec(msg.msg)[1];
        } else {
            return msg.msg;
        }
    }

    getHandler() {
        return async (error, msg, messageOptions) => {
            const roomId = msg.rid;
            let message = Manager.messageOf(msg);
            if (!Manager.isTooOld(msg) && !this.isSelf(msg) && Manager.isCommand(message)) {
                const command = /!(\S*)\s*.*/.exec(message)[1];
                if (command) {
                    const commandArguments = message.substr(command.length + 2, message.length - 1);
                    const roomName =  await  this.driver.getRoomName(roomId);
                    this.commands
                        .filter(listener => listener.listensTo(command))
                        .forEach(listener => this.handleOne(listener, commandArguments, roomName, msg, messageOptions));
                }
            }
        }
    }

    join(room) {
        this.rooms.push(room);
        this.driver
            .joinRoom(room)
            .then(v => this.greetRoom(room))
            .catch(error => console.error("Could not join room " + room, error))
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
        return this.commands;
    }

    reloadCustomCommands() {
        loadCommands(this.configuration.commands["custom-location"], this.driver, null /* These commands dont get the manager*/)
            .forEach(command => this.register(command));
    }

    reloadSystemCommands() {
        loadCommands(this.configuration.commands["system-location"], this.driver, this).forEach(command => this.register(command));
    }

    static isCommand(msg) {
        return msg.trim().startsWith("!")
    }

    static isTooOld(msg) {
        const msgTimestamp = msg.ts.$date;
        const now = new Date().getTime();
        return now - msgTimestamp >= MAX_MSG_AGE_MS;
    }
};