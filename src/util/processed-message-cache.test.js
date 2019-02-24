const ProcessedMessageCache = require("./processed-message-cache");

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe("processed message cache", () => {

    test("Should add a message to chache", () => {
       const cache = new ProcessedMessageCache();
       cache.add("55AABB");
       expect(cache.contains("55AABB")).toBeTruthy();
    });
});