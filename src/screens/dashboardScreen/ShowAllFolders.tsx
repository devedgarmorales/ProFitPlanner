import React, {useEffect, useState} from "react";
import {BackHandler, FlatList, StyleSheet, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import useFolderStore from "../../store/folderStore.tsx";
import {RootStackParamList} from "../../interface/navigation/types.ts";
import SearchComponent from "../../components/SearchComponent.tsx";
import FoldersRenderList from "../../components/FoldersRenderList.tsx";

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const ShowAllFolders = () => {
    const {dataFolders} = useFolderStore();
    const navigation = useNavigation<NavigationProps>();
    const [dataFoldersFiltered, setDataFoldersFiltered] = useState(dataFolders);

    const handleSearch = (query: string) => {
        const filterData = dataFolders.filter((folder: any) => {
            return folder.title.toLowerCase().includes(query.toLowerCase());
        });
        setDataFoldersFiltered(filterData);
    };

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
            <SearchComponent onSearch={handleSearch} setDataFoldersFiltered={setDataFoldersFiltered} />

            <FlatList
                data={dataFoldersFiltered}
                keyExtractor={(_, index) => index.toString()}
                numColumns={2}
                renderItem={({item, index}) => (
                    <FoldersRenderList item={item} index={index} navigation={navigation} />
                )}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={<View style={{ height: 14 }} />}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: '100%',
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
