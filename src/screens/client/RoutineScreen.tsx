import React from 'react';
import { FlatList, View } from 'react-native';
import { Text } from 'react-native-paper';
import { ClientScreenProps } from '../../navigation/clientTypes';
import { useRoutineSelection } from '../../hooks/client/useRoutineSelection';
import {
  ClientLayout,
  ClientStatus,
  clientStyles as styles,
} from '../../components/ClientLayout';
import {
  EmptyState,
  Icon,
  Pill,
  Surface,
  ui,
  usePalette,
} from '../../components/ClientUi';

export function RoutineScreen({
  route,
  navigation,
}: ClientScreenProps<'Routine'>) {
  const { routine } = useRoutineSelection(route.params.routineId);
  const palette = usePalette();
  return (
    <ClientLayout>
      <FlatList
        contentContainerStyle={styles.content}
        data={routine?.days || []}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.content}>
            <Text variant="headlineMedium">
              {routine?.name || 'Rutina no disponible'}
            </Text>
            {!!routine?.description && <Text>{routine.description}</Text>}
            {!!routine && (
              <Pill icon="account-tie" label={`Coach: ${routine.coach.name}`} />
            )}
            <ClientStatus />
          </View>
        }
        ListEmptyComponent={
          <EmptyState icon="calendar-blank" title="Sin días disponibles">
            <Text>No hay días disponibles para esta rutina.</Text>
          </EmptyState>
        }
        renderItem={({ item, index }) => (
          <Surface
            accessibilityLabel={`Abrir ${item.name}`}
            onPress={() =>
              navigation.navigate('Day', {
                routineId: route.params.routineId,
                dayId: item.id,
              })
            }
          >
            <View style={styles.row}>
              <View style={[ui.badge, { backgroundColor: palette.accent }]}>
                <Text style={{ color: palette.onAccent }}>{index + 1}</Text>
              </View>
              <View style={styles.grow}>
                <Text variant="titleLarge">{item.name}</Text>
                <Text style={{ color: palette.muted }}>
                  {item.exercises.length} ejercicios ·{' '}
                  {item.estimated_duration_minutes} minutos estimados
                </Text>
              </View>
              <Icon name="chevron-right" size={24} color={palette.muted} />
            </View>
          </Surface>
        )}
      />
    </ClientLayout>
  );
}
