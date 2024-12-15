import React, {useState} from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity, Animated, Image, Dimensions,
} from "react-native";
import CustomInput from "../../components/CustomInput.tsx";

const RecoverPassword = ({navigation}: any) => {
    const [formValues, setFormValues] = useState({
        email: "",
    });

    const handleInputChange = (inputName: string, inputValue: string) => {
        setFormValues({
            ...formValues,
            [inputName]: inputValue,
        });
    };

    const sendLogin = (formValues: any) => {
        console.log(formValues);

        navigation.navigate({
            name: "Login",
        })
    };

    return (
        <View style={styles.container}>
            <Image
                source={require("../../assets/img/backgroundVertical.png")}
                style={styles.image}
                resizeMode="cover"
            />

            <Text style={styles.title}>Olvide la Contraseña</Text>
            <Text style={styles.subtitle}>
                Ingrese su dirección de correo electrónico registrada y le enviaremos
                instrucciones para restablecer su contraseña.
            </Text>

            <View style={styles.cardContainer}>
                <View style={styles.containerInput}>
                    <CustomInput
                        label="Ingresa tu email"
                        value={formValues.email}
                        name="email"
                        onValueChange={handleInputChange}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => sendLogin(formValues)}
                >
                    <Text style={styles.buttonText}>Restablecer</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff", // Fondo claro
    },
    image: {
        position: "absolute",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        height: 40,
        color: "#000",
        padding: 0,
        paddingHorizontal: 10,
    },
    button: {
        height: 50,
        backgroundColor: "#007BFF",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 16,
    },
    containerInput: {
        marginBottom: 14,
        width: "90%",
        height: 72,
    },
    cardContainer: {
        backgroundColor: "#fff",
        paddingHorizontal: 24,
        paddingVertical: 30,
        borderRadius: 10,
    }
});

export default RecoverPassword;
