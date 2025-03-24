import React, {useRef, forwardRef, useImperativeHandle} from "react";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {ActionSheetRef} from "react-native-actions-sheet";
import {useFocusEffect} from "@react-navigation/native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Separator from "../components/Separator.tsx";
import Folders from "../components/Folders.tsx";
import ActionSheetCreateFolder from "./actionSheet/ActionSheetCreateFolder.tsx";
import {useToastStore} from "../store/toastStore.tsx";
import apiFunctions from "../service/folders/foldersFunctions.tsx";
import useUpdateToken from "../store/updateTokenRefresh.tsx";
import {useCheckTokenValidate} from "../utils/checkTokenValidate.tsx";
import {useFolderStore} from "../store/folderStore.tsx";
import {RootStackParamList} from "../interface/navigation/dashboardNavInterface.ts";

type DashboardScreenProps = NativeStackScreenProps<RootStackParamList, "Dashboard">;

type ThreeButtonDashboardProps = {
    navigation: DashboardScreenProps["navigation"];
    refreshing: (value: boolean) => void;
};

const ThreeButtonDashboard = forwardRef(({navigation, refreshing}: ThreeButtonDashboardProps, ref) => {
    const actionSheetRef = useRef<ActionSheetRef>(null);
    const inputRef = useRef<TextInput>(null);
    const {setDataFolders} = useFolderStore();

    const activateActionSheet = () => {
        if (actionSheetRef.current) {
            actionSheetRef.current?.show();
        }
    };

    const {setSizeToast, setToastPosition} = useToastStore();
    const {update, stopUpdate} = useUpdateToken();

    useCheckTokenValidate();

    const initialData = async () => {
        if (!update) {
            stopUpdate();
        }

        const res = await apiFunctions.getFolders("folders/", () => {}, () => {}, () => {});

        if (!res || !res.data) {
            console.error("Respuesta inválida de la API");
            return;
        }

        const { code, data } = res.data;

        if (code === 200 && data) {
            setSizeToast(240);
            setToastPosition("top");

            const allDataFolders = data.map((folder: any) => ({
                id: folder.id,
                title: folder.name,
                image: folder.cover_image_url,
            }));

            setDataFolders(allDataFolders.reverse());
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            initialData().then();
        }, [])
    );

    React.useEffect(() => {
        if (update) {
            initialData().then();
        }
    }, [update]);

    const onRefresh = () => {
        refreshing(true);

        setTimeout(() => {
            refreshing(false);
            initialData().then();
        }, 1500);
    };

    useImperativeHandle(ref, () => ({
        onRefresh: onRefresh,
    }));

    return (
        <View style={styles.container}>
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

                <View style={{marginTop: 20, marginBottom: 20}}>
                    <Separator/>
                </View>
            </View>

            <Folders navigation={navigation}/>

            <ActionSheetCreateFolder
                key={Math.random()}
                ref={actionSheetRef}
                navigation={navigation}
                inputRef={inputRef}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {flex: 1},
    buttonContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
        paddingHorizontal: 20,
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
        width: "49%",
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
