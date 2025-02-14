import {makeGetRequest, makePutRequest, makeDeleteRequest} from '../api';

function getUserInfo(endpoint = "", hideLoader: () => void,  showActionSheet: () => void, showModal: () => void) {
    return makeGetRequest(endpoint, hideLoader, showActionSheet, showModal);
}

function updateProfile(endpoint = "", body = {}, hideLoader: () => void, showActionSheet: () => void, showModal: () => void, token = false) {
    return makePutRequest(endpoint, body, hideLoader, showActionSheet, showModal, token);
}

function deleteImageProfile(endpoint = "", hideLoader: () => void, showActionSheet: () => void, showModal: () => void, token = false) {
    return makeDeleteRequest(endpoint, hideLoader, showActionSheet, showModal, token);
}

export default {
    getUserInfo,
    updateProfile,
    deleteImageProfile,
};
