const ReloadCommands = require("./reload-commands");
const Manager = require("./../manager");
const util = require("./../utils");

describe("Reload commands", () => {

    let manager;
    let command;
    let originalMessage;
    let reloadCustom;
    let reloadSystem;

    beforeEach(() => {
        manager = new Manager(null, {bot: {}});
        command = new ReloadCommands(null, manager);
        originalMessage = {u: {username: "jane.doe"}};
        command.applyConfig({"authorized-users": ["jane.doe"]});
        reloadCustom = jest.spyOn(manager, "reloadCustomCommands").mockImplementation(() => {});
        reloadSystem = jest.spyOn(manager, "reloadSystemCommands").mockImplementation(() => {});
    });

    test("Should provide a name", () => {
        expect(new ReloadCommands().getName()).toBe("reload-commands");
    });

    test("Should listen to keywords", () => {
        const command = new ReloadCommands();
        command.applyConfig({keywords: ["reload-commands", "reloadcomands"]});
        expect(command.listensTo("reload-commands")).toBeTruthy();
        expect(command.listensTo("reloadcomands")).toBeTruthy();
    });

    test("Should not provide help", () => {
        expect(new ReloadCommands().helpMessage()).toBeFalsy();
    });

    test("With no arguments given, should reload all commands and reply", async () => {
        const response = await command.respondTo("", "", originalMessage, {});
        expect(response).toBe("Specified commands reloaded! Type !list-commands for a list of all loaded commands!");
        expect(reloadCustom).toHaveBeenCalled();
        expect(reloadSystem).toHaveBeenCalled();
    });

    test("With --system argument, it should reload only system commands", async () => {
        const response = await command.respondTo("--system", "", originalMessage, {});
        expect(response).toBe("Specified commands reloaded! Type !list-commands for a list of all loaded commands!");
        expect(reloadCustom).not.toHaveBeenCalled();
        expect(reloadSystem).toHaveBeenCalled();
    });

    test("With --custom argument, it should reload only custom commands", async () => {
        const response = await command.respondTo("--custom", "", originalMessage, {});
        expect(response).toBe("Specified commands reloaded! Type !list-commands for a list of all loaded commands!");
        expect(reloadCustom).toHaveBeenCalled();
        expect(reloadSystem).not.toHaveBeenCalled();
    });

    test("Without configuration, it should fall back to default configuration", () => {
        const command = new ReloadCommands();
        command.applyConfig(undefined);
        expect(command.listensTo("reload-commands")).toBeTruthy();
    });

    test("Should only allow authorized users", async () => {
        originalMessage.u.username = "john.doe";
        await expect(command.respondTo("", "foo-room", originalMessage, {}));
        expect(reloadCustom).not.toHaveBeenCalled();
        expect(reloadSystem).not.toHaveBeenCalled();
    })
});