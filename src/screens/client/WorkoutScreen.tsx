import React, { useMemo } from 'react';
import { SectionList, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { ClientScreenProps } from '../../navigation/clientTypes';
import { useWorkout } from '../../hooks/client/useWorkout';
import { useClientStore } from '../../store/clientStore';
import {
  ClientLayout,
  ClientStatus,
  clientStyles as styles,
} from '../../components/ClientLayout';
import { WorkoutSetRow } from '../../components/WorkoutSetRow';
import {
  EmptyState,
  Icon,
  Pill,
  ProgressBar,
  Surface,
  ui,
  usePalette,
} from '../../components/ClientUi';
import { mergeHistory } from '../../services/workout';
import { exerciseProgress } from '../../services/workoutProgress';
import { formatClock, sessionProgress } from '../../services/workoutDisplay';

const Separator = () => <View style={styles.gap} />;

export function WorkoutScreen({
  route,
  navigation,
}: ClientScreenProps<'Workout'>) {
  const workout = useWorkout(route.params.sessionId);
  const { data } = useClientStore();
  const palette = usePalette();
  const session = workout.session;
  const previous = useMemo(() => {
    const lookup = new Map<string, string>();
    exerciseProgress(mergeHistory(data.history, data.workouts)).forEach(
      (item) => {
        const last = item.performances[0];
        lookup.set(item.id, `${last.weight} ${item.unit} × ${last.reps}`);
      }
    );
    return lookup;
  }, [data.history, data.workouts]);
  if (!session) {
    return (
      <ClientLayout>
        <EmptyState icon="alert-circle-outline" title="No disponible">
          <Text>El entrenamiento no está disponible en este dispositivo.</Text>
        </EmptyState>
      </ClientLayout>
    );
  }
  const completed = session.status === 'completed';
  const progress = sessionProgress(session.sets);
  return (
    <ClientLayout>
      <SectionList
        contentContainerStyle={styles.content}
        stickySectionHeadersEnabled={false}
        sections={session.day.exercises.map((exercise) => ({
          ...exercise,
          data: exercise.sets,
        }))}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.content}>
            <Text variant="headlineSmall">{session.day_name}</Text>
            <View style={styles.row}>
              <Pill
                icon={completed ? 'check-circle' : 'play-circle-outline'}
                tone={completed ? 'accent' : 'muted'}
                label={
                  completed
                    ? 'Entrenamiento finalizado'
                    : 'Entrenamiento en curso'
                }
              />
              <Pill icon="timer-outline" label={`${workout.elapsed} min`} />
            </View>
            <Surface>
              <Text>
                {progress.done} de {progress.total} series completadas
              </Text>
              <ProgressBar percent={progress.percent} />
            </Surface>
            {!completed && workout.remaining > 0 && (
              <Surface>
                <View style={styles.row}>
                  <Icon name="timer-sand" size={22} color={palette.accent} />
                  <View style={styles.grow}>
                    <Text
                      variant="labelMedium"
                      style={{ color: palette.muted }}
                    >
                      Descanso
                    </Text>
                    <Text variant="headlineSmall">
                      {formatClock(workout.remaining)}
                    </Text>
                  </View>
                  {workout.remaining > 0 && (
                    <>
                      <Button
                        compact
                        onPress={() =>
                          workout.startRest(workout.remaining + 30)
                        }
                      >
                        +30 s
                      </Button>
                      <Button compact onPress={() => workout.startRest(0)}>
                        Omitir
                      </Button>
                    </>
                  )}
                </View>
              </Surface>
            )}
            <ClientStatus />
            {!!workout.error && (
              <Text accessibilityRole="alert" style={{ color: palette.danger }}>
                {workout.error}
              </Text>
            )}
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View style={ui.exerciseHeader}>
            <Text variant="titleMedium">{section.exercise.name}</Text>
            {!!section.client_notes && <Text>{section.client_notes}</Text>}
            {!completed && (
              <Button
                compact
                icon="timer-outline"
                onPress={() =>
                  workout.startRest(section.rest_between_sets_seconds)
                }
              >
                Iniciar descanso ({section.rest_between_sets_seconds} s)
              </Button>
            )}
          </View>
        )}
        renderItem={({ item, section }) => {
          const recorded = session.sets.find(
            (set) => set.exercise_set === item.id
          );
          const exerciseId =
            section.exercise.uuid ||
            (section.exercise.id ? String(section.exercise.id) : '');
          return recorded ? (
            <WorkoutSetRow
              sessionId={session.id}
              prescribed={item}
              recorded={recorded}
              disabled={completed}
              previous={previous.get(`${exerciseId}:${item.weight_unit}`)}
              onCompleted={() =>
                workout.startRest(section.rest_between_sets_seconds)
              }
            />
          ) : (
            <Text>Serie no disponible.</Text>
          );
        }}
        ItemSeparatorComponent={Separator}
        ListFooterComponent={
          <View style={styles.content}>
            {completed ? (
              <>
                <Surface>
                  <View style={styles.row}>
                    <Icon
                      name={
                        session.pending ? 'cloud-upload-outline' : 'cloud-check'
                      }
                      size={22}
                      color={palette.accent}
                    />
                    <Text style={styles.grow}>
                      El resumen quedó guardado
                      {session.pending
                        ? ' y está pendiente de sincronización.'
                        : ' y sincronizado.'}
                    </Text>
                  </View>
                </Surface>
                <Button
                  mode="contained"
                  contentStyle={ui.cta}
                  onPress={() => navigation.navigate('History')}
                >
                  Ver historial
                </Button>
              </>
            ) : (
              <Button
                mode="contained"
                icon="flag-checkered"
                contentStyle={ui.cta}
                onPress={workout.finish}
              >
                Finalizar entrenamiento
              </Button>
            )}
            <Button icon="sync" onPress={workout.sync}>
              Sincronizar ahora
            </Button>
            <Button onPress={() => navigation.popToTop()}>
              Volver a mis rutinas
            </Button>
          </View>
        }
      />
    </ClientLayout>
  );
}
