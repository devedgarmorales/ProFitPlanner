import React, {useEffect} from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/types";
import {MMKV} from 'react-native-mmkv';

type WelcomeScreenProps = NativeStackScreenProps<RootStackParamList, "Welcome">;

const WelcomeScreen = ({ navigation }: WelcomeScreenProps) => {
  const storage = new MMKV();

  useEffect(() => {
    const token = storage.getString('refresh_token');

    if (!token) return navigation.navigate('Welcome');
    navigation.navigate('DashboardTabs')
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/img/backgroundVertical.png")}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title}>Bienvenido a GymTracker</Text>
        <Text style={styles.subtitle}>¡Transforma tu cuerpo y tu vida!</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={[
              styles.button,
              {
                backgroundColor: "#2c3e50",
              },
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: "white",
                },
              ]}
            >
              Iniciar sesión
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            style={[
              styles.button,
              {
                backgroundColor: "#fff",
              },
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: "#2c3e50",
                },
              ]}
            >
              Registrarme
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  image: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: "#666",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});

export default WelcomeScreen;
