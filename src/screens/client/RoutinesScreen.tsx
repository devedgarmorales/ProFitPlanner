import React from 'react';
import { FlatList, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { ClientScreenProps } from '../../navigation/clientTypes';
import { useClientStore } from '../../store/clientStore';
import {
  ClientLayout,
  ClientStatus,
  clientStyles as styles,
} from '../../components/ClientLayout';
import {
  EmptyState,
  Hero,
  Icon,
  Pill,
  ProgressBar,
  Surface,
  ui,
  usePalette,
} from '../../components/ClientUi';
import { ListSkeleton } from '../../components/ClientSkeletons';
import { sessionProgress } from '../../services/workoutDisplay';

export function RoutinesScreen({ navigation }: ClientScreenProps<'Routines'>) {
  const { data, organization, user, busy, refresh } = useClientStore();
  const palette = usePalette();
  const active = data.workouts.find(
    (session) => session.status === 'in_progress'
  );
  const progress = active ? sessionProgress(active.sets) : undefined;
  return (
    <ClientLayout>
      <FlatList
        contentContainerStyle={ui.fullBleed}
        data={data.routines}
        keyExtractor={(item) => item.id}
        refreshing={busy}
        onRefresh={refresh}
        ListHeaderComponent={
          <View style={ui.fullBleed}>
            <Hero
              title={
                user?.first_name ? `Hola, ${user.first_name}` : 'Tus rutinas'
              }
              subtitle={
                organization?.organization.name || 'Selecciona tu organización'
              }
              actions={[
                {
                  icon: 'history',
                  label: 'Historial',
                  onPress: () => navigation.navigate('History'),
                },
                {
                  icon: 'account-circle-outline',
                  label: 'Mi cuenta',
                  onPress: () => navigation.navigate('Profile'),
                },
              ]}
            />
            <View style={styles.content}>
              <ClientStatus />
              {active && progress && (
                <Surface
                  accessibilityLabel={`Continuar entrenamiento ${active.day_name}`}
                  onPress={() =>
                    navigation.navigate('Workout', { sessionId: active.id })
                  }
                >
                  <View style={styles.row}>
                    <Icon name="play-circle" size={28} color={palette.accent} />
                    <View style={styles.grow}>
                      <Text variant="titleMedium">
                        Entrenamiento en curso: {active.day_name}
                      </Text>
                      <Text style={{ color: palette.muted }}>
                        {progress.done} de {progress.total} series completadas
                      </Text>
                    </View>
                    <Icon
                      name="chevron-right"
                      size={24}
                      color={palette.muted}
                    />
                  </View>
                  <ProgressBar percent={progress.percent} />
                </Surface>
              )}
              {data.routines.length > 0 && (
                <Text variant="titleMedium">Rutinas vigentes</Text>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          busy ? (
            <ListSkeleton />
          ) : (
            <EmptyState
              icon="clipboard-text-outline"
              title="Sin rutinas vigentes"
            >
              <Text style={ui.center}>
                No hay rutinas vigentes disponibles. Tu coach puede asignarte
                una desde la plataforma.
              </Text>
              <Button onPress={refresh}>Actualizar</Button>
              {!organization && (
                <Button onPress={() => navigation.navigate('Organizations')}>
                  Elegir organización
                </Button>
              )}
            </EmptyState>
          )
        }
        renderItem={({ item }) => (
          <View style={ui.itemPad}>
            <Surface
              accessibilityLabel={`Abrir rutina ${item.name}`}
              onPress={() =>
                navigation.navigate('Routine', { routineId: item.id })
              }
            >
              <View style={styles.row}>
                <View style={styles.grow}>
                  <Text variant="titleMedium">{item.name}</Text>
                  <Text style={{ color: palette.muted }}>
                    Coach: {item.coach.name}
                  </Text>
                </View>
                <Icon name="chevron-right" size={24} color={palette.muted} />
              </View>
              <View style={styles.row}>
                <Pill
                  icon="calendar-range"
                  label={`${item.start_date} — ${item.end_date}`}
                />
                <Pill
                  icon="dumbbell"
                  tone="accent"
                  label={`${item.days.length} días de entrenamiento`}
                />
              </View>
            </Surface>
          </View>
        )}
      />
    </ClientLayout>
  );
}
