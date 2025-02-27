import {useEffect, useRef, useState} from "react";
import useLogin from "../login/useLogin.tsx";
import {useBackExitApp} from "../../utils/useBackExitApp.tsx";

const useDashboard = () => {
    const {hideActionSheet} = useLogin();
    const [refreshing, setRefreshing] = useState(false);
    const sonRef = useRef<{ onRefresh: () => void } | null>(null);

    useBackExitApp();

    useEffect(() => {
        hideActionSheet();
    }, []);

    const refreshingFunction = (state: boolean) => {
        setRefreshing(state);
    }

    const onRefreshFunction = () => {
        if (sonRef.current) {
            sonRef.current.onRefresh();
        }
    }

    return {
        refreshingFunction,
        onRefreshFunction,
        sonRef,
        refreshing
    };
}

export default useDashboard;
