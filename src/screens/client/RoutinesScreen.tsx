import React from 'react';
import { FlatList, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { ClientScreenProps } from '../../navigation/clientTypes';
import { useClientStore } from '../../store/clientStore';
import {
  ClientLayout,
  ClientStatus,
  clientStyles as styles,
} from '../../components/ClientLayout';
export function RoutinesScreen({ navigation }: ClientScreenProps<'Routines'>) {
  const { data, organization, busy, refresh } = useClientStore();
  const active = data.workouts.find(
    (session) => session.status === 'in_progress'
  );
  return (
    <ClientLayout>
      <FlatList
        contentContainerStyle={styles.content}
        data={data.routines}
        keyExtractor={(item) => item.id}
        refreshing={busy}
        onRefresh={refresh}
        ListHeaderComponent={
          <View>
            <Text variant="headlineMedium">Tus rutinas</Text>
            <Text>
              {organization?.organization.name || 'Selecciona tu organización'}
            </Text>
            <View style={styles.row}>
              <Button onPress={() => navigation.navigate('History')}>
                Historial
              </Button>
              <Button onPress={() => navigation.navigate('Profile')}>
                Mi cuenta
              </Button>
            </View>
            <ClientStatus />
            {active && (
              <Card style={styles.card}>
                <Text variant="titleMedium">
                  Entrenamiento en curso: {active.day_name}
                </Text>
                <Button
                  mode="contained"
                  onPress={() =>
                    navigation.navigate('Workout', { sessionId: active.id })
                  }
                >
                  Continuar entrenamiento
                </Button>
              </Card>
            )}
          </View>
        }
        ListEmptyComponent={
          <View>
            <Text>
              No hay rutinas vigentes disponibles. Tu coach puede asignarte una
              desde la plataforma.
            </Text>
            <Button onPress={refresh}>Actualizar</Button>
            {!organization && (
              <Button onPress={() => navigation.navigate('Organizations')}>
                Elegir organización
              </Button>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <Card
            style={styles.card}
            onPress={() =>
              navigation.navigate('Routine', { routineId: item.id })
            }
          >
            <Text variant="titleLarge">{item.name}</Text>
            <Text>Coach: {item.coach.name}</Text>
            <Text>
              {item.start_date} — {item.end_date}
            </Text>
            <Text>{item.days.length} días de entrenamiento</Text>
          </Card>
        )}
      />
    </ClientLayout>
  );
}
