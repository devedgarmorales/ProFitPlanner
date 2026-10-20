import React from 'react';
import { FlatList, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { ClientScreenProps } from '../../navigation/clientTypes';
import { useRoutineSelection } from '../../hooks/client/useRoutineSelection';
import {
  ClientLayout,
  ClientStatus,
  clientStyles as styles,
} from '../../components/ClientLayout';
export function RoutineScreen({
  route,
  navigation,
}: ClientScreenProps<'Routine'>) {
  const { routine } = useRoutineSelection(route.params.routineId);
  return (
    <ClientLayout>
      <FlatList
        contentContainerStyle={styles.content}
        data={routine?.days || []}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <Text variant="headlineMedium">
              {routine?.name || 'Rutina no disponible'}
            </Text>
            <Text>{routine?.description}</Text>
            <Text>Coach: {routine?.coach.name}</Text>
            <ClientStatus />
          </View>
        }
        ListEmptyComponent={
          <Text>No hay días disponibles para esta rutina.</Text>
        }
        renderItem={({ item }) => (
          <Card
            style={styles.card}
            onPress={() =>
              navigation.navigate('Day', {
                routineId: route.params.routineId,
                dayId: item.id,
              })
            }
          >
            <Text variant="titleLarge">{item.name}</Text>
            <Text>
              {item.exercises.length} ejercicios ·{' '}
              {item.estimated_duration_minutes} minutos estimados
            </Text>
          </Card>
        )}
      />
    </ClientLayout>
  );
}
