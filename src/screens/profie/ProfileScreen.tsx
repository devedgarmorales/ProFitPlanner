import React from "react";
import {View, Image, TouchableOpacity, StyleSheet, Text, ScrollView, RefreshControl} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import CustomInput from "../../components/CustomInput.tsx";
import ActionSheetUpdateProfile from "../../components/actionSheet/ActionSheetUpdateProfile.tsx";
import useUpdateProfile from "../../hooks/profile/useUpdateProfile.tsx";

export type RootStackParamList = {
    Login: undefined;
    Perfil: undefined;
};

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, "Perfil">;

const ProfileScreen = ({navigation}: ProfileScreenProps) => {

    const {
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
        onRefresh,
    } = useUpdateProfile({navigation});

    return (
        <ScrollView style={{ backgroundColor: '#fff' }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                    }>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={activateActionSheet}>
                        <Image
                            source={
                                user.image_profile?.uri
                                    ? { uri: user.image_profile.uri }
                                    : require("../../assets/img/user_default.png")
                            }
                            style={styles.profileImage}
                        />
                        <View style={styles.editIcon}>
                            <Icon name="edit" size={20} color={"gray"}/>
                        </View>
                    </TouchableOpacity>
                </View>

                <Text
                    style={styles.userText}>{user.first_name !== '' ? user.first_name + " " + user.last_name : user.username}</Text>

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
                            disabled={true}
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

            <ActionSheetUpdateProfile ref={actionSheetRef} setImageData={setUser}
                                      setFormValue={setFormValues}/>
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
