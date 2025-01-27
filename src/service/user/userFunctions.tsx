import {makeGetRequest, makePutRequest} from '../api';

function getUserInfo(endpoint = "", hideLoader: () => void,  showActionSheet: () => void, showModal: () => void) {
    return makeGetRequest(endpoint, hideLoader, showActionSheet, showModal);
}

function updateProfile(endpoint = "", body = {}, hideLoader: () => void, showActionSheet: () => void, showModal: () => void) {
    return makePutRequest(endpoint, body, hideLoader, showActionSheet, showModal);
}

export default {
    getUserInfo,
    updateProfile,
};
