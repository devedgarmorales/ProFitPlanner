import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const WorkoutCard = ({
  title,
  description,
  onPress,
}: {
  title: string;
  description: string;
  onPress: () => void;
}) => {
  return (
    <View style={styles.workoutCard}>
      <Text style={styles.workoutTitle}>{title}</Text>
      <Text style={styles.workoutDescription}>{description}</Text>
      <TouchableOpacity style={styles.detailButton} onPress={onPress}>
        <Text style={styles.detailButtonText}>Ver detalle</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  workoutCard: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: "#000", 
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4, 
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  workoutDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    lineHeight: 20,
  },
  detailButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  detailButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default WorkoutCard;
