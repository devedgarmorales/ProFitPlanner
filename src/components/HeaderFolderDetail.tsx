import React, {useRef} from 'react';
import {View, Text, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/AntDesign";
import IconEnt from "react-native-vector-icons/Entypo";
import {useNavigation} from "@react-navigation/native";
import {ActionSheetRef} from "react-native-actions-sheet";
import ActionSheetFolderOptions from "./actionSheet/ActionSheetFolderOptions.tsx";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

type RootStackParamList = {
    Dashboard: undefined;
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const FolderDetail = ({id, title}: any) => {
    const navigation = useNavigation<NavigationProps>();
    const actionSheetRef = useRef<ActionSheetRef>(null);

    const openActionSheetOptionsFolder = () => {
        actionSheetRef.current?.show();
    }

    return (
        <>
            <SafeAreaView edges={["top"]} style={styles.safeArea}>
                <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>

                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                        <Icon name="arrowleft" size={24} color={"black"}/>
                    </TouchableOpacity>

                    <Text style={styles.title}>{title}</Text>

                    <TouchableOpacity onPress={openActionSheetOptionsFolder} style={styles.iconButton}>
                        <IconEnt name="dots-three-vertical" size={20} color={"black"}/>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

           <ActionSheetFolderOptions id={id} title={title} navigation={navigation} ref={actionSheetRef} />
        </>
    )
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: "#ffffff",
        justifyContent: "center",
        paddingTop: 10,
    },
    buttonText: {
        color: '#494949',
        fontSize: 16,
        fontWeight: 'bold',
        paddingRight: 10,
        paddingTop: 10
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    iconButton: {
        padding: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        flex: 1,
    },
});

export default FolderDetail;
