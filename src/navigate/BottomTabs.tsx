import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import {Text, TouchableOpacity, View} from "react-native";
import DashboardStack from "../stack/DashboardStack.tsx";
import {MMKV} from "react-native-mmkv";
import {showToast} from "../service/toast.tsx";
import authFunctions from "../service/auth/authFunctions.tsx";
import useLoaderStore from "../store/loaderStore.tsx";
import {useToastStore} from "../store/toastStore.tsx";
import {useCheckTokenValidate} from "../utils/checkTokenValidate.tsx";

const Tab = createBottomTabNavigator();

const storage = new MMKV();

const WorkoutScreen = () => {

    // useBackHandler(() => {
    //     exitApp();
    //     return true;
    // });
    useCheckTokenValidate();

    return (
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
    )
}

const HistoryScreen = () => {

    useCheckTokenValidate();

    return (
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
    )
}

const ProfileScreen = ({navigation}: any) => {
    const {showLoader, hideLoader} = useLoaderStore();
    const {setSizeToast, setToastPosition} = useToastStore();

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
            const res = await authFunctions.loginAndLogout("token/revoke/", body, hideLoader, () => {}, () => {});

            const { data } = res || {};

            if (data !== undefined && data.code === 200) {
                hideLoader();
                showToast("success", "Sesión cerrada", "Has cerrado sesión exitosamente.");
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Login" }],
                })
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
