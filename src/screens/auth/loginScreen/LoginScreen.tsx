import * as React from "react";
import {Image, StyleSheet, View, Dimensions} from "react-native";
import ActionSheetLogin from "../../../components/actionSheet/ActionSheetLogin.tsx";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../../types/types.ts";

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen = ({navigation}: LoginScreenProps) => {

    return (
        <View>
            <View style={styles.content}>
                <Image
                    source={require("../../../assets/img/image.png")}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
            <ActionSheetLogin key={Math.random()} navigation={navigation}/>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    image: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
});

export default LoginScreen;
