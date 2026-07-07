import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MOCK_HISTORY = [
    { id: '1', date: 'Hace 2 días', weight: '80 kg', reps: '10, 10, 8, 8' },
    { id: '2', date: 'Hace 1 semana', weight: '75 kg', reps: '12, 10, 10, 8' },
    { id: '3', date: 'Hace 2 semanas', weight: '70 kg', reps: '12, 12, 10, 10' },
];

export default function ExerciseHistoryScreen({ navigation, route }: any) {
    const { exerciseName } = route.params || {};

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="chevron-back" size={28} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Historial</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.titleContainer}>
                <Text style={styles.exerciseName}>{exerciseName || 'Ejercicio'}</Text>
                <Text style={styles.subtitle}>Tu progreso reciente</Text>
            </View>

            <FlatList
                data={MOCK_HISTORY}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <View style={styles.historyCard}>
                        <View style={styles.historyHeader}>
                            <Icon name="calendar-outline" size={16} color="#8E8E93" />
                            <Text style={styles.dateText}>{item.date}</Text>
                        </View>
                        <View style={styles.statsRow}>
                            <View style={styles.statBox}>
                                <Text style={styles.statLabel}>Peso Máx</Text>
                                <Text style={styles.statValue}>{item.weight}</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.statBox}>
                                <Text style={styles.statLabel}>Repeticiones</Text>
                                <Text style={styles.statValue}>{item.reps}</Text>
                            </View>
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
    backButton: { padding: 4, marginLeft: -8 },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    titleContainer: { padding: 20, backgroundColor: '#FFFFFF', marginBottom: 12 },
    exerciseName: { fontSize: 24, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 4 },
    subtitle: { fontSize: 16, color: '#8E8E93' },
    listContainer: { padding: 16 },
    historyCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
    historyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    dateText: { marginLeft: 8, fontSize: 14, color: '#8E8E93', fontWeight: '500' },
    statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    statBox: { flex: 1, alignItems: 'center' },
    statLabel: { fontSize: 12, color: '#8E8E93', marginBottom: 4, textTransform: 'uppercase', fontWeight: '600' },
    statValue: { fontSize: 18, fontWeight: 'bold', color: '#1C1C1E' },
    divider: { width: 1, height: 40, backgroundColor: '#E5E5EA', marginHorizontal: 16 }
});
