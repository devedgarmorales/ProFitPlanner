import React, {useRef, useState} from "react";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {ActionSheetRef} from "react-native-actions-sheet";
import Separator from "../components/Separator.tsx";
import Folders from "../components/Folders.tsx";
import ActionSheetCreateFolder from "./actionSheet/ActionSheetCreateFolder.tsx";
import {useToastStore} from "../store/toastStore.tsx";
import routinesFunctions from "../service/routines/routinesFunctions.tsx";
import useUpdateToken from "../store/updateTokenRefresh.tsx";
import {useFocusEffect} from "@react-navigation/native";
import {useCheckTokenValidate} from "../utils/checkTokenValidate.tsx";

const ThreeButtonDashboard = ({navigation}: any) => {
    const actionSheetRef = useRef<ActionSheetRef>(null);
    const inputRef = useRef<TextInput>(null);
    const [dataFolders, setDataFolders] = useState<Array<string>>([]);
    const activateActionSheet = () => {
        actionSheetRef.current?.show();
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };
    const {setSizeToast, setToastPosition} = useToastStore();
    const {update, stopUpdate} = useUpdateToken();

    useCheckTokenValidate();

    const petition = async () => {
        if (!update) {
            stopUpdate();
        }

        await routinesFunctions.getFolders("routines/folders/", () => {
        }, () => {
        }, () => {
        }, () => {
        }).then((res: any) => {
            if (res === undefined) return;

            const {code, data} = res.data;

            if (code === 200) {
                setSizeToast(240);
                setToastPosition("top");
                const allDataFolders = data.folders.map((folder: any) => {
                    return {
                        title: folder.name,
                        image: folder.cover_image_url,
                    };
                });

                setDataFolders(allDataFolders.reverse());
            }

        });
    }

    useFocusEffect(
        React.useCallback(() => {
            petition().then();
        }, [])
    );

    React.useEffect(() => {
        if (update) {
            petition().then();
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
                                     setDataFolders={setDataFolders} inputRef={inputRef} />
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
