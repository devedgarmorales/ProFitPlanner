import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ActiveWorkoutScreen({ route, navigation }: any) {
    const { routine } = route.params || {};
    const exercises = routine?.exercises || [];

    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(true);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleFinish = () => {
        setIsTimerRunning(false);
        // Here we would save the workout to the backend
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="chevron-down-outline" size={28} color="#007AFF" />
                </TouchableOpacity>
                <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>{formatTime(timer)}</Text>
                </View>
                <TouchableOpacity onPress={handleFinish} style={styles.finishButton}>
                    <Text style={styles.finishButtonText}>Finalizar</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner}>
                <Text style={styles.workoutTitle}>{routine?.title || 'Entrenamiento'}</Text>

                {exercises.map((exercise: any, index: number) => (
                    <View key={exercise.id} style={styles.exerciseCard}>
                        <Text style={styles.exerciseName}>{index + 1}. {exercise.name}</Text>
                        
                        <View style={styles.tableHeader}>
                            <Text style={[styles.headerCell, { flex: 0.5 }]}>SET</Text>
                            <Text style={[styles.headerCell, { flex: 1 }]}>ANTERIOR</Text>
                            <Text style={[styles.headerCell, { flex: 1 }]}>KG</Text>
                            <Text style={[styles.headerCell, { flex: 1 }]}>REPS</Text>
                            <Text style={[styles.headerCell, { flex: 0.5 }]}></Text>
                        </View>

                        {Array.from({ length: exercise.sets }).map((_, setIndex) => (
                            <ExerciseSetRow 
                                key={setIndex} 
                                setIndex={setIndex} 
                                targetReps={exercise.reps} 
                            />
                        ))}
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const ExerciseSetRow = ({ setIndex, targetReps }: { setIndex: number, targetReps: string }) => {
    const [isCompleted, setIsCompleted] = useState(false);
    
    return (
        <View style={[styles.tableRow, isCompleted && styles.tableRowCompleted]}>
            <Text style={[styles.cell, { flex: 0.5, fontWeight: 'bold' }]}>{setIndex + 1}</Text>
            <Text style={[styles.cell, { flex: 1, color: '#8E8E93' }]}>-</Text>
            <View style={[styles.inputCell, { flex: 1 }]}>
                <TextInput 
                    style={styles.input} 
                    placeholder="0" 
                    keyboardType="numeric"
                />
            </View>
            <View style={[styles.inputCell, { flex: 1 }]}>
                <TextInput 
                    style={styles.input} 
                    placeholder={targetReps.split('-')[0]} // Just a placeholder hint
                    keyboardType="numeric"
                />
            </View>
            <TouchableOpacity 
                style={[styles.checkCell, { flex: 0.5 }]} 
                onPress={() => setIsCompleted(!isCompleted)}
            >
                <View style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}>
                    {isCompleted && <Icon name="checkmark" size={16} color="#FFF" />}
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    backButton: {
        padding: 4,
    },
    timerContainer: {
        alignItems: 'center',
    },
    timerText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontVariant: ['tabular-nums'],
    },
    finishButton: {
        backgroundColor: '#34C759',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    finishButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    scrollContent: {
        flex: 1,
    },
    scrollInner: {
        padding: 16,
        paddingBottom: 40,
    },
    workoutTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1C1C1E',
        marginBottom: 20,
    },
    exerciseCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    exerciseName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 16,
    },
    tableHeader: {
        flexDirection: 'row',
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    headerCell: {
        fontSize: 12,
        fontWeight: '600',
        color: '#8E8E93',
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 4,
        borderRadius: 8,
    },
    tableRowCompleted: {
        backgroundColor: '#E8F5E9',
    },
    cell: {
        textAlign: 'center',
        fontSize: 15,
        color: '#1C1C1E',
    },
    inputCell: {
        paddingHorizontal: 4,
    },
    input: {
        backgroundColor: '#F2F2F7',
        borderRadius: 6,
        padding: 8,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '500',
    },
    checkCell: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#C7C7CC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxCompleted: {
        backgroundColor: '#34C759',
        borderColor: '#34C759',
    }
});
