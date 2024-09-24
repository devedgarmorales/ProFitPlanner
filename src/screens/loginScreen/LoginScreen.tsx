import {Image, StyleSheet, View} from "react-native";
import * as React from "react";
import ModalLogin from "../../components/ModalLogin";

const LoginScreen = () => {
    return (
        <View style={{flex: 1, alignItems: 'center'}}>
            <View style={styles.content}>
                <Image source={require('../../assets/img/logo-login.png')}/>
            </View>
            <ModalLogin/>
        </View>
    )
}

const styles = StyleSheet.create({
    content: {
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },
});

export default LoginScreen;
