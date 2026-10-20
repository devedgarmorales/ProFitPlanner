import React, { useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { ClientScreenProps } from '../../navigation/clientTypes';
import { useRoutineSelection } from '../../hooks/client/useRoutineSelection';
import { useStartWorkout } from '../../hooks/client/useStartWorkout';
import {
  ClientLayout,
  ClientStatus,
  clientStyles as styles,
} from '../../components/ClientLayout';
import {
  EmptyState,
  ExerciseImage,
  Icon,
  Pill,
  Surface,
  ui,
  usePalette,
} from '../../components/ClientUi';
import { RoutineDay } from '../../interfaces/client';

const Separator = () => <View style={ui.rowGap} />;

export function RoutineScreen({
  route,
  navigation,
}: ClientScreenProps<'Routine'>) {
  const { routine } = useRoutineSelection(route.params.routineId);
  const { error, startDay } = useStartWorkout((sessionId) =>
    navigation.navigate('Workout', { sessionId })
  );
  const palette = usePalette();
  const [open, setOpen] = useState<string>();
  const canStart = (day: RoutineDay) =>
    day.exercises.some((exercise) => exercise.sets.length > 0);
  return (
    <ClientLayout>
      <FlatList
        contentContainerStyle={styles.content}
        data={routine?.days || []}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={
          <View style={styles.content}>
            <Text variant="headlineSmall">
              {routine?.name || 'Rutina no disponible'}
            </Text>
            {!!routine?.description && <Text>{routine.description}</Text>}
            {!!routine && (
              <Pill icon="account-tie" label={`Coach: ${routine.coach.name}`} />
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
          <EmptyState icon="calendar-blank" title="Sin días disponibles">
            <Text>No hay días disponibles para esta rutina.</Text>
          </EmptyState>
        }
        renderItem={({ item, index }) => {
          const expanded = open === item.id;
          return (
            <View style={ui.itemPad}>
              <Surface>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Ver ejercicios de ${item.name}`}
                  accessibilityState={{ expanded }}
                  onPress={() => setOpen(expanded ? undefined : item.id)}
                  style={styles.row}
                >
                  <View style={[ui.badge, { backgroundColor: palette.accent }]}>
                    <Text style={{ color: palette.onAccent }}>{index + 1}</Text>
                  </View>
                  <View style={styles.grow}>
                    <Text variant="titleMedium">{item.name}</Text>
                    <Text style={{ color: palette.muted }}>
                      {item.exercises.length} ejercicios ·{' '}
                      {item.estimated_duration_minutes} min
                    </Text>
                  </View>
                  <Icon
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color={palette.muted}
                  />
                </Pressable>
                {expanded &&
                  item.exercises.map((exercise) => (
                    <View key={exercise.id} style={styles.row}>
                      <ExerciseImage
                        uri={exercise.exercise.image}
                        name={exercise.exercise.name}
                      />
                      <View style={styles.grow}>
                        <Text variant="titleSmall">
                          {exercise.exercise.name}
                        </Text>
                        <Text style={{ color: palette.muted }}>
                          {exercise.sets.length} series · descanso{' '}
                          {exercise.rest_between_sets_seconds} s
                        </Text>
                      </View>
                    </View>
                  ))}
                <Button
                  mode="contained"
                  icon="play"
                  contentStyle={ui.cta}
                  disabled={!canStart(item)}
                  onPress={() => routine && startDay(routine, item)}
                >
                  Comenzar
                </Button>
              </Surface>
            </View>
          );
        }}
      />
    </ClientLayout>
  );
}
