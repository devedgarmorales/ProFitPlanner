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
export function OrganizationsScreen({
  navigation,
}: ClientScreenProps<'Organizations'>) {
  const { memberships, selectOrganization, logout, busy } = useClientStore();
  return (
    <ClientLayout>
      <FlatList
        contentContainerStyle={styles.content}
        data={memberships}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <Text variant="headlineMedium">Elige tu organización</Text>
            <ClientStatus />
          </View>
        }
        ListEmptyComponent={
          <Text>
            No tienes una membresía activa de cliente. Solicita a tu coach que
            verifique tu acceso.
          </Text>
        }
        renderItem={({ item }) => (
          <Button
            mode="outlined"
            disabled={busy}
            onPress={async () => {
              await selectOrganization(item);
              navigation.reset({ index: 0, routes: [{ name: 'Routines' }] });
            }}
          >
            {item.organization.name}
          </Button>
        )}
        ListFooterComponent={<Button onPress={logout}>Cerrar sesión</Button>}
      />
    </ClientLayout>
  );
}
