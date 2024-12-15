import React, {useState, useRef} from "react";
import {
    View,
    TextInput,
    Animated,
    StyleSheet,
    TextInputProps, TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface CustomInputProps extends TextInputProps {
    label: string;
    value: string;
    onValueChange: (name: string, value: string) => void;
    name: string;
    setPasswordVisible?: (value: boolean) => void;
    passwordVisible?: boolean;
    color?: string;
    backgroundColor?: string;
    showBackground?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
                                                     label,
                                                     value,
                                                     onValueChange,
                                                     name,
                                                     onFocus,
                                                     onBlur,
                                                     setPasswordVisible,
                                                     passwordVisible,
                                                     color, backgroundColor = "#fff",
                                                     showBackground = true,
                                                     ...textInputProps
                                                 }) => {
    const [isFocused, setIsFocused] = useState(false);
    const animatedValue = useRef(new Animated.Value(0)).current;
    const handleFocus = () => {
        setIsFocused(true);
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
        if (onFocus) onFocus({} as any);
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (!value) {
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
        if (onBlur) onBlur({} as any);
    };

    const getLabelStyle = () => ({
        position: "absolute" as const,
        left: 10,
        top: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [14, -10],
        }),
        fontSize: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 12],
        }),
        color: isFocused ? "#007BFF" : "#999",
        backgroundColor: showBackground ? backgroundColor : undefined,
    });

    const getUnderlineStyle = (
        animatedValue: any,
        isFocused: any
    ) => ({
        height: 2,
        backgroundColor: isFocused ? "#007AFF" : "#888",
        transform: [
            {
                scaleX: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                }),
            },
        ],
    });

    return (
        <View style={
            showBackground ? styles.containerInput : styles.containerInput2
        }>
            <Animated.Text style={getLabelStyle()}>{label}</Animated.Text>
            <TextInput
                style={styles.input}
                value={value}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChangeText={(text) => onValueChange(name, text)}
                placeholder=""
                {...textInputProps}
            />
            {
                (name === "password" || name === "confirmPassword") && (
                    <TouchableOpacity
                        onPress={() => {
                            setPasswordVisible && setPasswordVisible(!passwordVisible)
                        }}
                        style={styles.eyeIcon}
                    >
                        <Icon
                            name={passwordVisible ? "eye" : "eye-off"}
                            size={24}
                            color="gray"
                            style={{marginRight: 10}}
                        />
                    </TouchableOpacity>
                )
            }
            {/*<Animated.View*/}
            {/*    style={[styles.underline, getUnderlineStyle(animatedValue, isFocused)]}*/}
            {/*/>*/}
        </View>
    );
};

const styles = StyleSheet.create({
    containerInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingVertical: 5,
        position: "relative",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    containerInput2: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingVertical: 5,
        position: "relative",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    input: {
        fontSize: 16,
        height: 40,
        color: "#000",
        width: "100%",
        paddingHorizontal: 10
    },
    eyeIcon: {
        paddingHorizontal: 10,
        position: "absolute",
        right: 2,
    },
});

export default CustomInput;
