

//NEEDED for testing, <<The PocketIC server needs to be started before running tests and stopped once they're finished running.
// This can be done by creating global-setup.ts and global-teardown.ts files in your project's root directory>>
//https://hadronous.github.io/pic-js/docs/guides/using-jest

module.exports = async function () {
    await global.__PIC__.stop();
};