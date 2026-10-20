import React, { useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useHistory } from '../../hooks/client/useHistory';
import {
  ClientLayout,
  ClientStatus,
  clientStyles as styles,
} from '../../components/ClientLayout';
import { ListSkeleton, StatsSkeleton } from '../../components/ClientSkeletons';
import {
  EmptyState,
  Icon,
  Pill,
  StatTile,
  Surface,
  usePalette,
} from '../../components/ClientUi';

export function HistoryScreen() {
  const { history, completedCount, progress, refresh, busy } = useHistory();
  const palette = usePalette();
  const [open, setOpen] = useState<string>();
  const totalSets = history.reduce(
    (sum, session) => sum + session.sets.filter((set) => set.completed).length,
    0
  );
  return (
    <ClientLayout>
      <FlatList
        contentContainerStyle={styles.content}
        data={history}
        keyExtractor={(item) => item.id}
        refreshing={busy}
        onRefresh={refresh}
        ListHeaderComponent={
          <View style={styles.content}>
            <Text variant="headlineSmall">Tu seguimiento</Text>
            {busy && history.length === 0 ? (
              <StatsSkeleton />
            ) : (
              <View style={styles.row}>
                <StatTile
                  icon="trophy-outline"
                  value={completedCount}
                  label="entrenamientos completados"
                />
                <StatTile
                  icon="check-all"
                  value={totalSets}
                  label="series completadas"
                />
              </View>
            )}
            <ClientStatus />
            {progress.length > 0 && (
              <>
                <Text variant="titleMedium">
                  Cargas recientes por ejercicio
                </Text>
                <Text variant="bodySmall" style={{ color: palette.muted }}>
                  Mayor carga por sesión; se comparan las últimas dos sesiones
                  del mismo ejercicio y unidad. No es una recomendación de
                  carga.
                </Text>
                {progress.map((item) => (
                  <Surface key={item.id}>
                    <Text variant="titleSmall">{item.name}</Text>
                    <Text>
                      Última: {item.performances[0].weight} {item.unit} ×{' '}
                      {item.performances[0].reps} repeticiones
                    </Text>
                    <Text style={{ color: palette.muted }}>
                      {item.performances[1]
                        ? `Anterior: ${item.performances[1].weight} ${item.unit} × ${item.performances[1].reps} repeticiones`
                        : 'Primer registro: todavía no hay una sesión anterior.'}
                    </Text>
                  </Surface>
                ))}
                <Text variant="titleMedium">Sesiones</Text>
              </>
            )}
          </View>
        }
        ListEmptyComponent={
          busy ? (
            <ListSkeleton />
          ) : (
            <EmptyState icon="history" title="Sin historial">
              <Text>Todavía no hay entrenamientos registrados.</Text>
            </EmptyState>
          )
        }
        renderItem={({ item }) => {
          const expanded = open === item.id;
          const done = item.sets.filter((set) => set.completed);
          return (
            <Surface>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded }}
                onPress={() => setOpen(expanded ? undefined : item.id)}
                style={styles.row}
              >
                <View style={styles.grow}>
                  <Text variant="titleMedium">
                    {item.routine_name} · {item.day_name}
                  </Text>
                  <Text style={{ color: palette.muted }}>
                    Coach: {item.coach_name}
                  </Text>
                  <Text style={{ color: palette.muted }}>
                    {new Date(item.started_at).toLocaleString()}
                  </Text>
                </View>
                <Icon
                  name={expanded ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={palette.muted}
                />
              </Pressable>
              <View style={styles.row}>
                <Pill
                  icon={
                    item.status === 'completed'
                      ? 'check-circle'
                      : 'play-circle-outline'
                  }
                  tone={item.status === 'completed' ? 'accent' : 'warning'}
                  label={
                    item.status === 'completed' ? 'Completado' : 'En curso'
                  }
                />
                <Pill label={`${done.length}/${item.sets.length} series`} />
              </View>
              {expanded &&
                done.map((set) => (
                  <Text key={set.exercise_set}>
                    {set.exercise_name || 'Serie registrada'}
                    {set.set_number ? ` · Serie ${set.set_number}` : ''}:{' '}
                    {set.reps_performed} repeticiones · {set.weight_used || '—'}{' '}
                    {set.weight_unit || ''}
                    {set.notes ? ` · ${set.notes}` : ''}
                  </Text>
                ))}
            </Surface>
          );
        }}
      />
    </ClientLayout>
  );
}
