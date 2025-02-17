import React, {useEffect, useState, useRef} from "react";
import {BackHandler, Keyboard, Platform} from "react-native";
import {ActionSheetRef} from "react-native-actions-sheet";
import {useFocusEffect} from "@react-navigation/native";
import {MMKV} from 'react-native-mmkv';
import authFunctions from "../../service/auth/authFunctions.tsx";
import useLoaderStore from "../../store/loaderStore.tsx";
import {useToastStore} from "../../store/toastStore.tsx";
import {showToast} from "../../service/toast.tsx";
import {useActionSheetStore} from "../../store/actionSheetLoginStore.tsx";
import userFunctions from "../../service/user/userFunctions.tsx";

const useLogin = () => {
    const storage = new MMKV();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [showErrorColor, setShowErrorColor] = useState(false);
    const {showLoader, hideLoader} = useLoaderStore();
    const {setToastPosition, setSizeToast} = useToastStore();

    const actionSheetRef = useRef<ActionSheetRef>(null);
    const setActionSheetRef = useActionSheetStore((state) => state.setActionSheetRef);

    const unMount = () => {
        setFormValues({
            name: "",
            email: "",
            password: "",
        });
        setPasswordVisible(false);
        setShowErrorColor(false);
    };

    useEffect(() => {
        const backAction = () => {
            showActionSheet();
            return false;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => {
            backHandler.remove();
        }
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            return () => {
                unMount();
            };
        }, [])
    )

    useEffect(() => {
        if (Platform.OS === "ios") {
            setTimeout(() => {
                showActionSheet();
            }, 300);
        } else {
            showActionSheet();
        }
    }, []);

    const handleInputChange = (field: string, value: any) => {
        setFormValues({
            ...formValues,
            [field]: value,
        });
    };

    const sendLogin = async (navigation: any) => {
        const {email, password} = formValues;

        if (!email || !password) {
            setSizeToast(80);
            setToastPosition('top');
            hideLoader();
            setShowErrorColor(true);
            return;
        }

        showLoader();
        hideActionSheet();

        setSizeToast(240);
        Keyboard.dismiss();

        const body = {
            username: email,
            password,
        }

        try {
            const res = await authFunctions.loginAndLogout("token/", body, hideLoader, showActionSheet, () => {});

            const {data} = res || {};
            if (!data) return;

            const {code, data: tokens} = data || {};
            if (code !== 200) return;

            hideActionSheet();
            setToastPosition('bottom');

            const {access, refresh} = tokens || {};
            storage.set('auth_tokens', JSON.stringify({access, refresh}));

            const response = await userFunctions.getUserInfo("auth/user/", hideLoader, showActionSheet, () => {});

            const {data: userData} = response || {};
            if (!userData) return;

            const {code: userCode, data: userInfo} = userData || {};

            if (userCode === 200) {
                const {email, username, first_name, last_name, image_profile} = userInfo || {};
                storage.set('user_info', JSON.stringify({email, username, first_name, last_name, image_profile}));
            }

            navigation.navigate("DashboardTabs");
            showToast('success', '¡Bienvenido!', 'Inicio de sesión exitoso');
        } catch (error) {
            console.error("Error sending login request:", error);
        } finally {
            hideLoader();
            actionSheetRef.current?.show();
            unMount();
        }
    };

    const onClose = (navigation: any) => {
        navigation.navigate({
            name: "Welcome",
        });
    };

    const showActionSheet = () => {
        if (actionSheetRef.current) {
            actionSheetRef.current.show();
            setActionSheetRef(actionSheetRef.current);
        }
    };

    const hideActionSheet = () => {
        if (actionSheetRef.current) {
            actionSheetRef.current.hide();
        }
    };

    return {
        passwordVisible,
        setPasswordVisible,
        handleInputChange,
        sendLogin,
        formValues,
        setFormValues,
        onClose,
        actionSheetRef,
        hideActionSheet,
        showErrorColor,
    };
};

export default useLogin;
