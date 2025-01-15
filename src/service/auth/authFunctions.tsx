import {makePostRequest} from '../api';

function loginAndLogout(endpoint = "", body = {}, hideLoader: () => void,  showActionSheet: () => void, showModal: () => void) {
    return makePostRequest(endpoint, body, hideLoader, showActionSheet, showModal);
}

function checkToken(endpoint = "", body = {}, hideLoader: () => void,  showActionSheet: () => void, showModal: () => void) {
    return makePostRequest(endpoint, body, hideLoader, showActionSheet, showModal);
}

function refreshToken(endpoint = "", body = {}, hideLoader: () => void,  showActionSheet: () => void, showModal: () => void) {
    return makePostRequest(endpoint, body, hideLoader, showActionSheet, showModal);
}

export default {
    loginAndLogout,
    checkToken,
    refreshToken,
};
