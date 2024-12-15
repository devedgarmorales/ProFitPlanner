import {makePostRequest} from '../api';

function loginAndLogout(endpoint = "", body = {}, hideLoader: () => void) {
    return makePostRequest(endpoint, body, hideLoader);
}

export default {
    loginAndLogout
};
