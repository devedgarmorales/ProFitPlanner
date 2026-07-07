import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Mock Data for the routine
const INITIAL_ROUTINE = {
    title: 'Día 1: Pecho y Tríceps',
    duration: '45-60 min',
    exercises: [
        { id: '1', name: 'Press de Banca', sets: 4, reps: '8-10', rest: '90s' },
        { id: '2', name: 'Press Inclinado con Mancuernas', sets: 3, reps: '10-12', rest: '60s' },
        { id: '3', name: 'Aperturas en Polea', sets: 3, reps: '12-15', rest: '60s' },
        { id: '4', name: 'Extensión de Tríceps en Polea', sets: 4, reps: '12', rest: '60s' },
    ]
};

export default function RoutineTodayScreen({ navigation, route }: any) {
    const [routine, setRoutine] = useState(INITIAL_ROUTINE);

    React.useEffect(() => {
        if (route.params?.replacedExerciseId && route.params?.newExercise) {
            const { replacedExerciseId, newExercise } = route.params;
            
            setRoutine(prev => {
                const newExercises = prev.exercises.map(ex => {
                    if (ex.id === replacedExerciseId) {
                        return {
                            ...ex,
                            name: newExercise.name,
                            // we would also update id, sets, reps based on defaults if this were a real backend integration
                        };
                    }
                    return ex;
                });
                return { ...prev, exercises: newExercises };
            });

            // Clear params so it doesn't run again on re-focus
            navigation.setParams({ replacedExerciseId: undefined, newExercise: undefined });
        }
    }, [route.params?.replacedExerciseId, route.params?.newExercise, navigation]);

    const deleteExercise = (exerciseId: string) => {
        setRoutine(prev => ({
            ...prev,
            exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
        }));
    };

    const replaceExercise = (exerciseId: string) => {
        // Will navigate to selection screen
        navigation.navigate('ExerciseSelection', { 
            routineId: 'mock-routine', 
            exerciseToReplaceId: exerciseId 
        });
    };

    const viewHistory = (exerciseId: string, exerciseName: string) => {
        navigation.navigate('ExerciseHistory', { 
            exerciseId,
            exerciseName
        });
    };

    const renderExercise = ({ item }: { item: any }) => (
        <View style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{item.name}</Text>
                <TouchableOpacity onPress={() => {
                        Alert.alert("Opciones de Ejercicio", `¿Qué deseas hacer con ${item.name}?`, [
                            { text: "Reemplazar Ejercicio", onPress: () => replaceExercise(item.id) },
                            { text: "Ver Historial", onPress: () => viewHistory(item.id, item.name) },
                            { text: "Eliminar", style: "destructive", onPress: () => {
                                Alert.alert("Confirmar", `¿Estás seguro de que deseas eliminar ${item.name} de tu rutina de hoy?`, [
                                    { text: "Cancelar", style: "cancel" },
                                    { text: "Sí, eliminar", style: "destructive", onPress: () => deleteExercise(item.id) }
                                ]);
                            }},
                            { text: "Cancelar", style: "cancel" }
                        ]);
                }}>
                    <Icon name="ellipsis-vertical" size={24} color="#757575" style={{ padding: 4 }} />
                </TouchableOpacity>
            </View>
            <View style={styles.exerciseDetails}>
                <View style={styles.detailItem}>
                    <Icon name="layers-outline" size={16} color="#007AFF" />
                    <Text style={styles.detailText}>{item.sets} series</Text>
                </View>
                <View style={styles.detailItem}>
                    <Icon name="repeat-outline" size={16} color="#007AFF" />
                    <Text style={styles.detailText}>{item.reps} reps</Text>
                </View>
                <View style={styles.detailItem}>
                    <Icon name="time-outline" size={16} color="#007AFF" />
                    <Text style={styles.detailText}>{item.rest}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>¡Hola!</Text>
                <Text style={styles.title}>Rutina de Hoy</Text>
                <Text style={styles.subtitle}>{routine.title}</Text>
                
                <View style={styles.durationBadge}>
                    <Icon name="time-outline" size={16} color="#555" />
                    <Text style={styles.durationText}>{routine.duration}</Text>
                </View>
            </View>

            <FlatList
                data={routine.exercises}
                keyExtractor={(item) => item.id}
                renderItem={renderExercise}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20, color: '#888'}}>No hay ejercicios en esta rutina.</Text>}
            />

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={[styles.startButton, routine.exercises.length === 0 && { backgroundColor: '#A0CFFF' }]}
                    disabled={routine.exercises.length === 0}
                    onPress={() => navigation.navigate('ActiveWorkout', { routine: routine })}
                >
                    <Text style={styles.startButtonText}>INICIAR ENTRENAMIENTO</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    header: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
        marginBottom: 10,
    },
    greeting: {
        fontSize: 16,
        color: '#8E8E93',
        marginBottom: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1C1C1E',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#007AFF',
        fontWeight: '600',
        marginBottom: 12,
    },
    durationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E5E5EA',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    durationText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#555',
        fontWeight: '500',
    },
    listContainer: {
        padding: 16,
        paddingBottom: 100, // Make room for floating button
    },
    exerciseCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    exerciseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    exerciseName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1C1C1E',
    },
    exerciseDetails: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        marginLeft: 6,
        fontSize: 14,
        color: '#3A3A3C',
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    startButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    startButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    }
});
