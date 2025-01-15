import React, {useRef, useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {ActionSheetRef} from "react-native-actions-sheet";
import Separator from "../components/Separator.tsx";
import Folders from "../components/Folders.tsx";
import ActionSheetCreateFolder from "./actionSheet/ActionSheetCreateFolder.tsx";
import {useToastStore} from "../store/toastStore.tsx";
import routinesFunctions from "../service/routines/routinesFunctions.tsx";
import useUpdateToken from "../store/updateTokenRefresh.tsx";
import {useFocusEffect} from "@react-navigation/native";

const ThreeButtonDashboard = ({navigation}: any) => {
    const actionSheetRef = useRef<ActionSheetRef>(null);
    const [dataFolders, setDataFolders] = useState<Array<string>>([]);
    const activateActionSheet = () => {
        actionSheetRef.current?.show();
    };
    const {setSizeToast, setToastPosition} = useToastStore();
    const {update, stopUpdate} = useUpdateToken();

    const petition = async () => {
        if (!update) {
            stopUpdate();
        }

        await routinesFunctions.getFolders("routines/folders/", () => {
        }, () => {
        }, () => {
        }, () => {
        }).then((res: any) => {
            //const {data} = res;

            if (res) {
                setSizeToast(240);
                setToastPosition("top");
                setDataFolders(res?.data);
            }

        });
    }

    useFocusEffect(
        React.useCallback(() => {
            setTimeout(() => {
                petition().then();
            }, 1500);

            return () => {

            };
        }, [])
    );

    React.useEffect(() => {
        if (update) {
            setTimeout(() => {
                petition().then();
            }, 1500);
        }
    }, [update]);

    return (
        <>
            <View style={styles.buttonContainer}>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Nueva Rutina</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={activateActionSheet}>
                        <Text style={styles.buttonText}>Crear Folder</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={[styles.button, styles.wideButton]}>
                    <Text style={styles.buttonText}>Comenzar Entrenamiento Rápido</Text>
                </TouchableOpacity>

                <View style={{
                    marginTop: 20,
                    marginBottom: 20,
                }}>
                    <Separator/>
                </View>

                <Folders dataFolders={dataFolders} navigation={navigation}/>
            </View>

            <ActionSheetCreateFolder ref={actionSheetRef} navigation={navigation} dataFolders={dataFolders}
                                     setDataFolders={setDataFolders}/>
        </>
    )
};

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 1,
        marginTop: 40,
        backgroundColor: "#F5F5F5",
    },
    row: {
        flexDirection: "row",
        marginBottom: 10,
        justifyContent: "space-between",
    },
    button: {
        backgroundColor: "#D3D3D3",
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: "center",
        justifyContent: "center",
        width: "49%"
    },
    buttonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold",
    },
    wideButton: {
        width: "100%",
    },
});

export default ThreeButtonDashboard;
