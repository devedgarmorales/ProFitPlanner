import React, {useEffect} from "react";
import {StyleSheet, View, Platform, ScrollView} from "react-native";
import Header from "../../components/Header";
import Calendar from "../../components/Calendar.tsx";
import ThreeButtonDashboard from "../../components/ThreeButtonDashboard.tsx";
import {exitApp, useBackHandler} from "../../utils/goBackNav.tsx";
import useLogin from "../../hooks/login/useLogin.tsx";

const DashboardScreen = ({navigation}: any) => {
    const {hideActionSheet} = useLogin();

    useBackHandler(() => {
        exitApp();
        return true;
    });

    useEffect(() => {
        hideActionSheet();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <Calendar/>
            <ThreeButtonDashboard navigation={navigation}/>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 14,
        backgroundColor: "#ffffff",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        fontSize: 16,
    },
});

export default DashboardScreen;
