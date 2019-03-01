const commandRegEx = /(\d*)([smhd])\s*(.*)/; // <any number><smhdMy><whitespace><anything>

class Due {
    constructor(dueDate, roomId, userName, message) {
        this.dueDate = dueDate;
        this.roomID = roomId;
        this.message = "Hey " + userName + "! Du wolltest doch " + message;
    }

    isDue(current) {
        return current > this.dueDate;
    }
}

module.exports = class RemindMe {

    constructor(driver) {
        this.driver = driver;
        this.dues = [];
        this.initDueChecks();
    }

    factorFor(unit) {
        switch (unit) {
            case 's':
                return 1000; // 1s = 1000ms
            case 'm':
                return 60 * this.factorFor('s');
            case 'h':
                return 60 * this.factorFor('m');
            case 'd':
                return 24 * this.factorFor('h');
            default:
                throw new Error("Unknown unit " + unit + ". This is most likely a regex error");
        }
    }

    dueDateFor(qty, unit) {
        const currentTime = new Date().getTime();
        return currentTime + (qty * this.factorFor(unit));
    }

    static chooseMessage(regexMatch) {
        if (!!regexMatch[3]) {
            return regexMatch[3]
        } else {
            return "Du wolltest an irgend etwas erinnert werden. An was? Keine Ahnung!";
        }
    }

    commandToDue(command, userName) {
        const matches = commandRegEx.exec(command);
        if (!matches) {
            throw new Error("Ungültiger remind-me Befehl: " + command);
        }
        const qty = Number.parseInt(matches[1]);
        const unit = matches[2];
        let msg = RemindMe.chooseMessage(matches);
        if (!qty || !msg) {
            // Probably a faulty regex
            throw new Error("Ungültiger remind-me Befehl: " + command);
        }
        return this.driver
            .getDirectMessageRoomId(userName)
            .then(roomId => new Due(this.dueDateFor(qty, unit), roomId, userName, msg));
    }

    commandPromise(command, userName) {
        return (resolve, reject) => {
            try {
                this.commandToDue(command, userName)
                    .then(due => this.addDue(due))
                    .catch(error => reject(error.toString()))
            } catch (e) {
                reject(e.toString())
            }
        }
    }

    respondTo(command, roomName, msg, messageOptions) {
        return new Promise(this.commandPromise(command, msg.u.username));
    }

    listensTo(command) {
        return command === "remind-me"; // We dont listen to any commands. Class only exists for helpMessage();
    }

    helpMessage() {
        return "*!remind-me <dauer><unit> <Message>*\n" +
            "Schickt einen DM-Reminder Nach ablauf des Intervals. Unit ist s=Sekunde, m=Minute, h=Stunde, d=Tag" +
            "\nBeispiel: !remind-me 5h Unittests fixen"
    }

    addDue(due) {
        this.dues.push(due);
    }

    executeDue(due) {
        this.driver.sendToRoomId(due.message, due.roomID);
    }

    dueChecker() {
        return () => {
            const now = new Date();
            const allDues = this.dues;
            this.dues = this.dues.filter(due => !due.isDue(now));
            allDues
                .filter(due => due.isDue(now))
                .forEach(due => this.executeDue(due));
            setTimeout(this.dueChecker(), 500);
        }
    }

    initDueChecks() {
        setTimeout(this.dueChecker(), 500);
    }
};