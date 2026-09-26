import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import '../i18n/i18n';
import theme from '../constants/theme';
import {
  useSymptomRecords,
  SymptomType,
  getTodayString,
} from '../symptoms/store';

interface SymptomMeta {
  key: SymptomType;
  titleKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
}

const SYMPTOM_METAS: SymptomMeta[] = [
  { key: 'hot_flash', titleKey: 'symptoms.hot_flash', icon: 'flame', color: theme.colors.coral, bgColor: theme.colors.coralSoft },
  { key: 'night_sweat', titleKey: 'symptoms.night_sweat', icon: 'water', color: theme.colors.accent, bgColor: theme.colors.accentSoft },
  { key: 'mood', titleKey: 'symptoms.mood', icon: 'heart', color: '#EC4899', bgColor: '#FDF2F8' },
  { key: 'sleep', titleKey: 'symptoms.sleep', icon: 'moon', color: theme.colors.lavender, bgColor: theme.colors.lavenderSoft },
  { key: 'energy', titleKey: 'symptoms.energy', icon: 'flash', color: theme.colors.peach, bgColor: theme.colors.peachSoft },
  { key: 'period', titleKey: 'symptoms.period', icon: 'calendar', color: theme.colors.mint, bgColor: theme.colors.mintSoft },
];

const SEVERITY_LEVEL_KEYS = [
  { level: 1, key: 'severity.level_1' },
  { level: 2, key: 'severity.level_2' },
  { level: 3, key: 'severity.level_3' },
  { level: 4, key: 'severity.level_4' },
  { level: 5, key: 'severity.level_5' },
];

