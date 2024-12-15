import React, {useState} from "react";
import {useFocusEffect} from '@react-navigation/native';
import authFunctions from "../../service/auth/authFunctions.tsx";
import {MMKV} from 'react-native-mmkv';
import useLoaderStore from "../../store/loaderStore.tsx";
import {useToastStore} from "../../store/toastStore.tsx";
import {showToast} from "../../service/toast.tsx";

const useLogin = () => {
    const storage = new MMKV();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [isModalVisible, setModalVisible] = useState(true);
    const {showLoader, hideLoader} = useLoaderStore();
    const {setToastPosition} = useToastStore();

    const unMount = () => {
        setModalVisible(false);
        setFormValues({
            name: "",
            email: "",
            password: "",
        })
    };

    useFocusEffect(
        React.useCallback(() => {
            setModalVisible(true);
            return () => unMount();
        }, [])
    );

    const handleInputChange = (field: string, value: any) => {
        setFormValues({
            ...formValues,
            [field]: value,
        });
    };

    const sendLogin = async (navigation: any) => {
        const {email, password} = formValues;

        if (!email || !password) {
            return showToast(
                'error', 'Ocurrió un error', 'Los campos son requeridos'
            );
        }
        const body = {
            username: email,
            password,
        }

        try {
            showLoader();
            const res = await authFunctions.loginAndLogout("token", body, hideLoader)

            const {data} = res || {};

            if (data !== undefined && data.code === 200) {
                setToastPosition('bottom');
                storage.set(
                    'refresh_token',
                    JSON.stringify(data.data.refresh),
                )
                navigation.navigate({
                    name: "DashboardTabs",
                });
                showToast('success', '¡Bienvenido!', data.message);
                hideLoader();
            }
        } catch (error) {
            console.error("Error sending login request: ", error);
        }
    };

    const onClose = (navigation: any) => {
        setModalVisible(false);
        navigation.navigate({
            name: "Welcome",
        });
    };

    return {
        passwordVisible,
        setPasswordVisible,
        handleInputChange,
        sendLogin,
        formValues,
        setFormValues,
        isModalVisible,
        onClose,
    };
};

export default useLogin;
