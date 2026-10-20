import React from 'react';
import { FlatList, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { ClientScreenProps } from '../../navigation/clientTypes';
import { useRoutineSelection } from '../../hooks/client/useRoutineSelection';
import {
  ClientLayout,
  ClientStatus,
  clientStyles as styles,
} from '../../components/ClientLayout';
export function DayScreen({ route, navigation }: ClientScreenProps<'Day'>) {
  const { day, error, start } = useRoutineSelection(
    route.params.routineId,
    route.params.dayId
  );
  return (
    <ClientLayout>
      <FlatList
        contentContainerStyle={styles.content}
        data={day?.exercises || []}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <Text variant="headlineMedium">
              {day?.name || 'Día no disponible'}
            </Text>
            <Text>{day?.description}</Text>
            <ClientStatus />
            {!!error && <Text accessibilityRole="alert">{error}</Text>}
          </View>
        }
        ListEmptyComponent={<Text>Tu coach todavía no agregó ejercicios.</Text>}
        ListFooterComponent={
          <Button
            mode="contained"
            disabled={
              !day?.exercises.some((exercise) => exercise.sets.length > 0)
            }
            onPress={() => {
              const sessionId = start();
              if (sessionId) {
                navigation.navigate('Workout', { sessionId });
              }
            }}
          >
            Iniciar o continuar entrenamiento
          </Button>
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Text variant="titleLarge">{item.exercise.name}</Text>
            <Text>
              {item.sets.length} series · Descanso:{' '}
              {item.rest_between_sets_seconds} segundos
            </Text>
            <Text>{item.client_notes}</Text>
            {item.sets.map((set) => (
              <Text key={set.id}>
                Serie {set.set_number}: {set.reps} repeticiones ·{' '}
                {set.target_weight || '—'} {set.weight_unit}
              </Text>
            ))}
          </Card>
        )}
      />
    </ClientLayout>
  );
}
