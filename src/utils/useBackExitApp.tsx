import { useEffect } from "react";
import { BackHandler } from "react-native";
import RNExitApp from "react-native-exit-app";
import { useNavigation } from "@react-navigation/native";

export const useBackExitApp = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const onBackPress = () => {
            if (navigation.isFocused()) {
                RNExitApp.exitApp();
                return true;
            }
            return false;
        };

        BackHandler.addEventListener("hardwareBackPress", onBackPress);

        return () => {
            BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        };
    }, [navigation]);
};
