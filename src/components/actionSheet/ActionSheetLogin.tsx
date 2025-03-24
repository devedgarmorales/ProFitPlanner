import * as React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Platform,
} from "react-native";
import ActionSheetBase from "./ActionSheetBase.tsx";
import CustomInput from "../CustomInput.tsx";
import useLogin from "../../hooks/login/useLogin.tsx";
import {ScreenProps} from "../../interface/navigation/principalNavInterface.ts";

type Props = ScreenProps<"Login">;

const ActionSheetLogin = ({navigation, route}: Props) => {
    const {
        passwordVisible,
        setPasswordVisible,
        handleInputChange,
        sendLogin,
        formValues,
        actionSheetRef,
        hideActionSheet,
        showErrorColor,
    } = useLogin();

    return (
        <View style={styles.content}>
            <ActionSheetBase showBackgroundColor={true} actionSheetRef={actionSheetRef} gesture={false}
                             closeable={false}>
                <View style={styles.modalContainer}>
                    <View style={styles.actionSheet}>
                        <Text style={styles.title}>Bienvenido a ProFitPlanner</Text>
                        <Text style={styles.subtitle}>Ingresa tus credenciales</Text>

                        <View style={styles.container}>
                            <CustomInput
                                label="Ingresa tu usuario"
                                value={formValues.email}
                                name="email"
                                onValueChange={handleInputChange}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholder=""
                                showOnFocus={showErrorColor}
                                colorFocused={(!formValues.email && showErrorColor) ? "#ff001e" : undefined}
                            />
                        </View>

                        <View style={[styles.passwordContainer, {
                            marginBottom: showErrorColor ? 4 : 14
                        }]}>
                            <CustomInput
                                label="Ingresa tu contraseña"
                                value={formValues.password}
                                name="password"
                                onValueChange={handleInputChange}
                                secureTextEntry={!passwordVisible}
                                placeholder=""
                                setPasswordVisible={setPasswordVisible}
                                passwordVisible={passwordVisible}
                                showOnFocus={showErrorColor}
                                colorFocused={(!formValues.password && showErrorColor) ? "#ff001e" : undefined}
                            />
                        </View>

                        {
                            showErrorColor && (
                                <Text style={[styles.emptyFields, {
                                    color: "#ff001e",
                                    marginBottom: 6,
                                }]}>*Completa todos los campos</Text>
                            )
                        }

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
                                sendLogin({navigation, route}).then();
                            }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Iniciar Sesión</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ActionSheetBase>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 1},
    modalContainer: {
        justifyContent: "flex-end",
    },
    actionSheet: {
        width: "100%",
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: Platform.OS === "ios" ? 0 : 30,
        paddingTop: 40,
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
    },
    leftDirection: {
        marginBottom: 10,
        marginTop: 6,
        width: "50%",
    },
    rightDirection: {
        marginBottom: 10,
        marginTop: 6,
        alignSelf: "flex-end",
    },
    emptyFields: {
        fontSize: 12,
    },
    linksContainer: {
        marginBottom: 20,
    },
    link: {
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
});

export default ActionSheetLogin;

