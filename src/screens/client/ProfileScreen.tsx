import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { ClientScreenProps } from '../../navigation/clientTypes';
import { useClientStore } from '../../store/clientStore';
import {
  ClientLayout,
  ClientStatus,
  clientStyles as styles,
} from '../../components/ClientLayout';
import { Avatar, Pill, ui, usePalette } from '../../components/ClientUi';

export function ProfileScreen({ navigation }: ClientScreenProps<'Profile'>) {
  const { user, organization, memberships, logout, busy } = useClientStore();
  const palette = usePalette();
  const fullName = `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim();
  return (
    <ClientLayout>
      <View style={styles.content}>
        <Avatar name={fullName || user?.email || ''} />
        <View style={ui.centerStack}>
          <Text variant="titleMedium">{fullName}</Text>
          <Text style={{ color: palette.muted }}>{user?.email}</Text>
          {!!organization && (
            <Pill icon="domain" label={organization.organization.name} />
          )}
        </View>
        <ClientStatus />
        {memberships.length > 1 && (
          <Button
            mode="outlined"
            icon="swap-horizontal"
            onPress={() => navigation.navigate('Organizations')}
          >
            Cambiar organización
          </Button>
        )}
        <Text variant="bodySmall" style={{ color: palette.muted }}>
          Al cerrar sesión, el avance pendiente se conserva en este dispositivo
          y solo se muestra al volver a ingresar con tu cuenta y organización.
        </Text>
        <Button mode="contained" icon="logout" disabled={busy} onPress={logout}>
          Cerrar sesión
        </Button>
      </View>
    </ClientLayout>
  );
}
