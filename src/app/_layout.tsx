import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../i18n/i18n';

export default function RootLayout() {
  const { t } = useTranslation('common');

  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            const name =
              route.name === 'index'
                ? focused
                  ? 'home'
                  : 'home-outline'
                : route.name === 'tracker'
                  ? focused
                    ? 'list'
                    : 'list-outline'
                  : route.name === 'report'
                    ? focused
                      ? 'document-text'
                      : 'document-text-outline'
                    : focused
                      ? 'settings'
                      : 'settings-outline';
            return <Ionicons name={name} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#0A84FF',
          tabBarInactiveTintColor: '#94A3B8',
          headerShown: false,
        })}
      >
        <Tabs.Screen name="index" options={{ title: t('navigation.home') }} />
        <Tabs.Screen name="tracker" options={{ title: t('navigation.tracker') }} />
        <Tabs.Screen name="report" options={{ title: t('navigation.report') }} />
        <Tabs.Screen name="settings" options={{ title: t('navigation.settings') }} />
      </Tabs>
    </SafeAreaProvider>
  );
}