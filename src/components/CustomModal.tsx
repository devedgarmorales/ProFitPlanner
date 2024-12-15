import React from "react";
import {Modal, Button, StyleSheet} from "react-native";
import {SafeAreaView, SafeAreaProvider} from "react-native-safe-area-context";

interface CustomModalProps {
    visible?: boolean;
    onClose?: () => void;
    children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
                                                     visible,
                                                     onClose,
                                                     children,
                                                 }) => {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.centeredView}>
                <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
                    {children}
                    {/*{onClose && <Button title="Cerrar" onPress={onClose}/>}*/}
                </Modal>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default CustomModal;
