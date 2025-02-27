import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Header from "../components/Header.tsx";
import HeaderFolderDetail from "../components/HeaderFolderDetail.tsx";

import DashboardScreen from '../screens/dashboardScreen/DashboardScreen.tsx';
import FolderDetail from '../screens/dashboardScreen/FolderDetail.tsx';
import ShowAllFolders from "../screens/dashboardScreen/ShowAllFolders.tsx";
import FolderEdit from "../screens/dashboardScreen/FolderEdit.tsx";

import {useCheckTokenValidate} from "../utils/checkTokenValidate.tsx";
import {RootStackParamList} from "../interface/navigation/dashboardNavInterface.ts";

const Stack = createStackNavigator<RootStackParamList>();

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
                name="FolderDetail"
                component={FolderDetail}
                options={({ route }) => ({
                    headerShown: true,
                    header: () => <HeaderFolderDetail id={route.params.id} title={route.params.title} />,
                    title: '',
                })}
            />
            <Stack.Screen
                name="ShowAllFolders"
                component={ShowAllFolders}
                options={{
                    title: 'Mis Folders',
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        fontSize: 18,
                    },
                }}
            />
            <Stack.Screen
                name="FolderEdit"
                component={FolderEdit}
                options={{
                    title: 'Editar Folder',
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
