import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import useLoaderStore from '../store/loaderStore.tsx';
import {Portal, Modal} from "react-native-paper";

const Loader = () => {
    const isLoading = useLoaderStore((state) => state.isLoading);

    return (
        <Portal
            key={isLoading ? "loading" : "not-loading"}
        >
            <Modal
                visible={isLoading}
                dismissable={false}
                contentContainerStyle={styles.modalContainer}

            >
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        zIndex: 9999,
    },
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
