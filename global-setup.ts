import { PocketIcServer } from '@hadronous/pic';

//NEEDED for testing, <<The PocketIC server needs to be started before running tests and stopped once they're finished running.
// This can be done by creating global-setup.ts and global-teardown.ts files in your project's root directory>>
//https://hadronous.github.io/pic-js/docs/guides/using-jest

module.exports = async function (): Promise<void> {
    const pic = await PocketIcServer.start({
        showCanisterLogs: true,
        showRuntimeLogs: true,
    });
    const url = pic.getUrl();

    process.env.PIC_URL = url;
    global.__PIC__ = pic;
};