import React, {useCallback, useState} from "react";
import {Image, StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {MMKV} from 'react-native-mmkv';
import {useFocusEffect} from "@react-navigation/native";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {SafeAreaView} from "react-native-safe-area-context";

type RootStackParamList = {
    Perfil: undefined;
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const Header = () => {

    const storage = new MMKV();
    const navigation = useNavigation<NavigationProps>();

    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        image_profile: "",
    });

    useFocusEffect(
        useCallback(() => {
            try {
                const storedUser = storage.getString("user_info");
                if (storedUser) {
                    const userData = JSON.parse(storedUser);

                    setUser({
                        first_name: userData.first_name || "",
                        last_name: userData.last_name || "",
                        username: userData.username || "",
                        email: userData.email || "",
                        image_profile: userData.image_profile || "",
                    });
                }
            } catch (error) {
                console.error("Error parsing user_info:", error);
            }
        }, [])
    );

    return (
        <SafeAreaView edges={["top"]} style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <View>
                    <Text style={styles.text}>Buenas tardes,</Text>
                    <Text
                        style={styles.userText}>{user.first_name !== '' ? user.first_name + " " + user.last_name : user.username}</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("Perfil")}>
                    <Image
                        source={{uri: user.image_profile || "https://picsum.photos/200/300"}}
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: "#ffffff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 40,
    },
    text: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        textTransform: "uppercase",
    },
    userText: {
        fontSize: 16,
        color: "#333",
    },
});

export default Header;
