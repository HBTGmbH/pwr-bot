const ListCommands = require("./list-commands");
const Manager = require("./../manager");
// Bootstrap utilities
require("./../utils");

describe("List commands", () => {

    let command;
    let manager;

    const defaultConfig = () => {
        return {
            bot: {
                "user": "foo",
                "password": "foo",
                "host": "foo"
            },
            "command-config": {
                "list-commands": {
                    "keywords": "test",
                    "authorized-users": ["jane.doe"]
                },
            }
        };
    };

    const defaultOriginalMessage = () => {
        return {
            u: {username: "jane.doe"}
        };
    };

    beforeEach(() => {
        // Just some default config to avoid problems/type errors in the test
        const config = defaultConfig();
        manager = new Manager({}, config);
        command = new ListCommands(null, manager);
        manager.registerCustomCommand(command);
    });

    test('should be instantiable', () => {
        expect(command).toBeTruthy();
    });

    test('should provide a name', () => {
        expect(command.getName()).toBe("list-commands");
    });

    test('should not provide a help', () => {
        expect(command.helpMessage()).toBeFalsy();
    });

    test('Should listen to configured keywords', () => {
        command.applyConfig({keywords: ["list-commands", "listcommands"]});
        expect(command.listensTo("list-commands")).toBeTruthy();
        expect(command.listensTo("listcommands")).toBeTruthy();
    });

    test('Should answere with a list of commands by getName()', () => {
        return expect(command.respondTo("", "foo-room", defaultOriginalMessage(), {})).toBe("The following commands are registered: list-commands");
    });

    test('With command not defining getName(), should resolve by class name', () => {
        command.getName = undefined;
        return expect(command.respondTo("", "foo-room", defaultOriginalMessage(), {})).toBe("The following commands are registered: ListCommands");
    });

    test('Should not respond to unauthorized User', () => {
        command.applyConfig({"authorized-users": ["jane.doe"]});
        const originalMessage = defaultOriginalMessage();
        originalMessage.u.username = "john.doe";
        return expect(command.respondTo("", "foo-room", originalMessage, {})).toBeFalsy();
    });

    test('Should respond to authorized user', () => {
        command.applyConfig({"authorized-users": ["john.doe"]});
        const originalMessage = defaultOriginalMessage();
        originalMessage.u.username = "john.doe";
        return expect(command.respondTo("", "foo-room", originalMessage, {})).toBeTruthy();
    })
});

