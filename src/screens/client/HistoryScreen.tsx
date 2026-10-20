import React from 'react';
import {FlatList, View} from 'react-native';
import {Card, Text} from 'react-native-paper';
import {useHistory} from '../../hooks/client/useHistory';
import {
  ClientLayout,
  ClientStatus,
  clientStyles as styles,
} from '../../components/ClientLayout';
export function HistoryScreen() {
  const {history, completedCount, progress, refresh, busy} = useHistory();
  return (
    <ClientLayout>
      <FlatList
        contentContainerStyle={styles.content}
        data={history}
        keyExtractor={item => item.id}
        refreshing={busy}
        onRefresh={refresh}
        ListHeaderComponent={
          <View>
            <Text variant="headlineMedium">Tu seguimiento</Text>
            <Text>{completedCount} entrenamientos completados</Text>
            <ClientStatus />
            {progress.length > 0 && (
              <>
                <Text variant="titleMedium">
                  Cargas recientes por ejercicio
                </Text>
                <Text>
                  Mayor carga por sesión; se comparan las últimas dos sesiones
                  del mismo ejercicio y unidad. No es una recomendación de
                  carga.
                </Text>
                {progress.map(item => (
                  <View key={item.id}>
                    <Text variant="titleSmall">{item.name}</Text>
                    <Text>
                      Última: {item.performances[0].weight} {item.unit} ×{' '}
                      {item.performances[0].reps} repeticiones
                    </Text>
                    <Text>
                      {item.performances[1]
                        ? `Anterior: ${item.performances[1].weight} ${item.unit} × ${item.performances[1].reps} repeticiones`
                        : 'Primer registro: todavía no hay una sesión anterior.'}
                    </Text>
                  </View>
                ))}
              </>
            )}
          </View>
        }
        ListEmptyComponent={
          <Text>Todavía no hay entrenamientos registrados.</Text>
        }
        renderItem={({item}) => (
          <Card style={styles.card}>
            <Text variant="titleLarge">
              {item.routine_name} · {item.day_name}
            </Text>
            <Text>Coach: {item.coach_name}</Text>
            <Text>{new Date(item.started_at).toLocaleString()}</Text>
            <Text>
              {item.status === 'completed' ? 'Completado' : 'En curso'} ·{' '}
              {item.sets.filter(set => set.completed).length}/{item.sets.length}{' '}
              series
            </Text>
            {item.sets
              .filter(set => set.completed)
              .map(set => (
                <Text key={set.exercise_set}>
                  {set.exercise_name || 'Serie registrada'}
                  {set.set_number ? ` · Serie ${set.set_number}` : ''}:{' '}
                  {set.reps_performed} repeticiones · {set.weight_used || '—'}{' '}
                  {set.weight_unit || ''}
                  {set.notes ? ` · ${set.notes}` : ''}
                </Text>
              ))}
          </Card>
        )}
      />
    </ClientLayout>
  );
}
