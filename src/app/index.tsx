import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import 'i18next';
import '../i18n/i18n';
import theme from '../constants/theme';

export default function HomeScreen() {
  const { t } = useTranslation('common');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>{t('app.name')}</Text>
        <Text style={styles.subtitle}>{t('app.description')}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('symptoms.hot_flash')}</Text>
          <Text style={styles.cardText}>{t('buttons.start')}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('navigation.tracker')}</Text>
          <Text style={styles.cardText}>{t('states.loading')}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('navigation.report')}</Text>
          <Text style={styles.cardText}>{t('states.success')}</Text>
        </View>
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 0,
  },
  inner: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.muted,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: theme.colors.subtle,
    lineHeight: 20,
  },
});