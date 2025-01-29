import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import {openPicker} from "@baronha/react-native-multiple-image-picker";
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import ActionSheetCameraOptions from "./ActionSheetCameraOptions.tsx";

interface ActionSheetCreateFolderProps {
    navigation: any;
    setImageData: any;
    setFormValue: any;
}

const ActionSheetCreateFolder = forwardRef<ActionSheetRef, ActionSheetCreateFolderProps>(
    ({navigation, setImageData, setFormValue}, ref) => {
        const actionSheetRef = useRef<ActionSheetRef>(null);
        const actionSheetRefCamera = useRef<ActionSheetRef>(null);
        const [imageLibrary, selectImageLibrary] = useState(null);

        async function selectImage() {
            try {
                const response = await openPicker({
                    mediaType: 'image',
                    cameraDevice: 'back',
                    compressImage: true,
                    maxFiles: 1,
                    compressImageQuality: 0.8,
                    compressImageMaxWidth: 1024,
                    compressImageMaxHeight: 1024,
                })
                console.log(response)
            } catch (e) {
                console.log(e)
            }
        }

        useImperativeHandle(ref, () => ({
            show: () => actionSheetRef.current?.show(),
            hide: () => actionSheetRef.current?.hide(),
        } as ActionSheetRef));

        const openCameraActionSheet = () => {
            actionSheetRef.current?.hide();
            actionSheetRefCamera.current?.show();
        }

        return (
            <>
                <ActionSheet
                    ref={actionSheetRef}
                    gestureEnabled={true}
                    indicatorStyle={{
                        width: 100,
                    }}
                >
                    <View style={styles.actionSheetContent}>
                        <TouchableOpacity style={styles.row} onPress={openCameraActionSheet}>
                            <Icon name="camera" size={20} color={"gray"} />
                            <Text style={styles.sheetTitle}>Tomar foto</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.row, styles.borderTop]} onPress={selectImage}>
                            <Icon name="image" size={20} color={"gray"}/>
                            <Text style={styles.sheetTitle}>Selecciona imagen de la galeria</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.row, styles.borderTop]} onPress={() => console.log("eliminar imagen")}>
                            <Icon name="trash" size={20} color={"red"}/>
                            <Text style={[styles.sheetTitle, {color: "red"}]}>Eliminar imagen de perfil</Text>
                        </TouchableOpacity>
                    </View>
                </ActionSheet>
                <ActionSheetCameraOptions navigation={navigation} ref={actionSheetRefCamera} setImageData={setImageData} setFormValue={setFormValue}  />
            </>
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
