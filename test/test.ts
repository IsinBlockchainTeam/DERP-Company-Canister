import { getCanisterId } from 'azle/dfx';
import { runTests } from 'azle/test';

import { getTests } from './tests';
import {createActor} from "../declarations/dlterp_company";

const helloWorldCanister = createActor(getCanisterId('hello_world'), {
    agentOptions: {
        host: 'http://127.0.0.1:8000'
    }
});

runTests(getTests(helloWorldCanister));
