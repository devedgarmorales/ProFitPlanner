import React, {useEffect} from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import {BackHandler, Text, TouchableOpacity, View} from "react-native";
import DashboardStack from "../stack/DashboardStack.tsx";
import {MMKV} from "react-native-mmkv";
import {showToast} from "../service/toast.tsx";
import authFunctions from "../service/auth/authFunctions.tsx";
import useLoaderStore from "../store/loaderStore.tsx";

const Tab = createBottomTabNavigator();

const storage = new MMKV();

const WorkoutScreen = () => (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <Text
            style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "blue",
            }}
        >
            Workout Screen
        </Text>
    </View>
);

const HistoryScreen = () => (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <Text
            style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "blue",
            }}
        >
            History Screen
        </Text>
    </View>
);

const ProfileScreen = ({navigation}: any) => {
    const {showLoader, hideLoader} = useLoaderStore();

    const handleLogout = async () => {
        const token = storage.getString("refresh_token");
        const tokenObject = token ? JSON.parse(token) : null;
        const body = {
            "refresh_token": tokenObject,
        };

        try {
            showLoader();
            const res = await authFunctions.loginAndLogout("token/revoke", body, hideLoader)
            console.log("Response", res);
            const { data } = res || {};
            //data.code === 200
            if (data !== undefined && data.code === 200) {
                hideLoader();
                showToast("success", "Sesión cerrada", "Has cerrado sesión exitosamente.");
                navigation.navigate('Welcome');
                storage.clearAll();
            }
        } catch (e) {
            console.error("Error en la solicitud:", e);
        }
    };

    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
        }}>
            <Text style={{
                fontSize: 18,
                marginBottom: 20,
                color: '#333',
            }}>¿Deseas cerrar sesión?</Text>
            <TouchableOpacity onPress={handleLogout} style={{
                backgroundColor: '#f44336',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
            }}>
                <Text style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 'bold',
                }}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    )
}

export default function BottomTabs() {

    useEffect(() => {
        const backAction = () => {
            BackHandler.exitApp();
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove();
    }, []);

    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName = "";

                    if (route.name === "Inicio") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "Perfil") {
                        iconName = focused ? "person" : "person-outline";
                    } else if (route.name === "Settings") {
                        iconName = focused ? "settings" : "settings-outline";
                    } else if (route.name === "Entrenamientos") {
                        iconName = focused ? "barbell" : "barbell-outline";
                    } else if (route.name === "Historial") {
                        iconName = focused ? "time" : "time-outline";
                    }

                    return <Icon name={iconName} size={size} color={color}/>;
                },
                tabBarActiveTintColor: "blue",
                tabBarInactiveTintColor: "gray",
                headerShown: false,
            })}
        >
            <Tab.Screen name="Inicio" component={DashboardStack}/>
            <Tab.Screen name="Entrenamientos" component={WorkoutScreen}/>
            <Tab.Screen name="Historial" component={HistoryScreen}/>
            <Tab.Screen name="Perfil" component={ProfileScreen}/>
        </Tab.Navigator>
    );
}
