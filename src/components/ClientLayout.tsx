import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';
import { useClientStore } from '../store/clientStore';
export const clientStyles = StyleSheet.create({
  page: { flex: 1 },
  content: { padding: 20, gap: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  grow: { flex: 1 },
  card: { padding: 16, gap: 8 },
  field: { flex: 1, minWidth: 100 },
  gap: { height: 12 },
});
export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      edges={['bottom', 'left', 'right']}
      style={[clientStyles.page, { backgroundColor: colors.background }]}
    >
      {children}
    </SafeAreaView>
  );
}
export function ClientStatus() {
  const { error, offline, busy, data, sync, clearError } = useClientStore();
  const pending = data.workouts.filter((session) => session.pending).length;
  return (
    <View style={clientStyles.card}>
      {busy && <ActivityIndicator accessibilityLabel="Cargando" />}
      {offline && (
        <Text>
          Sin conexión confirmada. Se muestran los datos guardados en este
          dispositivo.
        </Text>
      )}
      {pending > 0 && (
        <Text>{pending} entrenamiento(s) con sincronización pendiente.</Text>
      )}
      {!!error && (
        <>
          <Text accessibilityRole="alert">{error}</Text>
          <Button onPress={clearError}>Cerrar aviso</Button>
        </>
      )}
      {pending > 0 && <Button onPress={sync}>Sincronizar avance</Button>}
    </View>
  );
}
export class ClientErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <View style={clientStyles.content}>
        <Text>
          Esta pantalla no pudo mostrarse. El avance guardado se conserva.
        </Text>
        <Button onPress={() => this.setState({ failed: false })}>
          Volver a intentar
        </Button>
      </View>
    ) : (
      this.props.children
    );
  }
}
