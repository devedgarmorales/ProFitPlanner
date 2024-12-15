import axios from 'axios';
import Config from 'react-native-config';
import {showToast} from "./toast.tsx";

const api = axios.create({
    baseURL: Config.BASE_URL_API,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
});

api.interceptors.request.use(
    (config) => {
        // const token = storage.getString("refresh_token");
        // const tokenObject = token ? JSON.parse(token) : null;
        // console.log("Token interceptors:", tokenObject);
        // if (tokenObject && config.url !== "token/revoke") {
        //     console.log("entra  la condicion:", tokenObject);
        //     config.headers['Authorization'] = `Bearer ${tokenObject}`;
        // }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        // You can process the response globally here
        return response;
    },
    (error) => {
        // Handle global response errors
        //console.error('Response error:', error);
        return Promise.reject(error);
    }
);

const handleApiError = (error: any, hideLoader: any) => {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const resError = error.response?.data || {};

        switch (status) {
            case 400:
                showToast(
                    'error',
                    '¡Ocurrió un error!',
                    resError.password || resError.message || 'Solicitud incorrecta (400)'
                );
                hideLoader && hideLoader();
                break;
            case 401:
                console.error('401 No autorizado (401):', resError);
                break;
            case 403:
                console.error('403 No autorizado (403):', resError);
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
                console.error('Error interno del servidor (500):', resError);
                break;
            default:
                hideLoader && hideLoader();
                console.error('Error desconocido:', resError || error.message);
        }
    } else {
        console.error('Error no relacionado con Axios:', error.message);
    }
};

export const makePostRequest = async (endpoint = "", body = {}, hideLoader: () => void) => {
    try {
        const response = await api.post(endpoint, body);
        return {data: response.data};
    } catch (error) {
        handleApiError(error, hideLoader);
    }
};

