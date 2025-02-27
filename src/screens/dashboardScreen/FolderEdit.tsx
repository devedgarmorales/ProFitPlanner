import React, {useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import apiFunctions from "../../service/folders/foldersFunctions.tsx";
import CustomInput from "../../components/CustomInput.tsx";
import {showToast} from "../../service/toast.tsx";
import {useToastStore} from "../../store/toastStore.tsx";

const FolderEdit = ({ navigation, route }: any) => {
    const { id, title } = route.params;
    const {setSizeToast, setToastPosition} = useToastStore();
    const [formValues, setFormValues] = React.useState({
        name: title,
    });

    const handleInputChange = (inputName: string, inputValue: string) => {
        setFormValues({
            ...formValues,
            [inputName]: inputValue,
        });
    };

    const isNotEmpty = (value: string) => {
        return value!== null && value!== undefined && value!== "";
    }

    async function updateFolder(){
        console.log("updateFolder", formValues);
        setSizeToast(120);
        setToastPosition('bottom');
        await apiFunctions.putFolders(`folders/${id}/`, formValues, () => {}, () => {}, () => {}).then((res: any) => {
            console.log("updateFolder", res);
            showToast('success', 'Folder', 'Actualizado correctamente');
            navigation.goBack();
        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.principalContainer}>
                <View style={[styles.containerInput, { marginTop: 10 }]}>
                    <CustomInput
                        label="Título del folder"
                        value={formValues.name}
                        name="name"
                        onValueChange={handleInputChange}
                        keyboardType="default"
                        autoCapitalize="none"
                        color="#000000"
                        showOnFocus={isNotEmpty(formValues.name)}
                    />
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={updateFolder}>
                    <Text style={styles.saveButtonText}>Guardar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 30,
    },
    principalContainer: {
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        borderRadius: 10,
        marginHorizontal: 20,
    },
    containerInput: {
        borderRadius: 8,
        backgroundColor: "#fff",
        marginTop: 15
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 20,
        position: 'absolute',
        bottom: 20,
    },
    cancelButton: {
        backgroundColor: '#ff0000',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
    },
    cancelButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    saveButton: {
        backgroundColor: '#007BFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
    },
    saveButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default FolderEdit;
