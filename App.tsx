import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import LogScreen from './src/screens/LogScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import InsightsScreen from './src/screens/InsightsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#2196F3',
          tabBarInactiveTintColor: '#aaa',
          tabBarStyle: { paddingBottom: 8, height: 60 },
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen}
          options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text>, tabBarLabel: 'Today' }} />
        <Tab.Screen name="Log" component={LogScreen}
          options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>✏️</Text>, tabBarLabel: 'Log' }} />
        <Tab.Screen name="History" component={HistoryScreen}
          options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>📅</Text>, tabBarLabel: 'History' }} />
        <Tab.Screen name="Goals" component={GoalsScreen}
          options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>🎯</Text>, tabBarLabel: 'Goals' }} />
        <Tab.Screen name="Insights" component={InsightsScreen}
          options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>🤖</Text>, tabBarLabel: 'AI Coach' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}