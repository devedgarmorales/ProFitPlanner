import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { SegmentedButtons, Text } from 'react-native-paper';
import { ClientTabScreenProps } from '../../navigation/clientTypes';
import { useHistory } from '../../hooks/client/useHistory';
import {
  ClientLayout,
  ClientStatus,
  clientStyles as styles,
} from '../../components/ClientLayout';
import { ListSkeleton } from '../../components/ClientSkeletons';
import { Sparkline, WeekStrip } from '../../components/ClientCharts';
import {
  EmptyState,
  Icon,
  Pill,
  Surface,
  ui,
  usePalette,
} from '../../components/ClientUi';
import {
  ExerciseSummary,
  formatSessionDate,
  sessionStats,
  weekActivity,
} from '../../services/workoutDisplay';
import { HistorySession } from '../../interfaces/client';

type View_ = 'exercises' | 'sessions';
type Row =
  | { kind: 'exercise'; item: ExerciseSummary }
  | { kind: 'session'; item: HistorySession };

const Separator = () => <View style={ui.rowGap} />;

export function HistoryScreen({ navigation }: ClientTabScreenProps<'History'>) {
  const { history, summaries, refresh, busy } = useHistory();
  const [view, setView] = useState<View_>('exercises');
  const week = weekActivity(history);
  const weekTotal = week.reduce((sum, day) => sum + day.count, 0);
  const rows: Row[] =
    view === 'exercises'
      ? summaries.map((item) => ({ kind: 'exercise', item }))
      : history.map((item) => ({ kind: 'session', item }));
  return (
    <ClientLayout>
      <FlatList
        contentContainerStyle={styles.content}
        data={rows}
        keyExtractor={(row) =>
          row.kind === 'exercise' ? row.item.key : row.item.id
        }
        refreshing={busy}
        onRefresh={refresh}
        ListHeaderComponent={
          <View style={styles.content}>
            <ClientStatus />
            <Surface>
              <View style={styles.row}>
                <Text
                  variant="titleMedium"
                  numberOfLines={1}
                  style={styles.grow}
                >
                  Esta semana
                </Text>
                <Pill
                  tone="accent"
                  label={
                    weekTotal === 1
                      ? '1 entrenamiento'
                      : `${weekTotal} entrenamientos`
                  }
                />
              </View>
              <WeekStrip days={week} />
            </Surface>
            <SegmentedButtons
              value={view}
              onValueChange={(value) => setView(value as View_)}
              buttons={[
                { value: 'exercises', label: 'Ejercicios' },
                { value: 'sessions', label: 'Sesiones' },
              ]}
            />
          </View>
        }
        ListEmptyComponent={
          busy ? (
            <ListSkeleton />
          ) : (
            <EmptyState icon="history" title="Sin historial">
              <Text style={ui.center}>
                Cuando termines tu primer entrenamiento aparecerá aquí.
              </Text>
            </EmptyState>
          )
        }
        renderItem={({ item: row }) => (
          <View style={ui.itemPad}>
            {row.kind === 'exercise' ? (
              <ExerciseRow
                summary={row.item}
                onPress={() =>
                  navigation.navigate('ExerciseProgress', {
                    key: row.item.key,
                    name: row.item.name,
                  })
                }
              />
            ) : (
              <SessionRow
                session={row.item}
                onPress={() =>
                  navigation.navigate('SessionDetail', {
                    sessionId: row.item.id,
                  })
                }
              />
            )}
          </View>
        )}
        ItemSeparatorComponent={Separator}
      />
    </ClientLayout>
  );
}

function ExerciseRow({
  summary,
  onPress,
}: {
  summary: ExerciseSummary;
  onPress: () => void;
}) {
  const palette = usePalette();
  const { delta } = summary;
  return (
    <Surface
      accessibilityLabel={`Progreso de ${summary.name}`}
      onPress={onPress}
    >
      <View style={styles.row}>
        <Text variant="titleSmall" numberOfLines={2} style={styles.grow}>
          {summary.name}
        </Text>
        <Icon name="chevron-right" size={22} color={palette.muted} />
      </View>
      <View style={styles.row}>
        <Text
          variant="bodyMedium"
          style={[styles.grow, { color: palette.muted }]}
        >
          {summary.last.weight} {summary.unit} × {summary.last.reps}
        </Text>
        <Sparkline values={summary.points.map((point) => point.weight)} />
        {delta !== null && delta !== 0 && (
          <Pill
            tone={delta > 0 ? 'accent' : 'warning'}
            icon={delta > 0 ? 'arrow-up' : 'arrow-down'}
            label={`${Math.abs(delta)}`}
          />
        )}
      </View>
    </Surface>
  );
}

function SessionRow({
  session,
  onPress,
}: {
  session: HistorySession;
  onPress: () => void;
}) {
  const palette = usePalette();
  const stats = sessionStats(session);
  return (
    <Surface
      accessibilityLabel={`Sesión ${session.day_name}`}
      onPress={onPress}
    >
      <View style={styles.row}>
        <View style={styles.grow}>
          <Text variant="labelMedium" style={{ color: palette.muted }}>
            {formatSessionDate(session.started_at)}
          </Text>
          <Text variant="titleSmall" numberOfLines={1}>
            {session.day_name}
          </Text>
        </View>
        <Pill
          tone={session.status === 'completed' ? 'accent' : 'warning'}
          label={`${stats.sets}/${stats.totalSets}`}
        />
        <Icon name="chevron-right" size={22} color={palette.muted} />
      </View>
    </Surface>
  );
}
