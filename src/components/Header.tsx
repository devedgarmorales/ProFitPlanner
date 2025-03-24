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
        }, [])
    );

    return (
        <SafeAreaView edges={["top"]} style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>
            <View style={styles.header}>
                <View>
                    <Text style={styles.text}>Buenas tardes,</Text>
                    <Text style={styles.userText}>
                        {user.first_name !== '' ? user.first_name + " " + user.last_name : user.username}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("Perfil")}>
                    <Image
                        source={
                            user.image_profile
                                ? {uri: user.image_profile}
                                : require("../assets/img/user_default.png")
                        }
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
        justifyContent: "center",
        paddingTop: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: "#ffffff",
        width: "100%",
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
