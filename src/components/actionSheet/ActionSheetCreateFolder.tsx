import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import { showToast } from '../../service/toast';
import { useToastStore } from '../../store/toastStore';
import routinesFunctions from "../../service/routines/routinesFunctions.tsx";

interface ActionSheetCreateFolderProps {
    navigation: any;
    dataFolders: any;
    setDataFolders: any;
}

const ActionSheetCreateFolder = forwardRef<ActionSheetRef, ActionSheetCreateFolderProps>(
    ({dataFolders, setDataFolders }, ref) => {
        const [folderName, setFolderName] = useState('');
        const actionSheetRef = useRef<ActionSheetRef>(null);
        const { setToastPosition, setSizeToast } = useToastStore();

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
                await routinesFunctions.postFolders("routines/folders/", { title: folderName }, () => {}, () => {}, () => {}).then((res: any) => {});

                setDataFolders([...dataFolders, { title: folderName }]);
                setFolderName('');
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
    actionSheetContent: { padding: 20 },
    sheetTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'black' },
    containerInput: { flexDirection: 'row', alignItems: 'center' },
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
    createButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default ActionSheetCreateFolder;
