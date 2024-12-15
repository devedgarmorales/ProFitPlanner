import {StyleSheet, View} from "react-native";
import Header from "../../components/Header";
import Calendar from "../../components/Calendar.tsx";
import ThreeButtonDashboard from "../../components/ThreeButtonDashboard.tsx";

const DashboardScreen = ({navigation}: any) => {
    return (
        <View style={styles.container}>
            <Header navigation={navigation}/>
            <Calendar/>
            <ThreeButtonDashboard navigation={navigation}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 14,
        paddingTop: 40,
        backgroundColor: "#f9f9f9",
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
