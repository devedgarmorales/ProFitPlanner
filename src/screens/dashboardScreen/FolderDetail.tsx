import useFolderStore from "../../store/folderStore.tsx";
import {Dimensions, FlatList, Image, StyleSheet, Text, View} from "react-native";
import DropShadow from "react-native-drop-shadow";

const screenWidth = Dimensions.get('window').width;
// @ts-ignore
const CardItem = ({image, title}) => (
    <View style={styles.card}>
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

const FolderDetail = () => {
    const {dataFolders} = useFolderStore();

    return (
        <View style={styles.container}>
            <Text style={{
                fontSize: 26,
                color: "black",
                marginHorizontal: 20,
                marginTop: 20,
            }}>Mis Folders</Text>
            <FlatList
                data={dataFolders}
                keyExtractor={(_, index) => index.toString()}
                numColumns={2}
                renderItem={({ item }) => (
                    <DropShadow
                        style={styles.shadow}
                    >
                        <CardItem
                            image={item.image !== null ? item.image : ''}
                            title={item.title !== null ? item.title : ''}
                        />
                    </DropShadow>
                )}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
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
        aspectRatio: 1,
        borderRadius: 24,
        overflow: 'hidden',
        marginTop: 6,
        position: 'relative',
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
});

export default FolderDetail;
