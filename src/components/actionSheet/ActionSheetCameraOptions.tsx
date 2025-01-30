import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {openCamera} from "@baronha/react-native-multiple-image-picker";

interface ActionSheetCameraOptionsProps {
    navigation: any;
    setImageData: any;
    setFormValue: any;
}

const ActionSheetCameraOptions = forwardRef<ActionSheetRef, ActionSheetCameraOptionsProps>(
    ({setImageData, setFormValue}, ref) => {
        const actionSheetRefCamera = useRef<ActionSheetRef>(null);

        async function takePhoto(type: "front" | "back") {
            actionSheetRefCamera.current?.hide();
            try {
                const response = await openCamera({
                    mediaType: 'image',
                    cameraDevice: type,
                    language: "system",
                })

                const {fileName, path} = response;

                setImageData((prevState: any) => ({
                    ...prevState,
                    image_profile: {
                        ...prevState.image_profile,
                        uri: path,
                        name: fileName,
                        type: 'image/jpeg',
                    },
                }));
                setFormValue((prevState: any) => ({
                    ...prevState,
                    image_profile: {
                        ...prevState.image_profile,
                        uri: path,
                        name: fileName,
                        type: 'image/jpeg',
                    },
                }));
                console.log(response)
            } catch (e) {
                console.log(e)
            }
        }

        useImperativeHandle(ref, () => ({
            show: () => actionSheetRefCamera.current?.show(),
            hide: () => actionSheetRefCamera.current?.hide(),
        } as ActionSheetRef));

        return (
            <ActionSheet
                ref={actionSheetRefCamera}
                gestureEnabled={true}
                indicatorStyle={{
                    width: 100,
                }}
            >
                <View style={styles.actionSheetContent}>
                    <TouchableOpacity style={styles.row} onPress={() => takePhoto("front")}>
                        <MaterialIcons name="camera" size={22} color={"gray"} />
                        <Text style={styles.sheetTitle}>Camara Frontal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.row, styles.borderTop]} onPress={() => takePhoto("back")}>
                        <Icon name="camera" size={20} color={"gray"}/>
                        <Text style={styles.sheetTitle}>Camara Trasera</Text>
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

export default ActionSheetCameraOptions;
