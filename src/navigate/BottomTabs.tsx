import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import {Text, View} from "react-native";
import RoutineStack from "../stack/RoutineStack";
import {useCheckTokenValidate} from "../utils/checkTokenValidate.tsx";
import ProfileScreen from "../screens/profie/ProfileScreen.tsx";
import {useBackExitApp} from "../utils/useBackExitApp.tsx";

export type RootStackParamList = {
    "Mi Rutina": undefined;
    Progreso: undefined;
    Perfil: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();

const ProgressScreen = () => {
    useBackExitApp();
    useCheckTokenValidate();

    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#F2F2F7'}}>
            <Icon name="bar-chart-outline" size={60} color="#007AFF" />
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#1C1C1E", marginTop: 10 }}>
                Tu Progreso
            </Text>
            <Text style={{ color: "#8E8E93", marginTop: 5 }}>
                Aquí verás tus estadísticas de entrenamiento
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
                        "Mi Rutina": { default: "barbell-outline", focused: "barbell" },
                        Progreso: { default: "stats-chart-outline", focused: "stats-chart" },
                        Perfil: { default: "person-outline", focused: "person" },
                    };

                    const iconName = icons[route.name as keyof typeof icons] ? 
                        (focused ? icons[route.name as keyof typeof icons].focused : icons[route.name as keyof typeof icons].default) : 
                        "barbell";

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#007AFF",
                tabBarInactiveTintColor: "#8E8E93",
                headerShown: false,
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: '#E5E5EA',
                    backgroundColor: '#FFFFFF',
                }
            })}
        >
            <Tab.Screen name="Mi Rutina" component={RoutineStack}/>
            <Tab.Screen name="Progreso" component={ProgressScreen}/>
            <Tab.Screen name="Perfil" component={ProfileScreen}
                        options={{
                            title: 'Mi Perfil',
                            headerShown: true,
                            headerTitleAlign: 'center',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                                fontSize: 18,
                                color: '#1C1C1E'
                            },
                        }}
            />
        </Tab.Navigator>
    );
}
