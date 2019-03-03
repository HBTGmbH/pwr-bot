/**
 * Bot that queries against HBTs internal API to find out who knows what!
 */
module.exports = class WhoKnows {

    constructor() {
        this.axios = null;
        this.commands = ["who-knows", "wer-weiß", "häää?", "hää?", "wat?"]
    }

    async onInit() {
        this.axios = await pwrRequire("axios");
    }

    requestUsages(skill) {
        const payload = [skill];
        let auth = undefined;
        if (this.username && this.password) {
            auth = {
                auth: {
                    username: this.username,
                    password: this.password
                }
            }
        }
        return this.axios.post(this.url, payload, auth)
            .then(response => response.data)
    }

    fancyResponseFor(searchTerm) {
        return usages => {
            const usageList = usages.join(", ");
            if (usages.length <= 0) {
                return searchTerm + " kann leider niemand ;(";
            }
            if (usages.length === 1) {
                return searchTerm + " kann natürlich nur " + usageList;
            }
            if (usages.length > 10) {
                return searchTerm + " können echt viele! Unter anderem " + usageList;
            }
            if (usages.length > 20) {
                return searchTerm + " kann nun wirklich fast jeder: " + usageList;
            }
            return searchTerm + " wird gekonnt von " + usageList;
        }
    }

    determineUsages(searchTerm) {
        return this.requestUsages(searchTerm)
            .then(usages => usages.map(entry => entry.fullName))
            .then(names => names.sort())
            .then(this.fancyResponseFor(searchTerm));
    }

    requestUsagePromise(msg) {
        return (resolve, reject) => {
            this.determineUsages(msg)
                .then(usagesResponse => resolve(usagesResponse))
                .catch(e => reject(e.toString()))
        }
    }

    respondTo(commandArguments, roomname, originalMessage, messageOptions) {
        console.log("Responding to message " + commandArguments + " in room " + roomname);
        return new Promise(this.requestUsagePromise(commandArguments));
    }

    listensTo(command) {
        return this.commands.indexOf(command) >= 0;
    }

    getName() {
        return "who-knows";
    }

    applyConfig(config) {
        this.url = config.url;
        this.username = config.username;
        this.password = config.password;
    }

    helpMessage() {
        return "*!who-knows <skill-name>*\n" +
            "Gibt eine Liste von Kollegen zurück, die den angegebenen Skill beherrschen.\n" +
            "Die Liste wird durch die API von HBT Power bereitgestellt, die Suche ist (noch) case sensitive.\n" +
            " Alias: !wer-weiß, !häää?, !who-knows, wat?";
    }
}