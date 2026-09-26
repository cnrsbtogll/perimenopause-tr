import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import '../i18n/i18n';
import theme from '../constants/theme';
import { useSymptomRecords, SymptomType } from '../symptoms/store';

const SYMPTOM_META_MAP: Record<
  SymptomType,
  { titleKey: string; icon: keyof typeof Ionicons.glyphMap; color: string; bgColor: string }
> = {
  hot_flash: { titleKey: 'symptoms.hot_flash', icon: 'flame', color: theme.colors.coral, bgColor: theme.colors.coralSoft },
  night_sweat: { titleKey: 'symptoms.night_sweat', icon: 'water', color: theme.colors.accent, bgColor: theme.colors.accentSoft },
  mood: { titleKey: 'symptoms.mood', icon: 'heart', color: '#EC4899', bgColor: '#FDF2F8' },
  sleep: { titleKey: 'symptoms.sleep', icon: 'moon', color: theme.colors.lavender, bgColor: theme.colors.lavenderSoft },
  energy: { titleKey: 'symptoms.energy', icon: 'flash', color: theme.colors.peach, bgColor: theme.colors.peachSoft },
  period: { titleKey: 'symptoms.period', icon: 'calendar', color: theme.colors.mint, bgColor: theme.colors.mintSoft },
};

export default function ReportScreen() {
  const { t, i18n } = useTranslation('common');
  const { records } = useSymptomRecords();

  const totalDaysLogged = records.length;

  const stats = React.useMemo(() => {
    const counts: Record<SymptomType, { count: number; totalSeverity: number }> = {
      hot_flash: { count: 0, totalSeverity: 0 },
      night_sweat: { count: 0, totalSeverity: 0 },
      mood: { count: 0, totalSeverity: 0 },
      sleep: { count: 0, totalSeverity: 0 },
      energy: { count: 0, totalSeverity: 0 },
      period: { count: 0, totalSeverity: 0 },
    };

    let totalSymptomEvents = 0;

    for (const record of records) {
      for (const entry of record.symptoms) {
        if (counts[entry.type]) {
          counts[entry.type].count += 1;
          counts[entry.type].totalSeverity += entry.severity;
          totalSymptomEvents += 1;
        }
      }
    }

    return { counts, totalSymptomEvents };
  }, [records]);

  const handleShareDoctorReport = async () => {
    if (records.length === 0) {
      Alert.alert(t('app.name'), t('report.empty_share_alert'));
      return;
    }

    const lines: string[] = [
      `📋 ${t('app.name').toUpperCase()} - ${t('report.doctor_summary_title').toUpperCase()}`,
      `Date: ${new Date().toLocaleDateString(i18n.language || 'tr')}`,
      `${t('report.days_tracked')}: ${totalDaysLogged}`,
      '----------------------------------------',
      `${t('report.symptom_distribution').toUpperCase()}:`,
    ];

    (Object.keys(stats.counts) as SymptomType[]).forEach((type) => {
      const data = stats.counts[type];
      const meta = SYMPTOM_META_MAP[type];
      if (data.count > 0) {
        const avg = (data.totalSeverity / data.count).toFixed(1);
        lines.push(`• ${t(meta.titleKey)}: ${data.count} ${t('report.days_unit')} (${t('report.avg_unit')} ${avg}/5)`);
      }
    });

    lines.push('----------------------------------------');
    records.slice(0, 5).forEach((rec) => {
      const symList = rec.symptoms
        .map((s) => `${t(SYMPTOM_META_MAP[s.type]?.titleKey || s.type)} (${s.severity}/5)${s.note ? ` [${s.note}]` : ''}`)
        .join(', ');
      lines.push(`${rec.date}: ${symList}`);
    });

    lines.push(`\n*${t('settings.disclaimer')}`);

    try {
      await Share.share({
        message: lines.join('\n'),
        title: `${t('app.name')} - ${t('report.doctor_summary_title')}`,
      });
    } catch {
      // Ignored
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('navigation.report')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Summary Metric Cards */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricNumber}>{totalDaysLogged}</Text>
            <Text style={styles.metricLabel}>{t('report.days_tracked')}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricNumber, { color: theme.colors.accent }]}>
              {stats.totalSymptomEvents}
            </Text>
            <Text style={styles.metricLabel}>{t('report.logged_symptoms')}</Text>
          </View>
        </View>

        {/* Doctor Share Banner */}
        <View style={styles.doctorCard}>
          <View style={styles.doctorCardLeft}>
            <View style={styles.doctorIconCircle}>
              <Ionicons name="medkit" size={24} color={theme.colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.doctorTitle}>{t('report.doctor_summary_title')}</Text>
              <Text style={styles.doctorSubtitle}>
                {t('report.doctor_summary_sub')}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShareDoctorReport}
            activeOpacity={0.8}
          >
            <Ionicons name="share-outline" size={18} color="#FFFFFF" />
            <Text style={styles.shareButtonText}>{t('report.share_report')}</Text>
          </TouchableOpacity>
        </View>

        {/* Symptom Frequency Distribution */}
        <Text style={styles.sectionTitle}>{t('report.symptom_distribution')}</Text>
        <Text style={styles.sectionSubtitle}>
          {t('report.symptom_distribution_sub')}
        </Text>

        <View style={styles.statsCard}>
          {totalDaysLogged === 0 ? (
            <View style={styles.emptyWrap}>
              <Ionicons name="bar-chart-outline" size={32} color={theme.colors.subtle} />
              <Text style={styles.emptyText}>{t('report.no_data')}</Text>
            </View>
          ) : (
            (Object.keys(stats.counts) as SymptomType[]).map((type) => {
              const data = stats.counts[type];
              const meta = SYMPTOM_META_MAP[type];
              const avg = data.count > 0 ? (data.totalSeverity / data.count).toFixed(1) : '0';
              const percent = totalDaysLogged > 0 ? Math.min(100, Math.round((data.count / totalDaysLogged) * 100)) : 0;

              return (
                <View key={type} style={styles.statRow}>
                  <View style={styles.statRowHeader}>
                    <View style={styles.statLabelWrap}>
                      <Ionicons name={meta.icon} size={16} color={meta.color} />
                      <Text style={styles.statLabel}>{t(meta.titleKey)}</Text>
                    </View>
                    <Text style={styles.statValue}>
                      {data.count} {t('report.days_unit')} • {t('report.avg_unit')} {avg}/5
                    </Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${Math.max(4, percent)}%`, backgroundColor: meta.color },
                      ]}
                    />
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* HRT / Takviye Rehberi Kartı */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <Ionicons name="shield-checkmark-outline" size={20} color={theme.colors.mint} />
            <Text style={styles.infoCardTitle}>{t('report.hrt_title')}</Text>
          </View>
          <Text style={styles.infoCardBody}>
            {t('report.hrt_body')}
          </Text>
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
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 2,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  metricCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  metricNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
  },
  metricLabel: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: 2,
  },
  doctorCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.primaryDark,
    marginBottom: theme.spacing.xl,
  },
  doctorCardLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  doctorIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  doctorSubtitle: {
    fontSize: 13,
    color: theme.colors.muted,
    lineHeight: 18,
    marginTop: 2,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.accent,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
    gap: 8,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
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
  statsCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: theme.spacing.lg,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.muted,
    marginTop: theme.spacing.sm,
  },
  statRow: {
    marginBottom: theme.spacing.md,
  },
  statRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.muted,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: theme.radius.full,
  },
  infoCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  infoCardBody: {
    fontSize: 13,
    color: theme.colors.muted,
    lineHeight: 19,
  },
});