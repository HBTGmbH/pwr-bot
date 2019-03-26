const SelfUpdate = require("./self-update");
// Bootstrap utilities
require("./../utils");
jest.mock("../util/cmd");

describe("self-update", () => {

    let command;

    beforeEach(() => {
        command = new SelfUpdate();
        command.applyConfig({"authorized-users": ["john.doe"]});
    });

    it('should provide a name', function () {
        expect(command.getName()).toBe("self-update");
    });

    it('should listen to !self-update', function () {
        expect(command.listensTo("self-update")).toBeTruthy();
    });

    it('should respond by answering that it will perform a self-update', function () {
        const response = command.respondTo("", "", {rid: -1, u: {username: "john.doe"}}, null);
        expect(response).toBe("Performing self-update. I will notify you of the onging process ...");
    });

    it('Should only allow self-update on authorized users', () => {
        command.applyConfig({"authorized-users": ["john.doe"]});
        const response = command.respondTo("", "",  {u: {username: "jane.doe"}});
        expect(response).toBe("You are not authorized to perform this action.");
    });

});