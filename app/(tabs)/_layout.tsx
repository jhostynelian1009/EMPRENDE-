import { IconSymbol } from '@/components/ui/icon-symbol';
import { colors } from '@/src/theme';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: '#000000',
          shadowOpacity: 0.05,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: -2 },
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size || 24} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="aprende"
        options={{
          title: 'Aprende',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size || 24} name="book.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mi-idea"
        options={{
          title: 'Mi Idea',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size || 24} name="lightbulb.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="retos"
        options={{
          title: 'Retos',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size || 24} name="flag.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="proyecto"
        options={{
          title: 'Mi Proyecto',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size || 24} name="folder.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
