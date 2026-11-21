import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../screens/DashboardScreen';
import { TrendsScreen } from '../screens/TrendsScreen';
import { ActivityScreen } from '../screens/ActivityScreen';
import { AthleteScreen } from '../screens/AthleteScreen';
import { colors } from '../components/theme';
import { UserMode } from '../types';

const Tab = createBottomTabNavigator();

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.4 }}>{icon}</Text>
  );
}

export function AppNavigator() {
  const [mode, setMode] = useState<UserMode>('general');
  const toggleMode = () => setMode((m) => (m === 'general' ? 'athlete' : 'general'));

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 80,
            paddingBottom: 16,
          },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        }}
      >
        <Tab.Screen
          name="Dashboard"
          options={{ tabBarIcon: ({ focused }) => <TabIcon icon="❤️" focused={focused} /> }}
        >
          {() => <DashboardScreen mode={mode} onToggleMode={toggleMode} />}
        </Tab.Screen>

        <Tab.Screen
          name="Trends"
          component={TrendsScreen}
          options={{ tabBarIcon: ({ focused }) => <TabIcon icon="📈" focused={focused} /> }}
        />

        <Tab.Screen
          name="Activity"
          component={ActivityScreen}
          options={{ tabBarIcon: ({ focused }) => <TabIcon icon="⚡" focused={focused} /> }}
        />

        {mode === 'athlete' && (
          <Tab.Screen
            name="Athlete"
            component={AthleteScreen}
            options={{ tabBarIcon: ({ focused }) => <TabIcon icon="🏅" focused={focused} /> }}
          />
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
