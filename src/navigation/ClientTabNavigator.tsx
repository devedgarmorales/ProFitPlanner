import React from 'react';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { RoutinesScreen } from '../screens/client/RoutinesScreen';
import { HistoryScreen } from '../screens/client/HistoryScreen';
import { ProfileScreen } from '../screens/client/ProfileScreen';
import { Icon, usePalette } from '../components/ClientUi';
import { clientTabs } from './clientTabs';
import { ClientTabs } from './clientTypes';

const Tab = createBottomTabNavigator<ClientTabs>();

type TabConfig = (typeof clientTabs)[number];

function tabOptions(tab: TabConfig): BottomTabNavigationOptions {
  return {
    title: tab.title,
    headerShown: tab.name !== 'Routines',
    tabBarAccessibilityLabel: tab.title,
    tabBarIcon: ({ focused, color, size }) => (
      <Icon
        name={focused ? tab.iconActive : tab.icon}
        size={size}
        color={color}
      />
    ),
  };
}

export function ClientTabNavigator() {
  const palette = usePalette();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: palette.accent,
        tabBarInactiveTintColor: palette.muted,
        tabBarStyle: {
          backgroundColor: palette.card,
          borderTopColor: palette.border,
        },
        tabBarLabelStyle: { fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Routines"
        component={RoutinesScreen}
        options={tabOptions(clientTabs[0])}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={tabOptions(clientTabs[1])}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={tabOptions(clientTabs[2])}
      />
    </Tab.Navigator>
  );
}
