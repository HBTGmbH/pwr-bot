module.exports.expectThrown = function (fn) {
    let ex = null;
    try {
        fn();
    } catch (e) {
        ex = e;
    }
    expect(ex).not.toBeNull();
    return ex;
};