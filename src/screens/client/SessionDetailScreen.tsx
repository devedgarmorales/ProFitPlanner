import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';
import { ClientScreenProps } from '../../navigation/clientTypes';
import { useHistory } from '../../hooks/client/useHistory';
import {
  ClientLayout,
  clientStyles as styles,
} from '../../components/ClientLayout';
import {
  EmptyState,
  Pill,
  StatTile,
  Surface,
  usePalette,
} from '../../components/ClientUi';
import {
  formatSessionDate,
  groupSessionSets,
  sessionStats,
} from '../../services/workoutDisplay';

export function SessionDetailScreen({
  route,
}: ClientScreenProps<'SessionDetail'>) {
  const { history } = useHistory();
  const palette = usePalette();
  const session = history.find((item) => item.id === route.params.sessionId);
  if (!session) {
    return (
      <ClientLayout>
        <EmptyState icon="alert-circle-outline" title="Sesión no disponible" />
      </ClientLayout>
    );
  }
  const stats = sessionStats(session);
  return (
    <ClientLayout>
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <Text variant="headlineSmall">{session.day_name}</Text>
          <Text style={{ color: palette.muted }}>
            {session.routine_name} · {formatSessionDate(session.started_at)}
          </Text>
        </View>
        <View style={styles.row}>
          <StatTile
            icon="timer-outline"
            value={stats.durationMin ? `${stats.durationMin} min` : '—'}
            label="duración"
          />
          <StatTile
            icon="check-all"
            value={`${stats.sets}/${stats.totalSets}`}
            label="series"
          />
          <StatTile
            icon="weight-kilogram"
            value={stats.volume}
            label="volumen"
          />
        </View>
        {groupSessionSets(session).map((group) => (
          <Surface key={group.name}>
            <Text variant="titleMedium">{group.name}</Text>
            {group.sets.map((set) => (
              <View key={set.exercise_set} style={styles.row}>
                <Pill label={`Serie ${set.set_number ?? ''}`.trim()} />
                <Text style={styles.grow}>
                  {set.reps_performed} reps × {set.weight_used || '—'}{' '}
                  {set.weight_unit || ''}
                </Text>
              </View>
            ))}
            {group.sets
              .filter((set) => !!set.notes)
              .map((set) => (
                <Text
                  key={`n-${set.exercise_set}`}
                  style={{ color: palette.muted }}
                >
                  {set.notes}
                </Text>
              ))}
          </Surface>
        ))}
      </ScrollView>
    </ClientLayout>
  );
}
