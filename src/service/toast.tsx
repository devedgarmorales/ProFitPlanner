import Toast from "react-native-toast-message";

export const showToast = (
    type: string,
    title: string,
    description: string,
) => {
    Toast.show({
        type: type,
        text1: title,
        text2: description,
    });
};
