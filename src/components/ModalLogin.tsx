import * as React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import CustomModal from "./CustomModal.tsx";
import useLogin from "../hooks/login/useLogin";
import CustomInput from "./CustomInput.tsx";

const ModalLogin = ({navigation}: any) => {
    const {
        passwordVisible,
        setPasswordVisible,
        handleInputChange,
        sendLogin,
        formValues,
        isModalVisible,
        onClose,
    } = useLogin();

    return (
        <CustomModal visible={isModalVisible} onClose={() => onClose(navigation)}>
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
                            onPress={() => navigation.navigate("RecoverPassword")}
                            style={styles.rightDirection}
                        >
                            <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={() => sendLogin(navigation)}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Iniciar Sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </CustomModal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    actionSheet: {
        width: "100%",
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 30,
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
    rightDirection: {
        alignItems: "flex-end",
        marginBottom: 10,
        marginTop: 6,
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

export default ModalLogin;
