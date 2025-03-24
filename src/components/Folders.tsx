import React, {useEffect, useRef} from "react";
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import FoldersRenderList from "./FoldersRenderList.tsx";
import {useFolderStore} from "../store/folderStore.tsx";
import {useFlatListStore} from "../store/flatListRefStore.tsx";
import {RootStackParamList} from "../interface/navigation/dashboardNavInterface.ts";

type DashboardScreenProps = NativeStackScreenProps<RootStackParamList, "Dashboard">;

type FoldersProps = {
    navigation: DashboardScreenProps["navigation"];
};

const Folders = ({navigation}: FoldersProps) => {
    const FolderRef = useRef<FlatList>(null);
    const {dataFolders} = useFolderStore();
    const {setFlatListRef} = useFlatListStore();

    useEffect(() => {
        if (FolderRef.current) {
            setFlatListRef(FolderRef);
        }

        return () => {
            setFlatListRef({current: null});
        };
    }, []);

    const handleShowMore = () => {
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

            <FlatList
                ref={FolderRef}
                data={dataFolders}
                extraData={dataFolders}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                contentContainerStyle={styles.listContainer}
                renderItem={({item, index}) => (
                    <FoldersRenderList item={item} index={index} navigation={navigation}/>
                )}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.noDataContainer}>
                        <Text>No se encontraron folders</Text>
                    </View>
                }
            />
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
