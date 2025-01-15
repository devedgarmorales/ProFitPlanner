import * as React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Platform,
} from "react-native";
import useLogin from "../../hooks/login/useLogin.tsx";
import CustomInput from "../CustomInput.tsx";
import ActionSheet from "react-native-actions-sheet";

const ActionSheetLogin = ({navigation}: any) => {
    const {
        passwordVisible,
        setPasswordVisible,
        handleInputChange,
        sendLogin,
        formValues,
        actionSheetRef,
        hideActionSheet,
    } = useLogin();

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActionSheet
                ref={actionSheetRef}
                gestureEnabled
                closable={false}
                isModal={true}
                overlayColor="transparent"
                indicatorStyle={{
                    width: 100,
                    alignSelf: "center",
                }}>
                <View style={styles.modalContainer}>
                    <View style={styles.actionSheet}>
                        <Text style={styles.title}>Bienvenido a GymTracker</Text>
                        <Text style={styles.subtitle}>Ingresa tus credenciales</Text>

                        <View style={styles.container}>

                            <CustomInput
                                label="Ingresa tu email"
                                value={formValues.email}
                                name="email"
                                onValueChange={handleInputChange}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholder=""
                            />

                        </View>

                        <View style={styles.passwordContainer}>

                            <CustomInput
                                label="Ingresa tu contraseña"
                                value={formValues.password}
                                name="password"
                                onValueChange={handleInputChange}
                                secureTextEntry={!passwordVisible}
                                placeholder=""
                                setPasswordVisible={setPasswordVisible}
                                passwordVisible={passwordVisible}
                            />

                        </View>

                        <View style={styles.linksContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate("RecoverPassword");
                                    hideActionSheet();
                                }}
                                style={styles.rightDirection}
                            >
                                <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate("Register");
                                    hideActionSheet();
                                }}
                                style={styles.leftDirection}
                            >
                                <Text style={styles.link}>¿Aún no tienes cuenta?</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                sendLogin(navigation).then();
                            }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Iniciar Sesión</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ActionSheet>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        justifyContent: "flex-end",
    },
    actionSheet: {
        width: "100%",
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: Platform.OS === "ios" ? 0 : 30,
        paddingTop: 50,
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 30,
        color: "#a69e9e",
    },
    container: {
        width: "100%",
        height: 72,
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
    },
    input: {
        height: 40,
        color: "#000",
        padding: 0,
        paddingHorizontal: 10,
    },
    inputPassword: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
    },
    underline: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: -1,
        height: 2,
    },
    leftDirection: {
        marginBottom: 10,
        marginTop: 6,
        width: Platform.OS === "ios" ? "44%" : "50%",
    },
    rightDirection: {
        marginBottom: 10,
        marginTop: 6,
        alignSelf: "flex-end",
    },
    linksContainer: {
        marginBottom: 20,
    },
    link: {
        color: "#007BFF",
    },
    link2: {
        color: "#007BFF",
    },
    button: {
        backgroundColor: "#007BFF",
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    eyeIcon: {
        paddingHorizontal: 10,
    },
});

export default ActionSheetLogin;