export default function TrackerScreen() {
  const { t } = useTranslation('common');
  const {
    selectedDate,
    setSelectedDate,
    selectedDateRecord,
    addOrUpdateSymptom,
    saveRecord,
  } = useSymptomRecords();

  const [activeModalSymptom, setActiveModalSymptom] = useState<SymptomMeta | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<number>(3);
  const [symptomNote, setSymptomNote] = useState<string>('');

  const today = getTodayString();
  const isToday = selectedDate === today;

  const handleOpenSymptomModal = (meta: SymptomMeta) => {
    const existing = selectedDateRecord?.symptoms.find((s) => s.type === meta.key);
    setSelectedSeverity(existing?.severity || 3);
    setSymptomNote(existing?.note || '');
    setActiveModalSymptom(meta);
  };

  const handleSaveSymptom = async () => {
    if (!activeModalSymptom) return;
    await addOrUpdateSymptom(selectedDate, {
      type: activeModalSymptom.key,
      severity: selectedSeverity,
      note: symptomNote.trim(),
    });
    setActiveModalSymptom(null);
  };

  const handleRemoveSymptom = async (type: SymptomType) => {
    if (!selectedDateRecord) return;
    const filtered = selectedDateRecord.symptoms.filter((s) => s.type !== type);
    await saveRecord({
      ...selectedDateRecord,
      symptoms: filtered,
    });
    if (activeModalSymptom?.key === type) {
      setActiveModalSymptom(null);
    }
  };

  const changeDateByDays = (days: number) => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + days);
    const ny = date.getFullYear();
    const nm = String(date.getMonth() + 1).padStart(2, '0');
    const nd = String(date.getDate()).padStart(2, '0');
    setSelectedDate(`${ny}-${nm}-${nd}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {/* Date Header Navigator */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.dateNavButton}
          onPress={() => changeDateByDays(-1)}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.dateCenter}>
          <Text style={styles.dateTitle}>
            {isToday ? t('tracker.today') : selectedDate}
          </Text>
          <Text style={styles.dateSubtitle}>
            {isToday ? selectedDate : t('tracker.past_record')}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.dateNavButton, isToday && { opacity: 0.3 }]}
          onPress={() => !isToday && changeDateByDays(1)}
          disabled={isToday}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>{t('tracker.select_symptom_title')}</Text>
        <Text style={styles.sectionSubtitle}>
          {t('tracker.select_symptom_sub')}
        </Text>

        {/* Symptoms Grid */}
        <View style={styles.symptomGrid}>
          {SYMPTOM_METAS.map((meta) => {
            const logged = selectedDateRecord?.symptoms.find((s) => s.type === meta.key);
            const isLogged = Boolean(logged);

            return (
              <TouchableOpacity
                key={meta.key}
                style={[
                  styles.symptomCard,
                  isLogged && { borderColor: meta.color, borderWidth: 1.5 },
                ]}
                onPress={() => handleOpenSymptomModal(meta)}
                activeOpacity={0.75}
              >
                <View style={[styles.iconCircle, { backgroundColor: meta.bgColor }]}>
                  <Ionicons name={meta.icon} size={26} color={meta.color} />
                </View>
                <Text style={styles.symptomLabel}>{t(meta.titleKey)}</Text>
                {isLogged ? (
                  <View style={[styles.severityBadge, { backgroundColor: meta.color }]}>
                    <Text style={styles.severityBadgeText}>
                      {logged?.severity}/5
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.notLoggedText}>{t('tracker.no_record')}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Active Logged List for this day */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>
            {t('tracker.daily_records', { count: selectedDateRecord?.symptoms.length || 0 })}
          </Text>
          {(!selectedDateRecord || selectedDateRecord.symptoms.length === 0) ? (
            <View style={styles.emptyCard}>
              <Ionicons name="calendar-outline" size={32} color={theme.colors.subtle} />
              <Text style={styles.emptyTitle}>{t('tracker.empty_title')}</Text>
              <Text style={styles.emptySub}>
                {t('tracker.empty_sub')}
              </Text>
            </View>
          ) : (
            selectedDateRecord.symptoms.map((entry) => {
              const meta = SYMPTOM_METAS.find((m) => m.key === entry.type);
              if (!meta) return null;

              return (
                <View key={entry.id} style={styles.loggedRow}>
                  <View style={styles.loggedRowLeft}>
                    <View style={[styles.miniIcon, { backgroundColor: meta.bgColor }]}>
                      <Ionicons name={meta.icon} size={18} color={meta.color} />
                    </View>
                    <View>
                      <Text style={styles.loggedRowTitle}>{t(meta.titleKey)}</Text>
                      {entry.note ? (
                        <Text style={styles.loggedRowNote}>"{entry.note}"</Text>
                      ) : null}
                    </View>
                  </View>
                  <View style={styles.loggedRowRight}>
                    <Text style={[styles.loggedRowSeverity, { color: meta.color }]}>
                      {entry.severity}/5
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveSymptom(entry.type)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons name="trash-outline" size={18} color={theme.colors.muted} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Log Modal */}
      <Modal
        visible={Boolean(activeModalSymptom)}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveModalSymptom(null)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalBackdropTouch} />
          </TouchableWithoutFeedback>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleWrap}>
                <Ionicons
                  name={activeModalSymptom?.icon || 'add'}
                  size={24}
                  color={activeModalSymptom?.color || theme.colors.accent}
                />
                <Text style={styles.modalTitle}>
                  {activeModalSymptom ? t(activeModalSymptom.titleKey) : ''}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setActiveModalSymptom(null)}>
                <Ionicons name="close" size={24} color={theme.colors.muted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSectionLabel}>{t('tracker.severity_label')}</Text>
            <View style={styles.severitySelector}>
              {SEVERITY_LEVEL_KEYS.map(({ level, key }) => {
                const isSelected = selectedSeverity === level;
                return (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.severityOption,
                      isSelected && {
                        backgroundColor: activeModalSymptom?.color || theme.colors.accent,
                        borderColor: activeModalSymptom?.color || theme.colors.accent,
                      },
                    ]}
                    onPress={() => setSelectedSeverity(level)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.severityOptionNum,
                        isSelected && { color: '#FFFFFF' },
                      ]}
                    >
                      {level}
                    </Text>
                    <Text
                      style={[
                        styles.severityOptionLabel,
                        isSelected && { color: '#FFFFFF' },
                      ]}
                    >
                      {t(key)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.modalSectionLabel}>{t('tracker.personal_note')}</Text>
            <TextInput
              style={styles.noteInput}
              placeholder={t('tracker.note_placeholder')}
              placeholderTextColor={theme.colors.subtle}
              value={symptomNote}
              onChangeText={setSymptomNote}
              maxLength={120}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleSaveSymptom}
                activeOpacity={0.8}
              >
                <Text style={styles.modalSaveButtonText}>{t('buttons.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  dateNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateCenter: {
    alignItems: 'center',
  },
  dateTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.text,
  },
  dateSubtitle: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: theme.colors.muted,
    marginTop: 2,
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
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  symptomLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
  },
  severityBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  notLoggedText: {
    fontSize: 12,
    color: theme.colors.subtle,
  },
  summarySection: {
    marginTop: theme.spacing.sm,
  },
  emptyCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginTop: theme.spacing.sm,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  emptySub: {
    fontSize: 13,
    color: theme.colors.muted,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  loggedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginTop: theme.spacing.sm,
  },
  loggedRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  miniIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loggedRowTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  loggedRowNote: {
    fontSize: 12,
    color: theme.colors.muted,
    fontStyle: 'italic',
    marginTop: 2,
  },
  loggedRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  loggedRowSeverity: {
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalBackdropTouch: {
    flex: 1,
  },
  modalCard: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 1.5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  modalHeaderTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  modalSectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.muted,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  severitySelector: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  severityOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.background,
  },
  severityOptionNum: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  severityOptionLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.muted,
    marginTop: 2,
    textAlign: 'center',
  },
  noteInput: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    fontSize: 14,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: theme.spacing.lg,
  },
  modalActions: {
    marginTop: theme.spacing.xs,
  },
  modalSaveButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  modalSaveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});