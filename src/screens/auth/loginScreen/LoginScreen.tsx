import * as React from "react";
import {Image, StyleSheet, View, Dimensions} from "react-native";
import {NativeStackNavigationProp, NativeStackScreenProps} from "@react-navigation/native-stack";
import ActionSheetLogin from "../../../components/actionSheet/ActionSheetLogin.tsx";
import {RootStackParamList} from "../../../interface/navigation/principalNavInterface.ts";
import {RouteProp} from "@react-navigation/native";

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
    route?: RouteProp<RootStackParamList, "Login">;
};

const LoginScreen = ({navigation, route}: Props) => {
    return (
        <>
            <View style={styles.content}>
                <Image
                    source={require("../../../assets/img/image.png")}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
            <ActionSheetLogin key={Math.random()} navigation={navigation} route={route ?? { key: "default", name: "Login" }} />
        </>
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
