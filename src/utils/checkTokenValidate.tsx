import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { MMKV } from "react-native-mmkv";
import authFunctions from "../service/auth/authFunctions";
import useTokenModalStore from "../store/tokenModalStore";

const storage = new MMKV();

export const useCheckTokenValidate = () => {
    const { showModal, hideModal } = useTokenModalStore();

    const validateToken = React.useCallback(async () => {
        try {
            const tokens = JSON.parse(storage.getString("auth_tokens") || "{}");
            const accessToken = tokens.access;

            const body = {
                token: accessToken,
            };

            const response = await authFunctions.checkToken(
                "token/verify/",
                body,
                () => {},
                () => {},
                showModal
            );

            const { data } = response || {};

            const { code } = data || {};

            if (code === 401) {
                return showModal();
            }

            if (code === 200) {
                return hideModal();
            }
        } catch (error) {
            console.log("Error en validateToken:", error);
        }
    }, [showModal]);

    useFocusEffect(
        React.useCallback(() => {
            validateToken().then();
        }, [validateToken])
    );
};
