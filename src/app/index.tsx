import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import '../i18n/i18n';
import theme from '../constants/theme';
import { useSymptomRecords, SymptomType, getTodayString } from '../symptoms/store';

const QUICK_SYMPTOMS: Array<{
  type: SymptomType;
  titleKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
}> = [
  { type: 'hot_flash', titleKey: 'symptoms.hot_flash', icon: 'flame', color: theme.colors.coral, bgColor: theme.colors.coralSoft },
  { type: 'night_sweat', titleKey: 'symptoms.night_sweat', icon: 'water', color: theme.colors.accent, bgColor: theme.colors.accentSoft },
  { type: 'mood', titleKey: 'symptoms.mood', icon: 'heart', color: '#EC4899', bgColor: '#FDF2F8' },
  { type: 'sleep', titleKey: 'symptoms.sleep', icon: 'moon', color: theme.colors.lavender, bgColor: theme.colors.lavenderSoft },
  { type: 'energy', titleKey: 'symptoms.energy', icon: 'flash', color: theme.colors.peach, bgColor: theme.colors.peachSoft },
];

const SEVERITY_LEVELS = [
  { level: 1, label: 'Hafif' },
  { level: 2, label: 'Düşük' },
  { level: 3, label: 'Orta' },
  { level: 4, label: 'Yüksek' },
  { level: 5, label: 'Şiddetli' },
];

