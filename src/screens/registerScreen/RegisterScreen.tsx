import React from "react";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import CustomInput from "../../components/CustomInput.tsx";
import useRegister from "../../hooks/register/useRegister";

const RegisterScreen = ({navigation}: any) => {

    const {
        formValues,
        handleCheckboxChange,
        handleInputChange,
        sendRegisterData,
        isSelected,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
    } = useRegister({navigation});

    return (
        <View style={styles.container}>
            <Image
                source={require("../../assets/img/backgroundVertical.png")}
                style={styles.image}
                resizeMode="cover"
            />

            <Text style={styles.title}>Registro</Text>
            <Text style={styles.subtitle}>Crea tu cuenta para comenzar</Text>
            <View style={{
                backgroundColor: "#fff",
                paddingHorizontal: 24,
                borderRadius: 10,
            }}>

                <View style={[styles.containerInput, {marginTop: 30}]}>
                    <CustomInput
                        label="Ingresa tu usuario"
                        value={formValues.name}
                        name="name"
                        onValueChange={handleInputChange}
                        keyboardType="default"
                        autoCapitalize="none"
                        color="#000000"
                    />
                </View>
                <View style={styles.containerInput}>
                    <CustomInput
                        label="Ingresa tu email"
                        value={formValues.email}
                        name="email"
                        onValueChange={handleInputChange}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        color="#000000"
                    />
                </View>
                <View style={styles.containerInput}>
                    <CustomInput
                        label="Ingresa tu contraseña"
                        value={formValues.password}
                        name="password"
                        onValueChange={handleInputChange}
                        secureTextEntry={!showPassword}
                        placeholder=""
                        setPasswordVisible={setShowPassword}
                        passwordVisible={showPassword}
                        color="#000000"
                    />
                </View>
                <View style={styles.containerInput}>
                    <CustomInput
                        label="Confirma tu contraseña"
                        value={formValues.confirmPassword}
                        name="confirmPassword"
                        onValueChange={handleInputChange}
                        secureTextEntry={!showConfirmPassword}
                        placeholder=""
                        setPasswordVisible={setShowConfirmPassword}
                        passwordVisible={showConfirmPassword}
                        color="#000000"
                    />
                </View>
                <TouchableOpacity disabled={!isSelected} onPress={() =>
                    sendRegisterData()
                } style={styles.button}>
                    <Text style={styles.buttonText}>Registrarse</Text>
                </TouchableOpacity>
                <View style={[styles.containerCheckbox, {
                    paddingBottom: 30
                }]}>
                    <CheckBox
                        value={isSelected}
                        onValueChange={handleCheckboxChange}
                        style={styles.checkbox}
                    />
                    <Text style={styles.text}>
                        Acepto los <Text style={{}}>Términos y Condiciones </Text>y
                        la <Text style={{}}> {"\n"}Política de Privacidad</Text>
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        alignItems: "center",
        backgroundColor: "#fff",
    },
    image: {
        position: "absolute",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
    title: {
        fontSize: 36,
        color: "#fff",
    },
    subtitle: {
        fontSize: 22,
        marginTop: 10,
        color: "#ACABA1",
        marginBottom: 20,
    },
    input: {
        width: "80%",
        height: 50,
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ACABA1",
        borderRadius: 5,
        backgroundColor: "#EDEDEC",
    },
    button: {
        height: 50,
        marginTop: 40,
        backgroundColor: "#007BFF",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
    },
    containerCheckbox: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
    },
    checkbox: {
        marginRight: 10,
    },
    text: {
        fontSize: 16,
        color: "#181818",
    },
    link: {
        color: "blue",
        textDecorationLine: "underline",
    },
    containerInput: {
        width: "90%",
        borderRadius: 8,
        backgroundColor: "#fff",
        marginTop: 15
    },
});

export default RegisterScreen;
