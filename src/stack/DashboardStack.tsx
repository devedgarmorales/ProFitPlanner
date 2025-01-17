import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../screens/dashboardScreen/DashboardScreen.tsx';
import FolderDetail from "../screens/dashboardScreen/FolderDetail.tsx";
import {useCheckTokenValidate} from "../utils/checkTokenValidate.tsx";

const Stack = createStackNavigator();

export default function TabStack() {

    useCheckTokenValidate();

    return (
        <Stack.Navigator initialRouteName="Dashboard">
            <Stack.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="FolderDetails"
                component={FolderDetail}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
