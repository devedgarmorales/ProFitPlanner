import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';
import { useClientStore } from '../store/clientStore';
import { Icon, Surface, usePalette } from './ClientUi';
export const clientStyles = StyleSheet.create({
  page: { flex: 1 },
  content: { padding: 16, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  grow: { flex: 1 },
  card: { padding: 16, gap: 8 },
  field: { flex: 1, minWidth: 100 },
  gap: { height: 12 },
  status: { gap: 8 },
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
  const palette = usePalette();
  const pending = data.workouts.filter((session) => session.pending).length;
  if (!busy && !offline && pending === 0 && !error) {
    return null;
  }
  return (
    <Surface style={clientStyles.status}>
      {busy && <ActivityIndicator accessibilityLabel="Cargando" />}
      {offline && (
        <View style={clientStyles.row}>
          <Icon name="wifi-off" size={18} color={palette.warning} />
          <Text style={clientStyles.grow}>
            Sin conexión confirmada. Se muestran los datos guardados en este
            dispositivo.
          </Text>
        </View>
      )}
      {pending > 0 && (
        <View style={clientStyles.row}>
          <Icon name="cloud-upload-outline" size={18} color={palette.accent} />
          <Text style={clientStyles.grow}>
            {pending} entrenamiento(s) con sincronización pendiente.
          </Text>
          <Button compact onPress={sync}>
            Sincronizar avance
          </Button>
        </View>
      )}
      {!!error && (
        <View style={clientStyles.row}>
          <Icon name="alert-circle-outline" size={18} color={palette.danger} />
          <Text style={clientStyles.grow} accessibilityRole="alert">
            {error}
          </Text>
          <Button compact onPress={clearError}>
            Cerrar aviso
          </Button>
        </View>
      )}
    </Surface>
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
