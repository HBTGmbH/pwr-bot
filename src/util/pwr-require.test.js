const utils = require("./../utils");

jest.mock("child_process");

describe("Custom require", () => {

    let execSync = require("child_process").execSync;
    let pwrRequire;

    beforeEach(async () => {
        pwrRequire = await require("./pwr-require").pwrRequire;
    });

    afterEach(() => {
        execSync.mockClear();
    });

    test("It should execute npm install when invokes", async () => {
        try {
            await pwrRequire("foo-bar");
        } catch (e) {
            // This is a bit ugly. Mocking the require() function itself is tricky and even more ugly,
            // so this test validates the error so that no other error sneaks into the function.
            expect(e.message).toBe("Cannot find module 'foo-bar' from 'pwr-require.js'");
        }
        expect(execSync).toBeCalledWith("npm install --save foo-bar");
    });

    test("It should be able to use a custom install script", async () => {
        await require("./pwr-require").setInstallScript("yarn add {0}");
        try {
            await pwrRequire("foo-bar");
        } catch (e) {
            expect(e.message).toBe("Cannot find module 'foo-bar' from 'pwr-require.js'");
        }
        expect(execSync).toBeCalledWith("yarn add foo-bar");
    });

    test("It should not install already available modules", async () => {
        const res = await pwrRequire("fs");
        expect(execSync).not.toBeCalled();
        expect(res).toBe(require("fs"));
    })
});