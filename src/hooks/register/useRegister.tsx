import React, {useEffect, useState} from "react";
import {BackHandler, Keyboard} from "react-native";
import {useFocusEffect} from "@react-navigation/native";
import {showToast} from "../../service/toast.tsx";
import authFunctions from "../../service/auth/authFunctions.tsx";
import useLoaderStore from "../../store/loaderStore.tsx";
import {useToastStore} from "../../store/toastStore.tsx";
import {useActionSheetStore} from "../../store/actionSheetLoginStore.tsx";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../interface/navigation/principalNavInterface.ts";

interface UseRegisterProps {
    navigation: NativeStackNavigationProp<RootStackParamList, "Register">;
}

const useRegister = ({navigation}: UseRegisterProps) => {
    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showErrorColor, setShowErrorColor] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const {showLoader, hideLoader} = useLoaderStore();
    const {setSizeToast} = useToastStore();

    const showActionSheet = useActionSheetStore((state) => state.showActionSheet);

    useEffect(() => {
        const handleBeforeRemove = () => {
            showActionSheet();
        };

        const unsubscribe = navigation.addListener('beforeRemove', handleBeforeRemove);

        return () => {
            unsubscribe();
        };
    }, [navigation]);

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
            hideLoader();
            setShowErrorColor(true);
            return;
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
                    navigation.navigate("Login");
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
        showErrorColor,
    }
};

export default useRegister;
