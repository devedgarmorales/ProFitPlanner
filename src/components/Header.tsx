import React, {useCallback, useState} from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {MMKV} from 'react-native-mmkv';
import {useFocusEffect} from "@react-navigation/native";

const Header = ({navigation}: any) => {

    const storage = new MMKV();

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
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 20,
        justifyContent: "space-between",
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        textTransform: "uppercase",
    },
    userText: {
        fontSize: 24,
        color: "#333",
    },
});

export default Header;
