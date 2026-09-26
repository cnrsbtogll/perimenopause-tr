import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import 'i18next';
import '../i18n/i18n';
import { Ionicons } from '@expo/vector-icons';
import theme from '../constants/theme';

const SYMPTOM_TYPES = [
  { key: 'hot_flash', icon: 'thermometer' },
  { key: 'night_sweat', icon: 'water' },
  { key: 'mood', icon: 'heart' },
  { key: 'sleep', icon: 'moon' },
  { key: 'energy', icon: 'flash' },
  { key: 'period', icon: 'calendar' },
] as const;

export default function TrackerScreen() {
  const { t } = useTranslation('common');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('navigation.tracker')}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>{t('symptoms.hot_flash')}</Text>
        <View style={styles.symptomGrid}>
          {SYMPTOM_TYPES.map((type) => (
            <TouchableOpacity key={type.key} style={styles.symptomCard} onPress={() => {}}>
              <Ionicons name={type.icon} size={24} color={theme.colors.accent} />
              <Text style={styles.symptomLabel}>{t(`symptoms.${type.key}`)}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('buttons.start')}</Text>
          <Text style={styles.cardText}>{t('states.loading')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.muted,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  symptomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  symptomCard: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  symptomLabel: {
    marginTop: theme.spacing.xs,
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    textAlign: 'center',
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
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