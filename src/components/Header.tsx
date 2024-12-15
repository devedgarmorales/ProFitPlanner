import React from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";

const Header = ({navigation}: any) => {
  return (
      <View style={styles.header}>
          <View>
              <Text style={styles.text}>Buenas tardes,</Text>
              <Text style={styles.userText}>Usuario de GymTracker</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Perfil")}>
              <Image
                  source={{ uri: "https://picsum.photos/200/300" }}
                  style={styles.profileImage}
              />
          </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 20,
        justifyContent: "space-between",
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        textTransform: "uppercase",
    },
    userText: {
        fontSize: 24,
        color: "#333",
    },
});

export default Header;
