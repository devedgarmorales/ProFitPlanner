import {useState} from "react";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as React from "react";
import CustomModal from "./CustomModal.tsx";

const ModalLogin = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
        <CustomModal
            visible={isVisible}
        >
            <View style={styles.modalContainer}>
                <View style={styles.actionSheet}>
                    <Text style={styles.title}>Bienvenido a GymTracker</Text>
                    <Text style={styles.subtitle}>Ingresa tus credenciales</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Ingresa tu email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor={'#888'}
                    />
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.inputPassword}
                            placeholder="Ingresa tu contraseña"
                            secureTextEntry={!passwordVisible} // Controla la visibilidad de la contraseña
                            autoCapitalize="none"
                            placeholderTextColor="#888" // Color del placeholder
                        />
                        <TouchableOpacity
                            onPress={() => setPasswordVisible(!passwordVisible)} // Cambia la visibilidad de la contraseña
                            style={styles.eyeIcon}
                        >
                            <Icon
                                name={passwordVisible ? 'eye-off' : 'eye'}
                                size={24}
                                color="gray"
                                style={{marginRight: 10}}
                            />
                        </TouchableOpacity>
                    </View>


                    <View style={styles.linksContainer}>
                        <TouchableOpacity>
                            <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.linksContainer}>
                        <TouchableOpacity>
                            <Text style={styles.link}>¿Aún no tienes una cuenta?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.button}>
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
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    actionSheet: {
        width: '100%',
        padding: 30,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 20,
        color: '#666',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        color: '#333',
        tintColor: '#333',
    },
    linksContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    link: {
        color: '#007BFF',
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
    },
    inputPassword: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        color: '#000',
    },
    eyeIcon: {
        paddingHorizontal: 10,
    },
});

export default ModalLogin;
