// Import generated types for your canister
import { resolve } from 'node:path';
import {PocketIc} from "@hadronous/pic";
import {Principal} from "@dfinity/principal";
import {Actor, ActorSubclass} from "@dfinity/agent";
import type {_SERVICE} from "../src/declarations/dlterp_company/dlterp_company.did.d.ts";
import {idlFactory} from "../src/declarations/dlterp_company";

// Define the path to your canister's WASM file
export const WASM_PATH = resolve(
    __dirname,
    '..',
    '.dfx',
    'local',
    'canisters',
    'dlterp_company',
    'dlterp_company.wasm.gz',
);

// The `describe` function is used to group tests together
// and is completely optional.
describe('Test suite name', () => {
    // Define variables to hold our PocketIC instance, canister ID,
    // and an actor to interact with our canister.
    let pic: PocketIc;
    let canisterId: Principal;
    let actor: any;

    // The `beforeEach` hook runs before each test.
    //
    // This can be replaced with a `beforeAll` hook to persist canister
    // state between tests.
    beforeEach(async () => {
        // create a new PocketIC instance
        pic = await PocketIc.create(process.env.PIC_URL);
        console.log("qui si");
        // Setup the canister and actor
        const fixture = await pic.setupCanister<_SERVICE>({
            idlFactory,
            wasm: WASM_PATH,
        });
        console.log("qui no");
        // Save the actor and canister ID for use in tests
        actor = fixture.actor;
        canisterId = fixture.canisterId;
    });

    // The `afterEach` hook runs after each test.
    //
    // This should be replaced with an `afterAll` hook if you use
    // a `beforeAll` hook instead of a `beforeEach` hook.
    afterEach(async () => {
        // tear down the PocketIC instance
        await pic.tearDown();
    });

    // The `it` function is used to define individual tests
    it('should do something cool', async () => {
        const response = 'cool';

        expect(response).toEqual('cool');
    });
});