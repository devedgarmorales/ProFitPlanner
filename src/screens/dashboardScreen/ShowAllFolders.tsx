import React, {useEffect, useState} from "react";
import {BackHandler, FlatList, RefreshControl, StyleSheet, Text, View} from "react-native";
import {useFolderStore} from "../../store/folderStore.tsx";
import SearchComponent from "../../components/SearchComponent.tsx";
import FoldersRenderList from "../../components/FoldersRenderList.tsx";

const ShowAllFolders = ({navigation}: any) => {
    const {dataFolders} = useFolderStore();
    const [refreshing, setRefreshing] = useState(false);
    const [dataFoldersFiltered, setDataFoldersFiltered] = useState(dataFolders);

    const handleSearch = (query: string) => {
        const filterData = dataFolders.filter((folder: any) => {
            return folder.title.toLowerCase().includes(query.toLowerCase());
        });
        setDataFoldersFiltered(filterData);
    };

    const refreshingFunction = (state: boolean) => {
        setRefreshing(state);
    }

    const onRefreshFunction = () => {
        refreshingFunction(true);
    }

    useEffect(() => {
        refreshingFunction(false);
        setDataFoldersFiltered(dataFolders);
    }, [dataFolders, refreshing]);

    useEffect(() => {
        const handler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                navigation.goBack();
                return true;
            }
        );

        return () => handler.remove();
    }, []);

    return (
        <View style={styles.container}>
            <SearchComponent onSearch={handleSearch} setDataFoldersFiltered={setDataFoldersFiltered}/>

            {
                dataFoldersFiltered.length === 0 && (
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 18,
                            color: '#000000',}}>No se encontraron folders</Text>
                    </View>
                )
            }

            <FlatList
                data={dataFoldersFiltered}
                keyExtractor={(_, index) => index.toString()}
                numColumns={2}
                renderItem={({item, index}) => (
                    <FoldersRenderList item={item} index={index} navigation={navigation}/>
                )}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={<View style={{height: 14}}/>}
                ListEmptyComponent={
                    <View style={styles.noDataContainer}>
                        <Text>No se encontraron folders</Text>
                    </View>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefreshFunction}
                    />
                }
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: '100%',
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        margin: 8,
        flex: 1,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    card: {
        width: 160,
        height: 160,
        borderRadius: 10,
        overflow: 'hidden',
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
        paddingLeft: 10
    },
});

export default ShowAllFolders;
