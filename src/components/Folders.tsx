import React from "react";
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import FoldersRenderList from "./FoldersRenderList.tsx";
import useFolderStore from "../store/folderStore.tsx";

const Folders = ({dataFolders, navigation}: any) => {
    const {setDataFolders} = useFolderStore();

    const handleShowMore = () => {
        setDataFolders(dataFolders);
        navigation.navigate('ShowAllFolders');
    };

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title}>Mis Folders</Text>
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
                    <Text style={styles.empty}>No tienes ningún folder creado</Text>
                )
            }

            <FlatList
                data={dataFolders}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                contentContainerStyle={styles.listContainer}
                renderItem={({item, index}) => (
                    <FoldersRenderList item={item} index={index} navigation={navigation} />
                )}
                showsHorizontalScrollIndicator={false}
            />
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 26,
        color: "black",
        paddingHorizontal: 20
    },
    empty: {
        fontSize: 22,
        textAlign: "center",
        marginTop: 20,
        color: "black"
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
        paddingHorizontal: 10,
    },
});


export default Folders;
