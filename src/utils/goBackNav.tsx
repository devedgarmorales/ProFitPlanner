import {BackHandler} from 'react-native';
import {useEffect} from "react";

export const useBackHandler = (backAction: any) => {
    useEffect(() => {
        const handler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => handler.remove();
    }, [backAction]);
};

export const exitApp = () => {
    BackHandler.exitApp();
};
//
