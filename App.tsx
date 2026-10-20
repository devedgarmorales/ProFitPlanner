import React from 'react';
import { useColorScheme } from 'react-native';
import { ActivityIndicator, PaperProvider } from 'react-native-paper';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ClientStack } from './src/navigation/clientTypes';
import { clientTheme } from './src/styles/clientTheme';
import { useClientLifecycle } from './src/hooks/client/useClientLifecycle';
import { useClientStore } from './src/store/clientStore';
import { LaunchSplash } from './src/components/ClientUi';
import {
  ClientErrorBoundary,
  clientStyles,
} from './src/components/ClientLayout';
import { LoginScreen } from './src/screens/client/LoginScreen';
import { OrganizationsScreen } from './src/screens/client/OrganizationsScreen';
import { RoutinesScreen } from './src/screens/client/RoutinesScreen';
import { RoutineScreen } from './src/screens/client/RoutineScreen';
import { DayScreen } from './src/screens/client/DayScreen';
import { WorkoutScreen } from './src/screens/client/WorkoutScreen';
import { HistoryScreen } from './src/screens/client/HistoryScreen';
import { ProfileScreen } from './src/screens/client/ProfileScreen';
const Stack = createNativeStackNavigator<ClientStack>();
function App() {
  useClientLifecycle();
  const { ready, user, organization, memberships } = useClientStore();
  const dark = useColorScheme() === 'dark';
  const theme = clientTheme(dark);
  const navigationTheme = dark ? DarkTheme : DefaultTheme;
  return (
    <GestureHandlerRootView style={clientStyles.page}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <ClientErrorBoundary>
            {!ready ? (
              <ActivityIndicator accessibilityLabel="Restaurando sesión" />
            ) : !user ? (
              <LoginScreen />
            ) : !organization && memberships?.length ? (
              <LaunchSplash label="Preparando tu entrenamiento…" />
            ) : (
              <NavigationContainer
                theme={{
                  ...navigationTheme,
                  colors: {
                    ...navigationTheme.colors,
                    primary: theme.colors.primary,
                    background: theme.colors.background,
                    card: theme.colors.surface,
                  },
                }}
              >
                <Stack.Navigator
                  key={user.id}
                  initialRouteName={organization ? 'Routines' : 'Organizations'}
                  screenOptions={{
                    headerShadowVisible: false,
                    headerTitleStyle: { fontWeight: '700' },
                    headerBackButtonDisplayMode: 'minimal',
                  }}
                >
                  <Stack.Screen
                    name="Routines"
                    component={RoutinesScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="Organizations"
                    component={OrganizationsScreen}
                    options={{ title: 'Organizaciones' }}
                  />
                  <Stack.Screen
                    name="Routine"
                    component={RoutineScreen}
                    options={{ title: 'Rutina asignada' }}
                  />
                  <Stack.Screen
                    name="Day"
                    component={DayScreen}
                    options={{ title: 'Tu entrenamiento' }}
                  />
                  <Stack.Screen
                    name="Workout"
                    component={WorkoutScreen}
                    options={{ title: 'Registro de entrenamiento' }}
                  />
                  <Stack.Screen
                    name="History"
                    component={HistoryScreen}
                    options={{ title: 'Historial' }}
                  />
                  <Stack.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{ title: 'Mi cuenta' }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            )}
          </ClientErrorBoundary>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
export default App;
