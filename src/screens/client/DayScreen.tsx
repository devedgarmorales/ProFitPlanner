import React from 'react';
import { FlatList, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { ClientScreenProps } from '../../navigation/clientTypes';
import { useRoutineSelection } from '../../hooks/client/useRoutineSelection';
import {
  ClientLayout,
  ClientStatus,
  clientStyles as styles,
} from '../../components/ClientLayout';
import {
  EmptyState,
  ExerciseImage,
  ExerciseMeta,
  Pill,
  Surface,
  ui,
  usePalette,
} from '../../components/ClientUi';

export function DayScreen({ route, navigation }: ClientScreenProps<'Day'>) {
  const { day, error, start } = useRoutineSelection(
    route.params.routineId,
    route.params.dayId
  );
  const palette = usePalette();
  const canStart = !!day?.exercises.some(
    (exercise) => exercise.sets.length > 0
  );
  return (
    <ClientLayout>
      <FlatList
        contentContainerStyle={styles.content}
        data={day?.exercises || []}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.content}>
            <Text variant="headlineSmall">
              {day?.name || 'Día no disponible'}
            </Text>
            {!!day?.description && <Text>{day.description}</Text>}
            {!!day && (
              <View style={styles.row}>
                <Pill
                  icon="dumbbell"
                  label={`${day.exercises.length} ejercicios`}
                />
                <Pill
                  icon="timer-outline"
                  label={`${day.estimated_duration_minutes} min`}
                />
              </View>
            )}
            <ClientStatus />
            {!!error && (
              <Text accessibilityRole="alert" style={{ color: palette.danger }}>
                {error}
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <EmptyState icon="dumbbell" title="Sin ejercicios">
            <Text>Tu coach todavía no agregó ejercicios.</Text>
          </EmptyState>
        }
        ListFooterComponent={
          <Button
            mode="contained"
            icon="play"
            contentStyle={ui.cta}
            disabled={!canStart}
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
          <Surface>
            <View style={ui.exerciseTop}>
              <ExerciseImage
                uri={item.exercise.image}
                name={item.exercise.name}
              />
              <Text variant="titleMedium" style={styles.grow}>
                {item.exercise.name}
              </Text>
            </View>
            <View style={styles.row}>
              <Pill label={`${item.sets.length} series`} tone="accent" />
              <Pill
                icon="timer-sand"
                label={`Descanso: ${item.rest_between_sets_seconds} segundos`}
              />
            </View>
            <ExerciseMeta
              muscles={item.exercise.primary_muscles}
              video={item.exercise.video_url}
            />
            {!!item.client_notes && <Text>{item.client_notes}</Text>}
            {item.sets.map((set) => (
              <Text key={set.id} style={{ color: palette.muted }}>
                Serie {set.set_number}: {set.reps} repeticiones ·{' '}
                {set.target_weight || '—'} {set.weight_unit}
              </Text>
            ))}
          </Surface>
        )}
      />
    </ClientLayout>
  );
}