export default function HomeScreen() {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const { selectedDateRecord, addOrUpdateSymptom, saveRecord } = useSymptomRecords();

  const [activeQuickSymptom, setActiveQuickSymptom] = useState<typeof QUICK_SYMPTOMS[0] | null>(null);

  const loggedSymptomsCount = selectedDateRecord?.symptoms.length || 0;

  const handleSelectSeverity = async (level: number) => {
    if (!activeQuickSymptom) return;
    const today = getTodayString();
    await addOrUpdateSymptom(today, {
      type: activeQuickSymptom.type,
      severity: level,
    });
    setActiveQuickSymptom(null);
  };

  const handleRemoveSymptom = async () => {
    if (!activeQuickSymptom || !selectedDateRecord) return;
    const filtered = selectedDateRecord.symptoms.filter((s) => s.type !== activeQuickSymptom.type);
    await saveRecord({
      ...selectedDateRecord,
      symptoms: filtered,
    });
    setActiveQuickSymptom(null);
  };

  const todayFormatted = React.useMemo(() => {
    try {
      const now = new Date();
      const locale = i18n.language === 'tr' ? 'tr-TR' : 'en-US';
      return now.toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
    } catch {
      return '';
    }
  }, [i18n.language]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Greeting */}
        <View style={styles.header}>
          <Text style={styles.dateText}>{todayFormatted}</Text>
          <Text style={styles.title}>Merhaba,</Text>
          <Text style={styles.subtitle}>Bugün nasıl hissediyorsun?</Text>
        </View>

        {/* Status Banner */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Ionicons name="sparkles" size={16} color={theme.colors.accent} />
            <Text style={styles.heroBadgeText}>Günlük Takip</Text>
          </View>
          <Text style={styles.heroTitle}>
            {loggedSymptomsCount > 0
              ? `Bugün ${loggedSymptomsCount} semptom kaydettiniz.`
              : 'Bugün henüz bir kayıt girmediniz.'}
          </Text>
          <Text style={styles.heroDescription}>
            Düzenli takip, hormonal dalgalanmalarınızı ve tetikleyicilerinizi daha net anlamanızı sağlar.
          </Text>
          <TouchableOpacity
            style={styles.heroButton}
            onPress={() => router.push('/tracker')}
            activeOpacity={0.8}
          >
            <Text style={styles.heroButtonText}>
              {loggedSymptomsCount > 0 ? 'Kayıtları Güncelle' : 'Bugünü Kaydet'}
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Quick Log Chips */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hızlı Semptom Takibi</Text>
          <TouchableOpacity onPress={() => router.push('/tracker')}>
            <Text style={styles.sectionLink}>Tümü</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickGrid}>
          {QUICK_SYMPTOMS.map((item) => {
            const loggedEntry = selectedDateRecord?.symptoms.find((s) => s.type === item.type);
            const isLogged = Boolean(loggedEntry);

            return (
              <TouchableOpacity
                key={item.type}
                style={[
                  styles.quickCard,
                  isLogged && { borderColor: item.color, borderWidth: 1.5 },
                ]}
                onPress={() => setActiveQuickSymptom(item)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconCircle, { backgroundColor: item.bgColor }]}>
                  <Ionicons name={item.icon} size={22} color={item.color} />
                </View>
                <Text style={styles.quickLabel}>{t(item.titleKey)}</Text>
                {isLogged ? (
                  <View style={[styles.statusPill, { backgroundColor: item.bgColor }]}>
                    <Text style={[styles.statusPillText, { color: item.color }]}>
                      Şiddet: {loggedEntry?.severity}/5
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.unloggedText}>+ Kaydet</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Health Insight Card */}
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Ionicons name="bulb-outline" size={20} color={theme.colors.peach} />
            <Text style={styles.insightTitle}>Günün İpucu</Text>
          </View>
          <Text style={styles.insightBody}>
            Sıcak dalgalarını hafifletmek için kat kat giyinmeyi, bol su tüketmeyi ve kafein alımını dengelemeyi deneyebilirsiniz.
          </Text>
        </View>

        {/* Reports Preview Shortcut */}
        <TouchableOpacity
          style={styles.reportShortcut}
          onPress={() => router.push('/report')}
          activeOpacity={0.8}
        >
          <View style={styles.reportShortcutLeft}>
            <View style={styles.reportIconCircle}>
              <Ionicons name="document-text" size={22} color={theme.colors.accent} />
            </View>
            <View>
              <Text style={styles.reportShortcutTitle}>Doktor & Trend Raporu</Text>
              <Text style={styles.reportShortcutSub}>Haftalık değişimlerinizi inceleyin</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.subtle} />
        </TouchableOpacity>
      </ScrollView>

      {/* Quick Severity Sheet Modal */}
      <Modal
        visible={Boolean(activeQuickSymptom)}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveQuickSymptom(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActiveQuickSymptom(null)}
        >
          <TouchableOpacity
            style={styles.modalCard}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleWrap}>
                <Ionicons
                  name={activeQuickSymptom?.icon || 'sparkles'}
                  size={24}
                  color={activeQuickSymptom?.color || theme.colors.accent}
                />
                <Text style={styles.modalTitle}>
                  {activeQuickSymptom ? t(activeQuickSymptom.titleKey) : ''}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setActiveQuickSymptom(null)}>
                <Ionicons name="close" size={24} color={theme.colors.muted} />
              </TouchableOpacity>
            </View>

            <View style={styles.todayNoticeBanner}>
              <Ionicons name="calendar-outline" size={14} color={theme.colors.accent} />
              <Text style={styles.todayNoticeText}>
                Bu kayıt <Text style={styles.todayNoticeBold}>Bugün ({todayFormatted})</Text> için günlüğünüze işlenecektir.
              </Text>
            </View>

            <Text style={styles.modalSubtitle}>Şiddet derecesini seçin (1 - 5):</Text>

            <View style={styles.severityRow}>
              {SEVERITY_LEVELS.map(({ level, label }) => {
                const isSelected =
                  selectedDateRecord?.symptoms.find((s) => s.type === activeQuickSymptom?.type)
                    ?.severity === level;

                return (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.severityBtn,
                      isSelected && {
                        backgroundColor: activeQuickSymptom?.color || theme.colors.accent,
                        borderColor: activeQuickSymptom?.color || theme.colors.accent,
                      },
                    ]}
                    onPress={() => handleSelectSeverity(level)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.severityNum,
                        isSelected && { color: '#FFFFFF' },
                      ]}
                    >
                      {level}
                    </Text>
                    <Text
                      style={[
                        styles.severityLabel,
                        isSelected && { color: '#FFFFFF' },
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {selectedDateRecord?.symptoms.some((s) => s.type === activeQuickSymptom?.type) ? (
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={handleRemoveSymptom}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={16} color={theme.colors.coral} />
                <Text style={styles.removeBtnText}>Bugünkü Kaydı Kaldır</Text>
              </TouchableOpacity>
            ) : null}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl * 1.5,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    color: theme.colors.muted,
    marginTop: 2,
  },
  heroCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.primaryDark,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.accent,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 6,
  },
  heroDescription: {
    fontSize: 14,
    color: theme.colors.muted,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.accent,
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    gap: 8,
  },
  heroButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.accent,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  quickCard: {
    width: '48%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  quickLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
    marginTop: 2,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  unloggedText: {
    fontSize: 12,
    color: theme.colors.subtle,
    marginTop: 2,
  },
  insightCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: theme.spacing.lg,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  insightBody: {
    fontSize: 13,
    color: theme.colors.muted,
    lineHeight: 19,
  },
  reportShortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  reportShortcutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  reportIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportShortcutTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  reportShortcutSub: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
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
    marginBottom: theme.spacing.sm,
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
  todayNoticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.accentSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.sm,
  },
  todayNoticeText: {
    fontSize: 12,
    color: theme.colors.accent,
    flex: 1,
  },
  todayNoticeBold: {
    fontWeight: '700',
  },
  modalSubtitle: {
    fontSize: 13,
    color: theme.colors.muted,
    marginBottom: theme.spacing.md,
  },
  severityRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  severityBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.background,
  },
  severityNum: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.text,
  },
  severityLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.muted,
    marginTop: 2,
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    marginTop: theme.spacing.xs,
  },
  removeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.coral,
  },
});