import React, {useState} from "react";
import {View, TextInput, StyleSheet, TouchableOpacity, Dimensions} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import useFolderStore from "../store/folderStore.tsx";

const screenWidth = Dimensions.get('window').width;

const SearchBar = ({onSearch, setDataFoldersFiltered}: any) => {
    const {dataFolders} = useFolderStore();
    const [searchText, setSearchText] = useState("");

    const handleSearch = () => {
        if (onSearch) {
            onSearch(searchText);
        }
    };

    const clearFunction = () => {
        setSearchText("");
        setDataFoldersFiltered(dataFolders);
    };

    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <View style={styles.searchContainer}>
                <Icon name="search" size={20} color="gray" style={styles.searchIcon}/>
                <TextInput
                    style={styles.input}
                    placeholder="Buscar..."
                    placeholderTextColor="gray"
                    value={searchText}
                    onChangeText={setSearchText}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
                {searchText.length > 0 && (
                    <TouchableOpacity onPress={clearFunction} style={styles.clearButton}>
                        <Icon name="x" size={18} color="gray"/>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f1f1f1",
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 40,
        marginTop: 14,
        marginBottom: 10,
        width: screenWidth * 0.9,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "black",
    },
    clearButton: {
        marginLeft: 8,
    },
});

export default SearchBar;
