import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import Icon from "react-native-vector-icons/FontAwesome";
import {launchCamera} from "react-native-image-picker";

interface ActionSheetCreateFolderProps {
    navigation: any;
}

const ActionSheetCreateFolder = forwardRef<ActionSheetRef, ActionSheetCreateFolderProps>(
    ({}, ref) => {
        const actionSheetRef = useRef<ActionSheetRef>(null);
        const [photo, setPhoto] = useState(null);

        const openCamera = () => {
            const options = {
                mediaType: "photo",
                saveToPhotos: true,
            };

            // @ts-ignore
            launchCamera(options, (response: any) => {
                console.log("Response: ", response);
                if (response.didCancel) {
                    console.log("El usuario canceló la cámara");
                } else if (response.errorCode) {
                    console.error("Error al abrir la cámara: ", response.errorMessage);
                } else {
                    console.log("Imagen capturada: ", response.assets[0]);
                    setPhoto(response.assets[0].uri);
                }
            }).then();
        };
        useImperativeHandle(ref, () => ({
            show: () => actionSheetRef.current?.show(),
            hide: () => actionSheetRef.current?.hide(),
        } as ActionSheetRef));

        return (
            <ActionSheet
                ref={actionSheetRef}
                gestureEnabled={true}
                indicatorStyle={{
                    width: 100,
                }}
            >
                <View style={styles.actionSheetContent}>
                    <TouchableOpacity style={styles.row} onPress={openCamera}>
                        <Icon name="camera" size={20} color={"gray"} />
                        <Text style={styles.sheetTitle}>Tomar foto</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.row, styles.borderTop]} onPress={() => console.log("seleccionar imagen")}>
                       <Icon name="image" size={20} color={"gray"}/>
                        <Text style={styles.sheetTitle}>Selecciona imagen de la galeria</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.row, styles.borderTop]} onPress={() => console.log("eliminar imagen")}>
                        <Icon name="trash" size={20} color={"red"}/>
                        <Text style={[styles.sheetTitle, {color: "red"}]}>Eliminar imagen de perfil</Text>
                    </TouchableOpacity>
                </View>
            </ActionSheet>
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

export default ActionSheetCreateFolder;
