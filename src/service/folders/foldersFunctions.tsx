import {makeGetRequest, makePostRequest, makePutRequest, makeDeleteRequest} from '../api';

function getFolders(endpoint = "", hideLoader: () => void,  showActionSheet: () => void, showModal: () => void) {
    return makeGetRequest(endpoint, hideLoader, showActionSheet, showModal);
}

function postFolders(endpoint = "", body = {}, hideLoader: () => void,  showActionSheet: () => void, showModal: () => void) {
    return makePostRequest(endpoint, body, hideLoader, showActionSheet, showModal);
}

function putFolders(endpoint = "", body = {}, hideLoader: () => void,  showActionSheet: () => void, showModal: () => void) {
    return makePutRequest(endpoint, body, hideLoader, showActionSheet, showModal);
}

function deleteFolders(endpoint = "", hideLoader: () => void,  showActionSheet: () => void, showModal: () => void) {
    return makeDeleteRequest(endpoint, hideLoader, showActionSheet, showModal);
}

export default {
    getFolders,
    postFolders,
    putFolders,
    deleteFolders
};
