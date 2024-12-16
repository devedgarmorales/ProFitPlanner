import * as React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import WelcomeScreen from "./src/screens/welcomeScreen/WelcomeScreen";
import LoginScreen from "./src/screens/auth/loginScreen/LoginScreen";
import RegisterScreen from "./src/screens/auth/registerScreen/RegisterScreen";
import RecoverPassword from "./src/screens/auth/recoverPassword/RecoverPassword";
import BottomTabs from "./src/navigate/BottomTabs";
import {RootStackParamList} from "./src/types/types";
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import Loader from "./src/components/Loader.tsx";
import {useToastStore} from "./src/store/toastStore.tsx";
import Orientation from "react-native-orientation-locker";

const Stack = createNativeStackNavigator<RootStackParamList>();

const toastConfig = {
    success: (props: any) => (
        <BaseToast
            {...props}
            style={{borderLeftColor: 'green'}}
            contentContainerStyle={{paddingHorizontal: 15}}
            text1Style={{
                fontSize: 17,
            }}
            text2Style={{
                fontSize: 15
            }}
        />
    ),
    error: (props: any) => (
        <ErrorToast
            {...props}
            text1Style={{
                fontSize: 17
            }}
            text2Style={{
                fontSize: 15
            }}
        />
    ),
};

function App() {
    const {position} = useToastStore();

    React.useEffect(() => {
        Orientation.lockToPortrait();

        return () => {
            Orientation.unlockAllOrientations();
        };
    }, []);

    return (
        <>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Welcome">
                    <Stack.Screen
                        name="Welcome"
                        component={WelcomeScreen}
                        options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="Register"
                        component={RegisterScreen}
                        options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="RecoverPassword"
                        component={RecoverPassword}
                        options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="DashboardTabs"
                        component={BottomTabs}
                        options={{headerShown: false}}
                    />
                </Stack.Navigator>
            </NavigationContainer>
            <Loader/>
            <Toast
                position={position}
                config={toastConfig}
            />
        </>
    );
}

export default App;
