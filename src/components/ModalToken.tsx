import React from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import authFunctions from "../service/auth/authFunctions.tsx";
import {showToast} from "../service/toast.tsx";
import {MMKV} from "react-native-mmkv";
import useLoaderStore from "../store/loaderStore.tsx";
import {useToastStore} from "../store/toastStore.tsx";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../types/types.ts";
import useTokenModalStore from "../store/tokenModalStore.tsx";
import useUpdateToken from "../store/updateTokenRefresh.tsx";

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

interface SessionExpiredModalProps {
    visible: boolean;
}

const storage = new MMKV();

const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({visible}) => {
    const {showLoader, hideLoader} = useLoaderStore();
    const {setSizeToast, setToastPosition} = useToastStore();
    const {updateScreen, stopUpdate} = useUpdateToken();
    const navigation = useNavigation<NavigationProps>();
    const {showModal, hideModal} = useTokenModalStore();
    const tokens = JSON.parse(storage.getString("auth_tokens") || "{}");
    const refreshToken = tokens.refresh;

    const onLogout = () => {
        setSizeToast(80);
        setToastPosition("top");
        showLoader();
        storage.clearAll();

        setTimeout(() => {
            hideLoader();
            hideModal();
            showToast("success", "Sesión cerrada", "Has cerrado sesión exitosamente.");
            navigation.reset({
                index: 0,
                routes: [{name: "Login"}],
            })
        }, 1000);
    }

    const onContinue = async () => {
        showLoader();
        let body = {
            "refresh": refreshToken,
        }
        const res = await authFunctions.refreshToken("token/refresh/", body, hideLoader, () => {
        }, showModal);

        const {code, data} = res?.data || {};

        if (code === 200) {
            const {access, refresh} = data || {};

            storage.set(
                'auth_tokens',
                JSON.stringify({
                    access: access,
                    refresh: refresh,
                })
            )
            updateScreen();
            hideModal();
            stopUpdate();
        }
        stopUpdate();
        hideLoader();
    }

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Tu sesión acaba de expirar</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                            <Text style={styles.buttonText}>Cerrar sesión</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
                            <Text style={styles.buttonText}>Continuar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#000',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    logoutButton: {
        flex: 1,
        backgroundColor: '#ff4d4d',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
        alignItems: 'center',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    continueButton: {
        flex: 1,
        backgroundColor: '#7CB8E7',
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
        alignItems: 'center',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default SessionExpiredModal;
