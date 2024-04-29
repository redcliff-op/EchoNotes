import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
        tabBarActiveBackgroundColor: (colorScheme==='dark')?'black':'white',
        tabBarInactiveBackgroundColor: (colorScheme==='dark')?'black':'white',
        headerTintColor: 'skyblue',
      }}>
      <Tabs.Screen
        name="index"
        options={{ headerShown: false, href: null }}
      />
      <Tabs.Screen
        name='Notes'
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="pencil" color={color} />,
          tabBarActiveTintColor: 'skyblue'
        }}
      />
      <Tabs.Screen
        name="Saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color }) => <TabBarIcon name='bookmark' color={color} />,
          tabBarActiveTintColor: 'skyblue'
        }}
      />
      <Tabs.Screen
        name='Account'
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name='user' color={color} />,
          tabBarActiveTintColor: 'skyblue'
        }}
      />
    </Tabs>
  );
}
