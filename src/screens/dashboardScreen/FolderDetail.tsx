import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const FolderDetail = ({navigation, route}: any) => {
    const {title} = route.params;

    return (
        <View style={styles.container}>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: '100%',
        paddingHorizontal: 10
    },
    shadow: {
        shadowColor: '#6c6b6b',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 2,
        shadowRadius: 3,
        elevation: 5,
    },
});

export default FolderDetail;
