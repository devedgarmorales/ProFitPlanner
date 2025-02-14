import React from "react";
import {Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import DropShadow from "react-native-drop-shadow";
import useFolderStore from "../store/folderStore.tsx";
import Icon from 'react-native-vector-icons/AntDesign';

const screenWidth = Dimensions.get('window').width;
// @ts-ignore
const CardItem = ({index, image, title}) => (
    <View style={[styles.card, {
        marginLeft: index > 0 ? 10 : 0,}]}>
        <Image
            source={{uri: image}}
            style={styles.image}
            onError={() => console.error('Error loading image:', image)}
        />
        <View style={styles.overlay}>
            <Text style={styles.cardTitle}>{title}</Text>
        </View>
    </View>
);

const Folders = ({dataFolders, navigation}: any) => {
    const {setDataFolders} = useFolderStore();

    const handleShowMore = () => {
        setDataFolders(dataFolders);
        navigation.navigate('FolderDetails');
    };

    return (
        <>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
                <Text style={{
                    fontSize: 26,
                    color: "black",
                    paddingHorizontal: 20
                }}>Mis Folders</Text>
                {(dataFolders !== undefined && dataFolders.length > 3) && (
                    <TouchableOpacity onPress={handleShowMore}>
                        <Text style={styles.buttonText}>
                            <Icon name="right" size={20} color={"gray"}/>
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {
                (dataFolders !== undefined && dataFolders.length === 0) && (
                    <Text style={{
                        fontSize: 22,
                        textAlign: "center",
                        marginTop: 20,
                        color: "black"
                    }}>No tienes ningún folder creado</Text>
                )
            }

            <FlatList
                data={dataFolders}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                contentContainerStyle={styles.listContainer}
                renderItem={({item, index}) => (
                    <DropShadow
                        style={{
                            shadowColor: "#6c6b6b",
                            shadowOffset: {
                                width: 5,
                                height: 5,
                            },
                            shadowOpacity: 2,
                            shadowRadius: 3,
                            elevation: 5,
                        }}
                    >
                        <CardItem
                            index={index}
                            image={item.image !== null ? item.image : ''}
                            title={item.title !== null ? item.title : ''}
                        />
                    </DropShadow>
                )}
                showsHorizontalScrollIndicator={false}
            />
        </>
    )
};

const styles = StyleSheet.create({
    card: {
        width: screenWidth * 0.5,
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
        paddingLeft: 20
    },
    shadowProp: {
        shadowColor: 'rgba(0, 0, 0, 0.75)',
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowOpacity: 1,
        shadowRadius: 5,
    },
    buttonText: {
        color: '#494949',
        fontSize: 16,
        fontWeight: 'bold',
        paddingRight: 10,
        paddingTop: 10
    },
    listContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
});


export default Folders;
