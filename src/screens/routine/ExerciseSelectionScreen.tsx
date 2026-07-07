import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ALL_EXERCISES = [
    { id: '1', name: 'Press de Banca', muscle: 'Pecho' },
    { id: '2', name: 'Press Inclinado con Mancuernas', muscle: 'Pecho' },
    { id: '3', name: 'Aperturas en Polea', muscle: 'Pecho' },
    { id: '4', name: 'Extensión de Tríceps en Polea', muscle: 'Tríceps' },
    { id: '5', name: 'Fondos en Paralelas', muscle: 'Tríceps' },
    { id: '6', name: 'Press Francés', muscle: 'Tríceps' },
    { id: '7', name: 'Sentadilla Libre', muscle: 'Piernas' },
    { id: '8', name: 'Prensa de Piernas', muscle: 'Piernas' },
];

export default function ExerciseSelectionScreen({ navigation, route }: any) {
    const { exerciseToReplaceId } = route.params || {};
    const [search, setSearch] = useState('');

    const filteredExercises = ALL_EXERCISES.filter(ex => 
        ex.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (exercise: any) => {
        navigation.navigate('RoutineToday', {
            replacedExerciseId: exerciseToReplaceId,
            newExercise: exercise
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <Icon name="close" size={28} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Seleccionar Ejercicio</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.searchContainer}>
                <Icon name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar ejercicio..."
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <FlatList
                data={filteredExercises}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.exerciseRow} onPress={() => handleSelect(item)}>
                        <View>
                            <Text style={styles.exerciseName}>{item.name}</Text>
                            <Text style={styles.exerciseMuscle}>{item.muscle}</Text>
                        </View>
                        <Icon name="chevron-forward" size={20} color="#C7C7CC" />
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
    closeButton: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E5E5EA', margin: 16, borderRadius: 10, paddingHorizontal: 12 },
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, paddingVertical: 12, fontSize: 16 },
    exerciseRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
    exerciseName: { fontSize: 16, fontWeight: '500', color: '#1C1C1E', marginBottom: 4 },
    exerciseMuscle: { fontSize: 14, color: '#8E8E93' }
});
