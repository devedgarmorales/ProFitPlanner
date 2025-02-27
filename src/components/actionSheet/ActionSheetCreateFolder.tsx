import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Keyboard,
} from 'react-native';
import {ActionSheetRef} from "react-native-actions-sheet";
import ActionSheetBase from "./ActionSheetBase.tsx";
import {showToast} from '../../service/toast';
import {useToastStore} from '../../store/toastStore';
import updateTokenRefresh from "../../store/updateTokenRefresh.tsx";
import apiFunctions from "../../service/folders/foldersFunctions.tsx";
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ActionSheetCreateFolderProps {
    navigation: any;
    inputRef: React.RefObject<TextInput>;
}

const ActionSheetCreateFolder = forwardRef<ActionSheetRef, ActionSheetCreateFolderProps>(
    ({navigation, inputRef}, ref) => {
        const [formValues, setFormValues] = useState({
            folderName: "",
        });
        const {updateScreen} = updateTokenRefresh();
        const actionSheetRef = useRef<ActionSheetRef>(null);
        const {setToastPosition, setSizeToast} = useToastStore();

        // @ts-ignore
        useImperativeHandle(ref, () => ({
            show: showActionSheet,
            hide: hideActionSheet
        }));

        const handleCreateFolder = async () => {
            Keyboard.dismiss();

            if (formValues.folderName.trim() === '') {
                showToast('error', 'Folder', 'El nombre del folder no puede estar vacío');
                setToastPosition('top');
                setSizeToast(80);
                inputRef.current?.blur();
                return;
            }

            try {
                const res = await apiFunctions.postFolders("folders/", {name: formValues.folderName}, () => {
                }, () => {
                }, () => {
                });

                if (!res || !res.data) return;

                const {code, data} = res.data;

                if (code === 201) {
                    setToastPosition('bottom');
                    setSizeToast(80);

                    showToast('success', 'Folder', 'Folder creado correctamente');
                    updateScreen();

                    const object = {
                        id: data.id,
                        title: data.name,
                        ...(data.cover_image_url && {image: data.cover_image_url})
                    };

                    navigation.navigate('FolderDetail', object);
                } else {
                    showToast('error', 'Folder', 'Error al crear el folder');
                }

                setFormValues({
                    folderName: "",
                });
            } catch (error) {
                showToast('error', 'Folder', 'Error en la conexión');
            } finally {
                actionSheetRef.current?.hide();
            }
        };

        const handleInputChange = (field: string, value: any) => {
            setFormValues({
                ...formValues,
                [field]: value,
            })
        };

        const showActionSheet = () => {
            if (actionSheetRef.current) {
                actionSheetRef.current?.show();
                setTimeout(() => {
                    inputRef?.current?.focus();
                }, 300);
            }
        };

        const hideActionSheet = () => {
            if (actionSheetRef.current) {
                actionSheetRef.current?.hide();
                inputRef.current?.blur();
            }
        };

        return (
            <View style={styles.containerCenter}>
                <ActionSheetBase showBackgroundColor={false} actionSheetRef={actionSheetRef} gesture={false}
                                 closeable={true}>
                    <View style={styles.modalContainer}>
                        <View style={styles.actionSheet}>
                            <View style={styles.inputContainer}>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        value={formValues.folderName}
                                        onChangeText={(text) => handleInputChange("folderName", text)}
                                        placeholder="Nombre del folder"
                                        keyboardType={"default"}
                                        placeholderTextColor={"gray"}
                                        ref={inputRef}
                                    />
                                </View>
                                <TouchableOpacity style={styles.createButton} onPress={handleCreateFolder}>
                                    <Icon name="send" size={28} color={"black"}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ActionSheetBase>
            </View>
        );
    }
);

const styles = StyleSheet.create({
    containerCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1
    },
    modalContainer: {
        justifyContent: "flex-end",
    },
    actionSheet: {
        width: "100%",
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 30,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    inputWrapper: {
        flex: 1,
    },
    input: {
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        fontSize: 14,
        color: "black",
    },
    createButton: {
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderRadius: 5,
        alignItems: "center",
        marginLeft: 4,
    },
    createButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});


export default ActionSheetCreateFolder;
