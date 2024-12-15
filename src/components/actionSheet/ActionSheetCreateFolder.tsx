import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';

const ActionSheetCreateFolder = forwardRef<ActionSheetRef, { navigation: any, dataFolders: any, setDataFolders: any }>(
    ({navigation, dataFolders, setDataFolders}, ref) => {
        const [folderName, setFolderName] = useState("");
        const actionSheetRef = useRef<ActionSheetRef>(null);

        // @ts-ignore
        useImperativeHandle(ref, () => ({
            show: () => actionSheetRef.current?.show(),
            hide: () => actionSheetRef.current?.hide(),
        }));

        const handleCreateFolder = () => {
            actionSheetRef.current?.hide(); // Cierra el ActionSheet
            setFolderName("");
            setDataFolders([...dataFolders, {title: folderName}]);
        };

        return (
            <ActionSheet ref={actionSheetRef}>
                <View style={styles.actionSheetContent}>
                    <Text style={styles.sheetTitle}>Crear un nuevo folder</Text>
                    <View style={styles.containerInput}>
                        <TextInput
                            style={styles.input}
                            value={folderName}
                            onChangeText={(e) => setFolderName(
                                e
                            )}
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
    actionSheetContent: {padding: 20},
    sheetTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
    containerInput: {flexDirection: 'row', alignItems: 'center'},
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
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
