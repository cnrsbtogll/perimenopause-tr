import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import '../i18n/i18n';
import theme from '../constants/theme';
import { SUPPORTED_LANGUAGES, SupportedLanguageCode } from '../i18n/i18n';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation('common');
  const [langModalVisible, setLangModalVisible] = useState(false);

  const currentLangCode = (i18n.language?.slice(0, 2) || 'tr') as SupportedLanguageCode;
  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLangCode) || SUPPORTED_LANGUAGES[0];

  const handleSelectLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setLangModalVisible(false);
  };

  const handleClearData = () => {
    Alert.alert(
      t('settings.clear_confirm_title'),
      t('settings.clear_confirm_desc'),
      [
        { text: t('buttons.cancel'), style: 'cancel' },
        {
          text: t('buttons.delete_all'),
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert(t('settings.clear_done_title'), t('settings.clear_done_desc'));
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('navigation.settings')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Bulut & Gizlilik Durumu */}
        <Text style={styles.sectionHeader}>{t('settings.cloud_section')}</Text>
        <View style={styles.groupedCard}>
          <View style={styles.rowItem}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconWrap, { backgroundColor: theme.colors.mintSoft }]}>
                <Ionicons name="cloud-done-outline" size={20} color={theme.colors.mint} />
              </View>
              <View>
                <Text style={styles.rowLabel}>{t('settings.storage_mode')}</Text>
                <Text style={styles.rowSub}>{t('settings.storage_sub')}</Text>
              </View>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{t('settings.safe_badge')}</Text>
            </View>
          </View>
        </View>

        {/* Tercihler */}
        <Text style={styles.sectionHeader}>{t('settings.preferences')}</Text>
        <View style={styles.groupedCard}>
          <TouchableOpacity
            style={styles.rowItem}
            onPress={() => setLangModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconWrap, { backgroundColor: theme.colors.accentSoft }]}>
                <Ionicons name="globe-outline" size={20} color={theme.colors.accent} />
              </View>
              <View>
                <Text style={styles.rowLabel}>{t('settings.app_language')}</Text>
                <Text style={styles.rowSub}>
                  {currentLangObj.flag} {currentLangObj.nativeName}
                </Text>
              </View>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.langCodeBadge}>{currentLangCode.toUpperCase()}</Text>
              <Ionicons name="chevron-forward" size={18} color={theme.colors.subtle} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Veri Yönetimi */}
        <Text style={styles.sectionHeader}>{t('settings.data_section')}</Text>
        <View style={styles.groupedCard}>
          <TouchableOpacity style={styles.rowItem} onPress={handleClearData} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconWrap, { backgroundColor: theme.colors.coralSoft }]}>
                <Ionicons name="trash-outline" size={20} color={theme.colors.coral} />
              </View>
              <View>
                <Text style={[styles.rowLabel, { color: theme.colors.coral }]}>
                  {t('settings.clear_records')}
                </Text>
                <Text style={styles.rowSub}>
                  {t('settings.clear_records_sub')}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.subtle} />
          </TouchableOpacity>
        </View>

        {/* Uygulama Bilgisi */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>{t('app.name')}</Text>
          <Text style={styles.aboutVersion}>
            {t('app.version')} • {t('app.tagline')}
          </Text>
          <Text style={styles.aboutDisclaimer}>
            {t('settings.disclaimer')}
          </Text>
        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={langModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLangModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setLangModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalCard}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('settings.app_language')}</Text>
              <TouchableOpacity onPress={() => setLangModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.muted} />
              </TouchableOpacity>
            </View>

            <View style={styles.langList}>
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = lang.code === currentLangCode;

                return (
                  <TouchableOpacity
                    key={lang.code}
                    style={[
                      styles.langOptionRow,
                      isSelected && { backgroundColor: theme.colors.accentSoft },
                    ]}
                    onPress={() => handleSelectLanguage(lang.code)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.langOptionLeft}>
                      <Text style={styles.langFlag}>{lang.flag}</Text>
                      <View>
                        <Text
                          style={[
                            styles.langNativeName,
                            isSelected && { color: theme.colors.accent, fontWeight: '700' },
                          ]}
                        >
                          {lang.nativeName}
                        </Text>
                        <Text style={styles.langSubLabel}>{lang.label}</Text>
                      </View>
                    </View>
                    {isSelected ? (
                      <Ionicons name="checkmark-circle" size={22} color={theme.colors.accent} />
                    ) : (
                      <View style={styles.unselectedRadio} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
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
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.muted,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.md,
    letterSpacing: 0.5,
  },
  groupedCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    overflow: 'hidden',
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  langCodeBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.muted,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  rowSub: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: 2,
  },
  badge: {
    backgroundColor: theme.colors.mintSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.mint,
  },
  aboutCard: {
    alignItems: 'center',
    marginTop: theme.spacing.xl * 1.5,
    paddingHorizontal: theme.spacing.md,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  aboutVersion: {
    fontSize: 13,
    color: theme.colors.muted,
    marginTop: 2,
  },
  aboutDisclaimer: {
    fontSize: 11,
    color: theme.colors.subtle,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    lineHeight: 16,
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
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  langList: {
    gap: 6,
  },
  langOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  langOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  langFlag: {
    fontSize: 24,
  },
  langNativeName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  langSubLabel: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: 1,
  },
  unselectedRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.subtle,
  },
});