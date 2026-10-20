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
import { ListSkeleton } from '../../components/ClientSkeletons';
import {
  EmptyState,
  Icon,
  Surface,
  ui,
  usePalette,
} from '../../components/ClientUi';

export function OrganizationsScreen({
  navigation,
}: ClientScreenProps<'Organizations'>) {
  const { memberships, selectOrganization, logout, busy } = useClientStore();
  const palette = usePalette();
  return (
    <ClientLayout>
      <FlatList
        contentContainerStyle={styles.content}
        data={memberships}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.content}>
            <Text variant="headlineSmall">Elige tu organización</Text>
            <ClientStatus />
          </View>
        }
        ListEmptyComponent={
          busy ? (
            <ListSkeleton count={2} />
          ) : (
            <EmptyState icon="domain-off" title="Sin membresía activa">
              <Text style={ui.center}>
                No tienes una membresía activa de cliente. Solicita a tu coach
                que verifique tu acceso.
              </Text>
            </EmptyState>
          )
        }
        renderItem={({ item }) => (
          <Surface
            accessibilityLabel={`Entrar a ${item.organization.name}`}
            onPress={
              busy
                ? undefined
                : async () => {
                    await selectOrganization(item);
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Tabs' }],
                    });
                  }
            }
          >
            <View style={styles.row}>
              <Icon name="domain" size={24} color={palette.accent} />
              <Text variant="titleMedium" style={styles.grow}>
                {item.organization.name}
              </Text>
              <Icon name="chevron-right" size={24} color={palette.muted} />
            </View>
          </Surface>
        )}
        ListFooterComponent={
          <Button icon="logout" onPress={logout}>
            Cerrar sesión
          </Button>
        }
      />
    </ClientLayout>
  );
}
