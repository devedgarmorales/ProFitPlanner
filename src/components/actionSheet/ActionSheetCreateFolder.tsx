import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import {showToast} from '../../service/toast';
import {useToastStore} from '../../store/toastStore';
import updateTokenRefresh from "../../store/updateTokenRefresh.tsx";
import routinesFunctions from "../../service/routines/routinesFunctions.tsx";

interface ActionSheetCreateFolderProps {
    navigation: any;
    dataFolders: any;
    setDataFolders: any;
    inputRef: any;
}

const ActionSheetCreateFolder = forwardRef<ActionSheetRef, ActionSheetCreateFolderProps>(
    ({dataFolders, setDataFolders, inputRef}, ref) => {
        const [folderName, setFolderName] = useState('');
        const {updateScreen} = updateTokenRefresh();
        const actionSheetRef = useRef<ActionSheetRef>(null);
        const {setToastPosition, setSizeToast} = useToastStore();

        // @ts-ignore
        useImperativeHandle(ref, () => ({
            show: () => actionSheetRef.current?.show(),
            hide: () => actionSheetRef.current?.hide(),
        }));

        const handleCreateFolder = async () => {
            if (folderName.trim() === '') {
                showToast('error', 'Folder', 'El nombre del folder no puede estar vacío');
                setToastPosition('top');
                setSizeToast(80);
            } else {
                await routinesFunctions.postFolders("routines/folders/", {name: folderName}, () => {
                }, () => {
                }, () => {
                }).then((res: any) => {
                    let typeMessage = null;
                    let title = '';
                    let description = '';

                    if (res === undefined) return;

                    const {code, data} = res.data;

                    if (code === 201) {
                        typeMessage = 'success';
                        title = 'Folder';
                        description = 'Folder creado correctamente';
                        updateScreen();
                        setDataFolders([...dataFolders, {title: data.name, image: data.cover_image_url}]);
                    } else {
                        typeMessage = 'error';
                        title = 'Folder';
                        description = 'Error al crear el folder';
                    }

                    setFolderName('');
                    showToast(typeMessage, title, description);
                    setToastPosition('top');
                    setSizeToast(80);
                });
            }
            actionSheetRef.current?.hide();
        };

        return (
            <ActionSheet
                ref={actionSheetRef}
                gestureEnabled={true}
                indicatorStyle={{
                    width: 100,
                }}
            >
                <View style={styles.actionSheetContent}>
                    <Text style={styles.sheetTitle}>Crear un nuevo folder</Text>
                    <View style={styles.containerInput}>
                        <TextInput
                            style={styles.input}
                            value={folderName}
                            onChangeText={(text) => setFolderName(text)}
                            placeholder="Nombre del folder"
                            autoCapitalize="none"
                            placeholderTextColor="#888"
                            ref={inputRef}
                        />
                        <TouchableOpacity style={styles.createButton} onPress={handleCreateFolder}>
                            <Text style={styles.createButtonText}>Crear</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ActionSheet>
        );
    }
);

const styles = StyleSheet.create({
    actionSheetContent: {padding: 20},
    sheetTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'black'},
    containerInput: {flexDirection: 'row', alignItems: 'center'},
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        color: '#4b4b4b',
    },
    createButton: {
        backgroundColor: '#007BFF',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
    },
    createButtonText: {color: '#fff', fontWeight: 'bold'},
});

export default ActionSheetCreateFolder;
