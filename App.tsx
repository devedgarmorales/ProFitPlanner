import * as React from "react";
import {Platform} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Orientation from "react-native-orientation-locker";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import WelcomeScreen from "./src/screens/welcomeScreen/WelcomeScreen";
import LoginScreen from "./src/screens/auth/loginScreen/LoginScreen";
import RegisterScreen from "./src/screens/auth/registerScreen/RegisterScreen";
import RecoverPassword from "./src/screens/auth/recoverPassword/RecoverPassword";
import BottomTabs from "./src/navigate/BottomTabs";
import Loader from "./src/components/Loader";
import ModalToken from "./src/components/ModalToken";
import { useToastStore } from "./src/store/toastStore";
import useTokenModalStore from "./src/store/tokenModalStore";
import { RootStackParamList } from "./src/types/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
    const {position, sizeToast} = useToastStore();
    const {show} = useTokenModalStore();

    const toastConfig = {
        success: (props: any) => (
            <BaseToast
                {...props}
                style={{borderLeftColor: 'green'}}
                contentContainerStyle={{paddingHorizontal: 15}}
                text1Style={{
                    fontSize: 17,
                    lineHeight: 24,
                }}
                text2Style={{
                    fontSize: 15,
                    lineHeight: 24,
                }}
            />
        ),
        error: (props: any) => (
            <ErrorToast
                {...props}
                contentContainerStyle={{
                    paddingHorizontal: 15,
                    paddingVertical: 20,
                }}
                text2NumberOfLines={3}
                text1Style={{
                    fontSize: 17,
                }}
                text2Style={{
                    fontSize: 15,
                }}
                style={{
                    borderLeftColor: 'red',
                    height: undefined,
                    maxHeight: sizeToast,
                    paddingVertical: 5,
                    zIndex: 99999,
                    marginTop: Platform.OS === "ios" ? 30 : 20,
                }}
            />

        ),
    };

    React.useEffect(() => {
        Orientation.lockToPortrait();

        return () => {
            Orientation.unlockAllOrientations();
        };
    }, []);

    return (
        <GestureHandlerRootView style={{
            flex: 1,
        }}>
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
                        options={{
                            headerShown: false, gestureEnabled: true,
                            headerBackButtonMenuEnabled: false,
                        }}
                    />
                    <Stack.Screen
                        name="DashboardTabs"
                        component={BottomTabs}
                        options={{headerShown: false}}
                    />
                </Stack.Navigator>
                <ModalToken visible={show}/>
                <Loader/>
                <Toast
                    position={position}
                    config={toastConfig}
                />
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}

export default App;
