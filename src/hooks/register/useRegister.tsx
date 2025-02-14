import React, {useState} from "react";
import {showToast} from "../../service/toast.tsx";
import authFunctions from "../../service/auth/authFunctions.tsx";
import useLoaderStore from "../../store/loaderStore.tsx";
import {BackHandler, Keyboard} from "react-native";
import {useToastStore} from "../../store/toastStore.tsx";
import {useFocusEffect} from "@react-navigation/native";

const useRegister = ({navigation}: any) => {
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

        setSizeToast(200);
        Keyboard.dismiss();

        const body = {
            username: formValues.name,
            email: formValues.email,
            password1: formValues.password,
            password2: formValues.confirmPassword,
        }

        try {
            showLoader();
            await authFunctions.loginAndLogout("auth/registration2/", body, hideLoader, () => {
            }, () => {
            }).then((res: any) => {
                const {data} = res || {};

                const {code} = data || {};

                if (code === 201) {
                    navigation.navigate({
                        name: "Login",
                    });
                    showToast('success', 'Inicia sesión', data.message);
                }

                if (code === 400) {
                    const {msg} = data || {};

                    const message = `Email: ${msg.email || ''}\nPassword: ${msg.password || ''}`;

                    const finalMessage = message || 'Solicitud incorrecta (400)';

                    showToast('error', '¡Ocurrió un error!', finalMessage);
                }

                hideLoader();
            });
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
