import {useEffect, useState, useRef} from "react";
import {BackHandler, Keyboard} from "react-native";
import {ActionSheetRef} from "react-native-actions-sheet";
import authFunctions from "../../service/auth/authFunctions.tsx";
import {MMKV} from 'react-native-mmkv';
import useLoaderStore from "../../store/loaderStore.tsx";
import {useToastStore} from "../../store/toastStore.tsx";
import {showToast} from "../../service/toast.tsx";
import {useActionSheetStore} from "../../store/actionSheetLoginStore.tsx";
import axios from "axios";

const useLogin = () => {
    const storage = new MMKV();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        password: "",
    });
    const {showLoader, hideLoader} = useLoaderStore();
    const {setToastPosition, setSizeToast} = useToastStore();

    const actionSheetRef = useRef<ActionSheetRef>(null);
    const setActionSheetRef = useActionSheetStore((state) => state.setActionSheetRef);

    const unMount = () => {
        setFormValues({
            name: "",
            email: "",
            password: "",
        })
    };

    useEffect(() => {
        const backAction = () => {
            showActionSheet();
            unMount();
            return false;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => {
            backHandler.remove();
        }
    }, []);

    useEffect(() => {
        if (actionSheetRef.current) {
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
            return showToast(
                'error', '¡Ocurrió un error!', 'Los campos son requeridos'
            );
        }

        setSizeToast(240);
        Keyboard.dismiss();

        const body = {
            username: email,
            password,
        }

        try {
            showLoader();

            await authFunctions.loginAndLogout("token/", body, hideLoader,  showActionSheet, () => {}).then((res) => {
                console.log("res", res);

                const {data} = res || {};

                const {code} = data || {};

                if (data !== undefined && code === 200) {
                    hideActionSheet();
                    setToastPosition('bottom');

                    const {access, refresh} = data.data || {};

                    storage.set(
                        'auth_tokens',
                        JSON.stringify({
                            access: access,
                            refresh: refresh,
                        })
                    )
                    navigation.navigate({
                        name: "DashboardTabs",
                    });
                    showToast('success', '¡Bienvenido!', 'Inicio de sesión exitoso');
                }
            });

            hideLoader();
        } catch (error) {
            console.error("Error sending login request: ", error);
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
            //unMount();
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
        hideActionSheet
    };
};

export default useLogin;
