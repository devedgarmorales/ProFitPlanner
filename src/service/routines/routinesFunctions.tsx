import {makeGetRequest, makePostRequest} from '../api';

function getFolders(endpoint = "", body = {}, hideLoader: () => void,  showActionSheet: () => void, showModal: () => void) {
    return makeGetRequest(endpoint, hideLoader, showActionSheet, showModal);
}

function postFolders(endpoint = "", body = {}, hideLoader: () => void,  showActionSheet: () => void, showModal: () => void) {
    return makePostRequest(endpoint, body, hideLoader, showActionSheet, showModal);
}

export default {
    getFolders,
    postFolders
};
