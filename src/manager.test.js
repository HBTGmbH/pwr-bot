const Manager = require("./manager");
const expectThrown = require("./util/test-utils").expectThrown;

describe("manager tests", () => {

    let config;

    beforeEach(() => {
        config = {
            bot: {
                "default-rooms": ["test-room", "test-room-2"],
                "name": "Botly",
                "user": "bot-bot",
                "password": "secret",
                "host": "https://test.test"
            },
            commands: {
                ignored: ["sample"]
            }
        };
    });

    it('should adapt the configuration', function () {
        const manager = new Manager(null, config, null);
        expect(manager.rooms).toEqual(expect.arrayContaining(["test-room", "test-room-2"]));
        expect(manager.ignored).toContain("sample");
        expect(manager.botName).toBe("Botly");
        expect(manager.user).toBe("bot-bot");
        expect(manager.host).toBe("https://test.test");
        expect(manager.password).toBe("secret");
    });

    it('should throw an exception because the username is missing', function () {
        config.bot.user = null;
        const exception = expectThrown(() => new Manager(null, config, null));
        expect(exception.message).toBe("Mandatory configuration paremeter 'bot.user' is missing!");
    });

    it('should throw an exception because the password is missing', function () {
        config.bot.password = null;
        const exception = expectThrown(() => new Manager(null, config, null));
        expect(exception.message).toBe("Mandatory configuration paremeter 'bot.password' is missing!");
    });

    it('should throw an exception because the host is missing', function () {
        config.bot.host = null;
        const exception = expectThrown(() => new Manager(null, config, null));
        expect(exception.message).toBe("Mandatory configuration paremeter 'bot.host' is missing!");
    });
});