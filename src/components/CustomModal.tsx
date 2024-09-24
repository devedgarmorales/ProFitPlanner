import React from 'react';
import {Modal, Button, StyleSheet} from 'react-native';

interface CustomModalProps {
    visible: boolean;
    onClose?: () => void;
    children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({visible, onClose, children}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
        >
            <>
                {children}

                {
                    onClose && (
                        <Button
                            title="Cerrar"
                            onPress={onClose}
                        />
                    )
                }
            </>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
    },
});

export default CustomModal;
