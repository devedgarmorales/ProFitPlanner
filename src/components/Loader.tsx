// Loader.tsx
import React from 'react';
import { View, ActivityIndicator, Modal, StyleSheet } from 'react-native';
import useLoaderStore from '../store/loaderStore.tsx';

const Loader = () => {
    const isLoading = useLoaderStore((state) => state.isLoading);

    return (
        <Modal
            transparent
            animationType="fade"
            visible={isLoading}
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    loaderContainer: {
        padding: 20,
        backgroundColor: '#333',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Loader;
