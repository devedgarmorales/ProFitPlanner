import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import {Text, View} from "react-native";
import DashboardStack from "../stack/DashboardStack.tsx";
import {useCheckTokenValidate} from "../utils/checkTokenValidate.tsx";
import ProfileScreen from "../screens/profie/ProfileScreen.tsx";
import {useBackExitApp} from "../utils/useBackExitApp.tsx";

export type RootStackParamList = {
    Inicio: undefined;
    Entrenamientos: undefined;
    Historial: undefined;
    Perfil: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();

const WorkoutScreen = () => {

    useBackExitApp();

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

    useBackExitApp();

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

export default function BottomTabs() {

    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    const icons = {
                        Inicio: { default: "home-outline", focused: "home" },
                        Perfil: { default: "person-outline", focused: "person" },
                        Entrenamientos: { default: "barbell-outline", focused: "barbell" },
                        Historial: { default: "time-outline", focused: "time" },
                    };

                    const iconName = icons[route.name] ? (focused ? icons[route.name].focused : icons[route.name].default) : "home";

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "blue",
                tabBarInactiveTintColor: "gray",
                headerShown: false,
            })}
        >
            <Tab.Screen name="Inicio" component={DashboardStack}/>
            <Tab.Screen name="Entrenamientos" component={WorkoutScreen}/>
            <Tab.Screen name="Historial" component={HistoryScreen}/>
            <Tab.Screen name="Perfil" component={ProfileScreen}
                        options={{
                            title: 'Mi Perfil',
                            headerShown: true,
                            headerTitleAlign: 'center',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                                fontSize: 18,
                            },
                        }}
            />
        </Tab.Navigator>
    );
}
