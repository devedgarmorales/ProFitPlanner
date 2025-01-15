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

        console.log('Headers de la petición:', config.headers);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log('Respuesta de la petición:', response.data);
        return response;
    },
    (error) => {
        console.log('Error en la petición:', error);
        return Promise.reject(error);
    }
);

const handleApiError = (error: any, hideLoader: any, showActionSheet: any, showModal: any) => {
    if (axios.isAxiosError(error)) {
        console.log("error", error)
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

                showToast('error', '¡Ocurrió un error!', errorMessage);
                hideLoader && hideLoader();
                break;
            case 401:
                //console.error('No autorizado (401):', resError.detail);
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
                console.error('No encontrado (404):', resError);
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

export const makeGetRequest = async (endpoint = "", hideLoader: () => void, showActionSheet: () => void, showModal: () => void) => {
    try {
        const response = await api.get(endpoint);
        return {data: response.data};
    } catch (error) {
        handleApiError(error, hideLoader, showActionSheet, showModal);
    }
}

export const makePostRequest = async (endpoint = "", body = {}, hideLoader: () => void, showActionSheet: () => void, showModal: () => void) => {
    try {
        const response = await api.post(endpoint, body);
        return {data: response.data};
    } catch (error) {
        handleApiError(error, hideLoader, showActionSheet, showModal);
    }
};

