import {useEffect, useRef, useState} from "react";
import {ActionSheetRef} from "react-native-actions-sheet";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {MMKV} from "react-native-mmkv";
import {useBackExitApp} from "../../utils/useBackExitApp.tsx";
import {useCheckTokenValidate} from "../../utils/checkTokenValidate.tsx";
import useLoaderStore from "../../store/loaderStore.tsx";
import {useToastStore} from "../../store/toastStore.tsx";
import authFunctions from "../../service/auth/authFunctions.tsx";
import {showToast} from "../../service/toast.tsx";
import userFunctions from "../../service/user/userFunctions.tsx";
import {ProfileScreenInterface} from "../../interface/profileScreen/profileScreenInterface.ts";

export type RootStackParamList = {
    Login: undefined;
    Perfil: undefined;
}

interface UseUpdateProfileProps {
    navigation: NativeStackNavigationProp<RootStackParamList, "Perfil">;
}

const storage = new MMKV();

const useUpdateProfile = ({navigation}: UseUpdateProfileProps) => {
    const actionSheetRef = useRef<ActionSheetRef>(null);
    const {showLoader, hideLoader} = useLoaderStore();
    const {setSizeToast, setToastPosition} = useToastStore();
    const [refreshing, setRefreshing] = useState(false);

    useBackExitApp();

    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        image_profile: {
            uri: "",
            name: "",
            type: "",
        },
    });
    const [formValues, setFormValues] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        image_profile: {
            uri: "",
            name: "",
            type: "",
        },
    });

    const loadInitialData = () => {
        const userData = JSON.parse(storage.getString("user_info") || "{}");

        setUser({
            first_name: userData.first_name,
            last_name: userData.last_name,
            username: userData.username,
            email: userData.email,
            image_profile: {
                uri: userData.image_profile,
                name: "",
                type: "",
            },
        });

        setFormValues({
            first_name: userData.first_name,
            last_name: userData.last_name,
            username: userData.username,
            email: userData.email,
            image_profile: {
                uri: userData.image_profile,
                name: "",
                type: "",
            }
        });
    }

    useEffect(() => {
        loadInitialData();
    }, []);

    useCheckTokenValidate();

    const handleLogout = async () => {
        const tokens = JSON.parse(storage.getString('auth_tokens') || '{}');
        const accessToken = tokens.access;

        const body = {
            "token": accessToken,
        };

        setSizeToast(120);
        setToastPosition('top');

        try {
            showLoader();

            const {data}: ProfileScreenInterface | undefined = await authFunctions.loginAndLogout("token/revoke/", body, hideLoader, () => {
            }, () => {
            });

            const {code} = data || {};

            if (code === 200) {
                showToast("success", "Sesión cerrada", "Has cerrado sesión exitosamente.");

                navigation.reset({
                    index: 0,
                    routes: [{name: "Login"}],
                });

                storage.clearAll();
            }
        } catch (e) {
            console.error("Error en la solicitud:", e);
        } finally {
            hideLoader();
        }
    };

    const handleInputChange = (inputName: string, inputValue: string) => {
        setFormValues({
            ...formValues,
            [inputName]: inputValue,
        });
    };

    const isNotEmpty = (value: string) => {
        return value !== null && value !== undefined && value !== "";
    }

    const activateActionSheet = () => {
        actionSheetRef.current?.show();
    };

    const handleUpdateProfile = async () => {
        const body = new FormData();
        body.append("username", formValues.username || "");
        body.append("first_name", formValues.first_name || "");
        body.append("last_name", formValues.last_name || "");
        body.append("email", formValues.email || "");

        if (formValues.image_profile.uri) {
            const imageFile = {
                uri: formValues.image_profile.uri || "",
                name: formValues.image_profile.name || "profile.jpg",
                type: formValues.image_profile.type || "image/jpeg",
            };
            body.append("image_profile", imageFile);
        }
        setSizeToast(120);
        setToastPosition('top');

        try {
            showLoader();
            const {data} = await userFunctions.updateProfile("auth/user/", body, hideLoader, () => {
            }, () => {
            }, true);
            const {code, data: infoUser} = data || {};

            if (code === 200) {
                showToast("success", "Perfil actualizado", "Tu perfil ha sido actualizado exitosamente.");
                setUser({
                    first_name: infoUser.first_name,
                    last_name: infoUser.last_name,
                    username: infoUser.username,
                    email: infoUser.email,
                    image_profile: {
                        uri: infoUser.image_profile,
                        name: "",
                        type: "",
                    }
                });

                setFormValues({
                    first_name: infoUser.first_name,
                    last_name: infoUser.last_name,
                    username: infoUser.username,
                    email: infoUser.email,
                    image_profile: {
                        uri: infoUser.image_profile,
                        name: "",
                        type: "",
                    }
                });

                storage.set("user_info", JSON.stringify(infoUser));
            }
            hideLoader();
        } catch (e) {
            hideLoader();
            console.error("Error en la solicitud:", e);
        }
    }

    const onRefresh = () => {
        setRefreshing(true);

        setTimeout(() => {
            setRefreshing(false);
            loadInitialData();
        }, 1500);
    };

    return {
        user,
        setUser,
        formValues,
        setFormValues,
        handleInputChange,
        isNotEmpty,
        activateActionSheet,
        handleUpdateProfile,
        handleLogout,
        actionSheetRef,
        refreshing,
        onRefresh
    };
}

export default useUpdateProfile;
