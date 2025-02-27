import React from "react";
import {StyleSheet, ScrollView, RefreshControl} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Calendar from "../../components/Calendar.tsx";
import ThreeButtonDashboard from "../../components/ThreeButtonDashboard.tsx";
import Separator from "../../components/Separator.tsx";
import useDashboard from "../../hooks/dashboard/useDashboard.tsx";
import {RootStackParamList} from "../../interface/navigation/dashboardNavInterface.ts";

type DashboardScreenProps = NativeStackScreenProps<RootStackParamList, "Dashboard">;

const DashboardScreen = ({navigation}: DashboardScreenProps) => {

    const {
        refreshingFunction,
        onRefreshFunction,
        sonRef,
        refreshing
    } = useDashboard();

    return (
        <ScrollView style={styles.container}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefreshFunction}/>
                    }>
            <Separator/>
            <Calendar/>
            <ThreeButtonDashboard navigation={navigation} refreshing={refreshingFunction} ref={sonRef} />
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
