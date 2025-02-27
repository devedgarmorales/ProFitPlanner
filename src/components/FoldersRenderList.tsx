import React from "react";
import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";

const screenWidth = Dimensions.get('window').width;

const CardItem = ({image, title}: any) => (
    <View style={[styles.card, {
        marginLeft: 10,
    }]}>
        <Image
            source={{uri: image !== null ? image : ''}}
            style={styles.image}
            onError={() => console.error('Error loading image:', image)}
        />
        <View style={styles.overlay}>
            <Text style={styles.cardTitle}>{title}</Text>
        </View>
    </View>
);

const FoldersRenderList = ({
                               item,
                               index,
                               navigation,
                           }: any) => {
    return (
        <TouchableOpacity onPress={() => navigation.navigate('FolderDetail', {id: item.id, title: item.title})}>
            <>
                <CardItem
                    index={index}
                    image={item.image !== null ? item.image : ''}
                    title={item.title !== null ? item.title : ''}
                />
            </>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: screenWidth / 2 - 20,
        aspectRatio: 1,
        borderRadius: 24,
        overflow: 'hidden',
        marginTop: 10,
        marginRight: 10,
        position: 'relative',
        marginVertical: 10,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingVertical: 10,
    },
    cardTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
        paddingLeft: 16
    },
});

export default FoldersRenderList;
