import {BackHandler, Platform} from 'react-native';
import { useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import RNExitApp from 'react-native-exit-app';

const hasHomeButton = Platform.OS === 'ios' && parseFloat(Platform.Version) < 11;

export const useBackHandler = (backAction: () => boolean) => {
    const navigation = useNavigation();

    useEffect(() => {
        if (Platform.OS === 'android') {
            const handler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction
            );

            return () => handler.remove();
        } else if (hasHomeButton) {
            const beforeRemoveListener = navigation.addListener('beforeRemove', (e) => {
                e.preventDefault();
                backAction();
            });

            return () => navigation.removeListener('beforeRemove', beforeRemoveListener);
        }
    }, [backAction, navigation]);
};

export const exitApp = () => {
    if (Platform.OS === 'android') {
        BackHandler.exitApp();
    } else if (hasHomeButton) {
        RNExitApp.exitApp();
    }
};
