import {makeRequest} from "./api.tsx";

export const makeGetRequest = (endpoint: string, hideLoader: () => void, showActionSheet: () => void, showModal: () => void, token?: boolean) =>
    makeRequest("GET", endpoint, {}, hideLoader, showActionSheet, showModal, token);

export const makePostRequest = (endpoint: string, body: any, hideLoader: () => void, showActionSheet: () => void, showModal: () => void, token?: boolean) =>
    makeRequest("POST", endpoint, body, hideLoader, showActionSheet, showModal, token);

export const makePutRequest = (endpoint: string, body: any, hideLoader: () => void, showActionSheet: () => void, showModal: () => void, token?: boolean) =>
    makeRequest("PUT", endpoint, body, hideLoader, showActionSheet, showModal, token);

export const makeDeleteRequest = (endpoint: string, hideLoader: () => void, showActionSheet: () => void, showModal: () => void, token?: boolean) =>
    makeRequest("DELETE", endpoint, {}, hideLoader, showActionSheet, showModal, token);
