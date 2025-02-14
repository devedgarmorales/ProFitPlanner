import React, {useEffect, useState, useRef} from "react";
import {StyleSheet, ScrollView, RefreshControl} from "react-native";
import Calendar from "../../components/Calendar.tsx";
import ThreeButtonDashboard from "../../components/ThreeButtonDashboard.tsx";
import useLogin from "../../hooks/login/useLogin.tsx";
import Separator from "../../components/Separator.tsx";
import {useBackHandler, exitApp} from "../../utils/goBackNav.tsx";

const DashboardScreen = ({navigation}: any) => {
    const {hideActionSheet} = useLogin();
    const [refreshing, setRefreshing] = useState(false);
    const sonRef = useRef<{ onRefresh: () => void } | null>(null);

    useBackHandler(() => {
        exitApp();
        return true;
    });

    useEffect(() => {
        hideActionSheet();
    }, []);

    const refreshingFunction = (state: any) => {
        setRefreshing(state);
    }

    const onRefreshFunction = () => {
        if (sonRef.current) {
            sonRef.current.onRefresh();
        }
    }

    return (
        <ScrollView style={styles.container} refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefreshFunction}/>
        }>
            <Separator/>
            <Calendar/>
            <ThreeButtonDashboard navigation={navigation} refreshing={refreshingFunction} ref={sonRef}/>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
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
