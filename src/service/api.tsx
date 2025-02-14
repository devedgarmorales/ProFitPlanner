import axios from 'axios';
import Config from 'react-native-config';
import {showToast} from "./toast.tsx";
import {MMKV} from "react-native-mmkv";

const storage = new MMKV();

const api = axios.create({
    baseURL: Config.BASE_URL_API,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const tokens = JSON.parse(storage.getString("auth_tokens") || "{}");
        const accessToken = tokens?.access;
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const handleApiError = (error: any, hideLoader: any, showActionSheet: any, showModal: any) => {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const resError = error.response?.data || {};

        switch (status) {
            case 400:
                //console.error('Solicitud incorrecta (400):', resError);
                const errorMessage =
                    resError?.password ? `Contraseña: ${resError.password}` :
                        resError?.message ? resError.message :
                            resError?.username ? `Usuario: ${resError.username}` :
                                'Solicitud incorrecta (400)';

                if (resError?.errors?.length > 0) {
                    resError.errors.forEach((error: any, index: number) => {
                        setTimeout(() => {
                            showToast('error', resError?.message, `${error?.message}` || 'Solicitud incorrecta (400)');
                        }, index * 3000);
                    });
                }

                if (!resError?.errors || resError.errors.length === 0) {
                    setTimeout(() => {
                        showToast('error', '¡Ocurrió un error!', errorMessage);
                    }, (resError?.errors?.length || 0) * 1000);
                }

                hideLoader && hideLoader();
                break;
            case 401:
                //console.error('No autorizado (401):', resError.detail);
                if (resError.detail === 'Given token not valid for any token type') {
                    showModal && showModal();
                    hideLoader && hideLoader();
                    return;
                }

                showToast(
                    'error',
                    '¡Ocurrió un error!',
                    resError.detail || 'No autorizado (401)'
                )
                hideLoader && hideLoader();
                showActionSheet && showActionSheet();
                break;
            case 403:
                //console.error('No autorizado (403):', resError);
                showToast(
                    'error',
                    '¡Ocurrió un error!',
                    resError.messages[0].message || 'No autorizado (403)'
                );
                hideLoader && hideLoader();
                break;
            case 404:
                showToast(
                    'error',
                    '¡Ocurrió un error!',
                    resError.message || 'No encontrado (404)'
                );
                break;
            case 500:
                //console.error('Error interno del servidor (500):', resError);
                if (resError.message === 'Error interno del servidor: Token is invalid or expired') {
                    showModal && showModal();
                }
                break;
            default:
                hideLoader && hideLoader();
                showActionSheet && showActionSheet();
                //console.error('Error en el servidor:', resError || error.message);
                showToast(
                    'error',
                    '¡Ocurrió un error!',
                    resError.message || 'Error en el servidor'
                );
        }
    } else {
        console.error('Error no relacionado con Axios:', error.message);
    }
};

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const makeRequest = async (
    method: HttpMethod,
    endpoint: string,
    body: any = {},
    hideLoader: () => void,
    showActionSheet: () => void,
    showModal: () => void,
    token: boolean = false
) => {
    try {
        api.defaults.headers["Content-Type"] = token ? "multipart/form-data" : "application/json";

        let response;
        switch (method) {
            case "GET":
                response = await api.get(endpoint);
                break;
            case "POST":
                response = await api.post(endpoint, body);
                break;
            case "PUT":
                response = await api.put(endpoint, body);
                break;
            case "DELETE":
                response = await api.delete(endpoint);
                break;
            default:
                console.error(`Unsupported method: ${method}`);
        }

        return { data: response?.data };
    } catch (error) {
        handleApiError(error, hideLoader, showActionSheet, showModal);
    }
};

export const makeGetRequest = (endpoint: string, hideLoader: () => void, showActionSheet: () => void, showModal: () => void, token?: boolean) =>
    makeRequest("GET", endpoint, {}, hideLoader, showActionSheet, showModal, token);

export const makePostRequest = (endpoint: string, body: any, hideLoader: () => void, showActionSheet: () => void, showModal: () => void, token?: boolean) =>
    makeRequest("POST", endpoint, body, hideLoader, showActionSheet, showModal, token);

export const makePutRequest = (endpoint: string, body: any, hideLoader: () => void, showActionSheet: () => void, showModal: () => void, token?: boolean) =>
    makeRequest("PUT", endpoint, body, hideLoader, showActionSheet, showModal, token);

export const makeDeleteRequest = (endpoint: string, hideLoader: () => void, showActionSheet: () => void, showModal: () => void, token?: boolean) =>
    makeRequest("DELETE", endpoint, {}, hideLoader, showActionSheet, showModal, token);


