import React from 'react';
import { View, StyleSheet } from 'react-native';

const Separator = () => {
    return <View style={styles.separator} />;
};

const styles = StyleSheet.create({
    separator: {
        height: 2,
        backgroundColor: '#d3d3d3',
        marginTop: 10,
    },
});

export default Separator;
