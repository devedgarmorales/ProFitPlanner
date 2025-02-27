import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import {openCamera, openPicker} from "@baronha/react-native-multiple-image-picker";
import {ActionSheetRef} from 'react-native-actions-sheet';
import ActionSheetBase from "./ActionSheetBase.tsx";
import userFunctions from "../../service/user/userFunctions.tsx";
import useLoaderStore from "../../store/loaderStore.tsx";
import {showToast} from "../../service/toast.tsx";
import {useToastStore} from "../../store/toastStore.tsx";
import {MMKV} from "react-native-mmkv";

interface ActionSheetCreateFolderProps {
    setImageData: any;
    setFormValue: any;
}

const ActionSheetCreateFolder = forwardRef<ActionSheetRef, ActionSheetCreateFolderProps>(
    ({setImageData, setFormValue}, ref) => {
        const actionSheetRef = useRef<ActionSheetRef>(null);
        const {showLoader, hideLoader} = useLoaderStore();
        const {setSizeToast, setToastPosition} = useToastStore();
        const storage = new MMKV();

        async function selectImage() {
            try {
                const response = await openPicker({
                    mediaType: 'image',
                    cameraDevice: 'back',
                    compressImage: true,
                    maxSelect: 1,
                    language: "system",
                })

                const {fileName, path} = response[0];

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

                actionSheetRef.current?.hide();
            } catch (e) {
                console.error(e);
            }
        }

        async function openCameraActionSheet() {
            if (actionSheetRef.current) {
                actionSheetRef.current?.hide();

                setTimeout(async () => {
                    try {
                        const response = await openCamera({
                            mediaType: 'image',
                            cameraDevice: 'back',
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
                    } catch (e) {
                        console.log(e)
                    }
                }, 300);
            }
        }

        async function deleteImageProfile() {
            showLoader();
            setSizeToast(120);
            setToastPosition('top');
            const userData = JSON.parse(storage.getString("user_info") || "{}");

            await userFunctions.deleteImageProfile("auth/user/image-profile/", hideLoader, () => {
            }, () => {
            }, false).then((res: any) => {
                const {code} = res?.data || {};

                if (code === 200) {
                    showToast("success", "Imagen eliminada", "Tu imagen de perfil ha sido eliminada exitosamente.");
                    setImageData((prevState: any) => ({
                        ...prevState,
                        image_profile: {
                            uri: "",
                            name: "",
                            type: "",
                        },
                    }));
                    setFormValue((prevState: any) => ({
                        ...prevState,
                        image_profile: {
                            uri: "",
                            name: "",
                            type: "",
                        },
                    }));
                    actionSheetRef.current?.hide();

                    userData.image_profile = "";
                    storage.set("user_info", JSON.stringify(userData));
                }
            }).catch(() => {
                showToast("error", "Error", "Ha ocurrido un error al eliminar la imagen de perfil.");
            }).finally(() => {
                hideLoader();
            });
            actionSheetRef.current?.hide();
        }

        useImperativeHandle(ref, () => ({
            show: () => actionSheetRef.current?.show(),
            hide: () => actionSheetRef.current?.hide(),
        } as ActionSheetRef));

        return (
            <ActionSheetBase
                showBackgroundColor={false}
                actionSheetRef={actionSheetRef}
                closeable={true}
                gesture={false}
            >
                <View style={styles.actionSheetContent}>
                    <TouchableOpacity style={styles.row} onPress={openCameraActionSheet}>
                        <Icon name="camera" size={20} color={"gray"}/>
                        <Text style={styles.sheetTitle}>Tomar foto</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.row, styles.borderTop]} onPress={selectImage}>
                        <Icon name="image" size={20} color={"gray"}/>
                        <Text style={styles.sheetTitle}>Selecciona imagen de la galeria</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.row, styles.borderTop]}
                                      onPress={deleteImageProfile}>
                        <Icon name="trash" size={20} color={"red"}/>
                        <Text style={[styles.sheetTitle, {color: "red"}]}>Eliminar imagen de perfil</Text>
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

export default ActionSheetCreateFolder;
