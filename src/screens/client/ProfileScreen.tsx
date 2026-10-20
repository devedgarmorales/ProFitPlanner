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
export function ProfileScreen({ navigation }: ClientScreenProps<'Profile'>) {
  const { user, organization, logout, busy } = useClientStore();
  return (
    <ClientLayout>
      <View style={styles.content}>
        <Text variant="headlineMedium">Mi cuenta</Text>
        <Text>
          {user?.first_name} {user?.last_name}
        </Text>
        <Text>{user?.email}</Text>
        <Text>{organization?.organization.name}</Text>
        <ClientStatus />
        <Button onPress={() => navigation.navigate('Organizations')}>
          Cambiar organización
        </Button>
        <Text>
          Al cerrar sesión, el avance pendiente se conserva en este dispositivo
          y solo se muestra al volver a ingresar con tu cuenta y organización.
        </Text>
        <Button mode="outlined" disabled={busy} onPress={logout}>
          Cerrar sesión
        </Button>
      </View>
    </ClientLayout>
  );
}
