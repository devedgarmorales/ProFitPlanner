import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import DashboardScreen from '../screens/dashboardScreen/DashboardScreen.tsx';
import FolderDetail from "../screens/dashboardScreen/FolderDetail.tsx";
import {useCheckTokenValidate} from "../utils/checkTokenValidate.tsx";
import Header from "../components/Header.tsx";

const Stack = createStackNavigator();

export default function TabStack() {

    useCheckTokenValidate();

    return (
        <Stack.Navigator initialRouteName="Dashboard">
            <Stack.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    headerShown: true,
                    headerLeft: () => <></>,
                    header: () => <Header />,
                    title: '',
                }}
            />
            <Stack.Screen
                name="FolderDetails"
                component={FolderDetail}
                options={{
                    title: 'Mis Folders',
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        fontSize: 18,
                    },
                }}
            />
        </Stack.Navigator>
    );
}
