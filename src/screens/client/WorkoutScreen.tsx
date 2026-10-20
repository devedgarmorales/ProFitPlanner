import React from 'react';
import { SectionList, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { ClientScreenProps } from '../../navigation/clientTypes';
import { useWorkout } from '../../hooks/client/useWorkout';
import {
  ClientLayout,
  ClientStatus,
  clientStyles as styles,
} from '../../components/ClientLayout';
import { WorkoutSetRow } from '../../components/WorkoutSetRow';
export function WorkoutScreen({
  route,
  navigation,
}: ClientScreenProps<'Workout'>) {
  const workout = useWorkout(route.params.sessionId);
  const session = workout.session;
  if (!session) {
    return (
      <ClientLayout>
        <Text>El entrenamiento no está disponible en este dispositivo.</Text>
      </ClientLayout>
    );
  }
  const completed = session.status === 'completed';
  return (
    <ClientLayout>
      <SectionList
        contentContainerStyle={styles.content}
        sections={session.day.exercises.map((exercise) => ({
          ...exercise,
          data: exercise.sets,
        }))}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <Text variant="headlineMedium">{session.day_name}</Text>
            <Text>
              {completed
                ? 'Entrenamiento finalizado'
                : 'Entrenamiento en curso'}{' '}
              · {workout.elapsed} min
            </Text>
            <Text>
              {session.sets.filter((set) => set.completed).length} de{' '}
              {session.sets.length} series completadas
            </Text>
            <Text>Descanso restante: {workout.remaining} s</Text>
            <ClientStatus />
            {!!workout.error && (
              <Text accessibilityRole="alert">{workout.error}</Text>
            )}
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.card}>
            <Text variant="titleLarge">{section.exercise.name}</Text>
            <Text>{section.client_notes}</Text>
            {!completed && (
              <Button
                onPress={() =>
                  workout.startRest(section.rest_between_sets_seconds)
                }
              >
                Iniciar descanso ({section.rest_between_sets_seconds} s)
              </Button>
            )}
          </View>
        )}
        renderItem={({ item }) => {
          const recorded = session.sets.find(
            (set) => set.exercise_set === item.id
          );
          return recorded ? (
            <WorkoutSetRow
              sessionId={session.id}
              prescribed={item}
              recorded={recorded}
              disabled={completed}
            />
          ) : (
            <Text>Serie no disponible.</Text>
          );
        }}
        ListFooterComponent={
          <View style={styles.content}>
            {completed ? (
              <>
                <Text>
                  El resumen quedó guardado
                  {session.pending
                    ? ' y está pendiente de sincronización.'
                    : ' y sincronizado.'}
                </Text>
                <Button onPress={() => navigation.navigate('History')}>
                  Ver historial
                </Button>
              </>
            ) : (
              <Button mode="contained" onPress={workout.finish}>
                Finalizar entrenamiento
              </Button>
            )}
            <Button onPress={workout.sync}>Sincronizar ahora</Button>
            <Button onPress={() => navigation.popToTop()}>
              Volver a mis rutinas
            </Button>
          </View>
        }
      />
    </ClientLayout>
  );
}
