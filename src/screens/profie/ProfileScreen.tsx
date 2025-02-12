import React, {useEffect, useRef, useState} from "react";
import {View, Image, TouchableOpacity, StyleSheet, Text, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useLoaderStore from "../../store/loaderStore.tsx";
import {useToastStore} from "../../store/toastStore.tsx";
import {useCheckTokenValidate} from "../../utils/checkTokenValidate.tsx";
import authFunctions from "../../service/auth/authFunctions.tsx";
import userFunctions from "../../service/user/userFunctions.tsx";
import {showToast} from "../../service/toast.tsx";
import {MMKV} from "react-native-mmkv";
import CustomInput from "../../components/CustomInput.tsx";
import {ActionSheetRef} from "react-native-actions-sheet";
import ActionSheetUpdateProfile from "../../components/actionSheet/ActionSheetUpdateProfile.tsx";

const storage = new MMKV();

const ProfileScreen = ({navigation}: any) => {
    const actionSheetRef = useRef<ActionSheetRef>(null);
    const {showLoader, hideLoader} = useLoaderStore();
    const {setSizeToast, setToastPosition} = useToastStore();

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

    useEffect(() => {
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
    }, []);

    useCheckTokenValidate();

    const handleLogout = async () => {
        const tokens = JSON.parse(storage.getString('auth_tokens') || '{}');
        const accessToken = tokens.access;

        const body = {
            "token": accessToken,
        };

        setSizeToast(80);
        setToastPosition('top');
        try {
            showLoader();
            await authFunctions.loginAndLogout("token/revoke/", body, hideLoader, () => {
            }, () => {
            }).then(
                (res: any) => {
                    const {data} = res || {};

                    if (data !== undefined && data.code === 200) {
                        hideLoader();
                        showToast("success", "Sesión cerrada", "Has cerrado sesión exitosamente.");
                        navigation.reset({
                            index: 0,
                            routes: [{name: "Login"}],
                        })
                        storage.clearAll();
                    }
                }
            );
        } catch (e) {
            console.error("Error en la solicitud:", e);
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
                uri: formValues.image_profile.uri,
                name: formValues.image_profile.name || "profile.jpg",
                type: formValues.image_profile.type || "image/jpeg",
            };
            body.append("image_profile", imageFile);
        }

        setSizeToast(120);
        setToastPosition('top');

        try {
            showLoader();
            await userFunctions.updateProfile("auth/user/", body, hideLoader, () => {}, () => {}, true).then(
                (res: any) => {
                    const {code, data} = res?.data || {};

                    if (code === 200) {
                        showToast("success", "Perfil actualizado", "Tu perfil ha sido actualizado exitosamente.");
                        setUser({
                            first_name: data.first_name,
                            last_name: data.last_name,
                            username: data.username,
                            email: data.email,
                            image_profile: {
                                uri: data.image_profile,
                                name: "",
                                type: "",
                            }
                        });

                        setFormValues({
                            first_name: data.first_name,
                            last_name: data.last_name,
                            username: data.username,
                            email: data.email,
                            image_profile: {
                                uri: data.image_profile,
                                name: "",
                                type: "",
                            }
                        });

                        storage.set("user_info", JSON.stringify(data));
                    } else {
                        showToast("error", "¡Ocurrió un error!", "No se pudo actualizar tu perfil.");
                    }

                    hideLoader();
                }
            );
        } catch (e) {
            hideLoader();
            console.error("Error en la solicitud:", e);
        }
    }

    return (
        <ScrollView style={{
            backgroundColor: '#fff',
        }}>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={activateActionSheet}>
                        <Image
                            source={{uri: user.image_profile.uri || "https://picsum.photos/200/300"}}
                            style={styles.profileImage}
                        />
                        <View style={styles.editIcon}>
                            <Icon name="edit" size={20} color={"gray"}/>
                        </View>
                    </TouchableOpacity>
                </View>

                <Text style={styles.userText}>{user.first_name !== '' ? user.first_name + " " + user.last_name : user.username}</Text>

                <Text style={styles.userEmail}>{user.email}</Text>

                <View style={styles.principalContainer}>

                    <View style={[styles.containerInput, {marginTop: 10}]}>
                        <CustomInput
                            label="Usuario"
                            value={formValues.username}
                            name="username"
                            onValueChange={handleInputChange}
                            keyboardType="default"
                            autoCapitalize="none"
                            color="#000000"
                            showOnFocus={isNotEmpty(formValues.username)}
                        />
                    </View>

                    <View style={[styles.containerInput, {marginTop: 20}]}>
                        <CustomInput
                            label="Nombre"
                            value={formValues.first_name}
                            name="first_name"
                            onValueChange={handleInputChange}
                            keyboardType="default"
                            autoCapitalize="none"
                            color="#000000"
                            showOnFocus={isNotEmpty(formValues.first_name)}
                        />
                    </View>

                    <View style={[styles.containerInput, {marginTop: 20}]}>
                        <CustomInput
                            label="Apellido"
                            value={formValues.last_name}
                            name="last_name"
                            onValueChange={handleInputChange}
                            keyboardType="default"
                            autoCapitalize="none"
                            color="#000000"
                            showOnFocus={isNotEmpty(formValues.last_name)}
                        />
                    </View>

                    <View style={[styles.containerInput, {marginTop: 20}]}>
                        <CustomInput
                            label="Correo electrónico"
                            value={formValues.email}
                            name="email"
                            onValueChange={handleInputChange}
                            keyboardType="default"
                            autoCapitalize="none"
                            color="#000000"
                            showOnFocus={isNotEmpty(formValues.email)}
                        />
                    </View>

                    <TouchableOpacity onPress={handleUpdateProfile} style={styles.updateButton}>
                        <Text style={styles.textButton}>Actualizar Perfil</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                        <Text style={styles.textButton}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ActionSheetUpdateProfile ref={actionSheetRef} navigation={navigation} setImageData={setUser}
                                      setFormValue={setFormValues} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#fff',
        paddingVertical: 30,
    },
    imageContainer: {
        position: 'relative',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 60,
    },
    editIcon: {
        position: 'absolute',
        right: 0,
        bottom: 6,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 5,
        borderWidth: 1,
        borderColor: 'gray',
    },
    userText: {
        marginTop: 20,
        fontSize: 26,
        color: "#333",
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 14,
        color: "#afafaf",
        marginBottom: 20,
    },
    containerInput: {
        borderRadius: 8,
        backgroundColor: "#fff",
        marginTop: 15
    },
    principalContainer: {
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        borderRadius: 10,
        marginHorizontal: 20,
    },
    updateButton: {
        backgroundColor: '#1d44ff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 25,
        alignItems: 'center',
    },
    logoutButton: {
        backgroundColor: '#ff1200',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 15,
        alignItems: 'center',
    },
    textButton: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default ProfileScreen;
