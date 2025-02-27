import React, {forwardRef, useEffect, useImperativeHandle, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import {ActionSheetRef} from 'react-native-actions-sheet';
import ActionSheetBase from "./ActionSheetBase.tsx";
import apiFunctions from "../../service/folders/foldersFunctions.tsx";
import {showToast} from "../../service/toast.tsx";
import {useToastStore} from "../../store/toastStore.tsx";
import {useFolderStore} from "../../store/folderStore.tsx";
import {useFlatListStore} from "../../store/flatListRefStore.tsx";

interface ActionSheetFolderOptionsProps {
    id: number;
    title: string;
    navigation: any;
}

const ActionSheetFolderOptions = forwardRef<ActionSheetRef, ActionSheetFolderOptionsProps>(
    ({id, title, navigation}, ref) => {
        const actionSheetRef = useRef<ActionSheetRef>(null);
        const {setSizeToast, setToastPosition} = useToastStore();
        const {dataFolders, setDataFolders} = useFolderStore();
        const flatListRef = useFlatListStore((state) => state.flatListRef);

        const deleteFolderFunction = async () => {
            setSizeToast(240);
            setToastPosition("bottom");

            await apiFunctions.deleteFolders(`folders/${id}/`, () => {
            }, () => {
            }, () => {
            })
                .then((res: any) => {
                    console.log("deleteFolderFunction", res);

                    setDataFolders(dataFolders.filter((folder: any) => folder.id !== id));
                    flatListRef.current?.scrollToOffset({offset: 0, animated: true});
                    showToast('success', 'Folder', 'Eliminado correctamente');
                    actionSheetRef.current?.hide();
                    navigation.goBack();
                    // if (res === undefined) return;
                    //
                    // const {code} = res.data;
                    //
                    // if (code === 200) {
                    //     showToast('success', 'Éxito', 'Folder eliminado correctamente');
                    //     navigation.goBack();
                    // }
                });
        }

        const editFolderFunction = async () => {
            actionSheetRef.current?.hide();
            navigation.navigate('FolderEdit', {id, title})
        }

        useImperativeHandle(ref, () => ({
            show: () => actionSheetRef.current?.show(),
            hide: () => actionSheetRef.current?.hide(),
        } as ActionSheetRef));

        useEffect(() => {
            return () => {
                actionSheetRef.current?.hide();
            }
        }, []);

        return (
            <ActionSheetBase
                showBackgroundColor={false}
                actionSheetRef={actionSheetRef}
                closeable={true}
                gesture={false}
            >
                <View style={styles.actionSheetContent}>
                    <TouchableOpacity style={[styles.row]} onPress={editFolderFunction}>
                        <Icon name="pencil" size={20} color={"gray"}/>
                        <Text style={styles.sheetTitle}>Editar folder</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.row, styles.borderTop]}
                                      onPress={deleteFolderFunction}>
                        <Icon name="trash" size={20} color={"red"}/>
                        <Text style={[styles.sheetTitle, {color: "red"}]}>Eliminar folder</Text>
                    </TouchableOpacity>
                </View>
            </ActionSheetBase>
        );
    }
);

const styles = StyleSheet.create({
    actionSheetContent: {padding: 20},
    sheetTitle: {fontSize: 14, fontWeight: 'bold', color: 'black', marginLeft: 16, marginVertical: 10},
    containerInput: {flexDirection: 'row', alignItems: 'center'},
    row: {
        flexDirection: "row",
        paddingVertical: 12,
        alignItems: "center",
    },
    borderTop: {
        borderTopWidth: 0.5,
        borderTopColor: '#b9b6b6',
    },
    createButton: {
        backgroundColor: '#007BFF',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
    },
    createButtonText: {color: '#fff', fontWeight: 'bold'},
});

export default ActionSheetFolderOptions;
