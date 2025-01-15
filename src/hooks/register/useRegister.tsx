import React, {useState} from "react";
import {showToast} from "../../service/toast.tsx";
import {MMKV} from 'react-native-mmkv';
import authFunctions from "../../service/auth/authFunctions.tsx";
import useLoaderStore from "../../store/loaderStore.tsx";
import {BackHandler, Keyboard} from "react-native";
import {useToastStore} from "../../store/toastStore.tsx";
import {useFocusEffect} from "@react-navigation/native";

const useRegister = ({navigation}: any) => {
    const storage = new MMKV();
    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [isSelected, setIsSelected] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const {showLoader, hideLoader} = useLoaderStore();
    const {setSizeToast} = useToastStore();

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                navigation.goBack();
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    const handleCheckboxChange = () => {
        setIsSelected(!isSelected);
    };

    const handleInputChange = (inputName: string, inputValue: string) => {
        setFormValues({
            ...formValues,
            [inputName]: inputValue,
        });
    };

    const sendRegisterData = async () => {
        if (!formValues.name || !formValues.email || !formValues.password || !formValues.confirmPassword) {
            setSizeToast(80);
            return showToast('error', '¡Ocurrió un error!', 'Todos los campos son obligatorios');
        }

        setSizeToast(240);
        Keyboard.dismiss();

        const body = {
            username: formValues.name,
            email: formValues.email,
            password: formValues.password,
        }

        try {
            showLoader();
            const res = await authFunctions.loginAndLogout("register/", body, hideLoader, () => {
            }, () => {});

            const {data} = res || {};
            console.log("sendRegisterData", data);
            //&& data.code === 200
            if (data !== undefined) {
                storage.set(
                    'refresh_token',
                    JSON.stringify(data.token),
                )
                navigation.navigate({
                    name: "Login",
                });
                showToast('success', '¡Bienvenido!', data.message);
            }

            if (data !== undefined && data.code === 400) {
                const {msg} = data || {};

                const message = `Email: ${msg.email || ''}\nPassword: ${msg.password || ''}`;

                const finalMessage = message || 'Solicitud incorrecta (400)';

                showToast('error', '¡Ocurrió un error!', finalMessage);
            }
            hideLoader();
        } catch (error) {
            console.log(error);
        }
    };

    return {
        formValues,
        handleCheckboxChange,
        handleInputChange,
        sendRegisterData,
        isSelected,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
    }
};

export default useRegister;
