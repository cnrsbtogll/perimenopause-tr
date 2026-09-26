import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import '../i18n/i18n';
import theme from '../constants/theme';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation('common');

  const currentLang = i18n.language || 'tr';

  const toggleLanguage = () => {
    const nextLang = currentLang.startsWith('tr') ? 'en' : 'tr';
    i18n.changeLanguage(nextLang);
  };

  const handleClearData = () => {
    Alert.alert(
      'Verileri Sıfırla',
      'Cihazınızdaki tüm semptom kayıtları silinecektir. Bu işlem geri alınamaz. Emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Tümünü Sil',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert('Tamamlandı', 'Tüm kayıtlar başarıyla temizlendi.');
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
        <Text style={styles.sectionHeader}>BULUT & GİZLİLİK</Text>
        <View style={styles.groupedCard}>
          <View style={styles.rowItem}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconWrap, { backgroundColor: theme.colors.mintSoft }]}>
                <Ionicons name="cloud-done-outline" size={20} color={theme.colors.mint} />
              </View>
              <View>
                <Text style={styles.rowLabel}>Depolama Modu</Text>
                <Text style={styles.rowSub}>Yerel Cihaz (Offline-First Aktif)</Text>
              </View>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Güvenli</Text>
            </View>
          </View>
        </View>

        {/* Tercihler */}
        <Text style={styles.sectionHeader}>TERCİHLER</Text>
        <View style={styles.groupedCard}>
          <TouchableOpacity style={styles.rowItem} onPress={toggleLanguage} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconWrap, { backgroundColor: theme.colors.accentSoft }]}>
                <Ionicons name="globe-outline" size={20} color={theme.colors.accent} />
              </View>
              <View>
                <Text style={styles.rowLabel}>Uygulama Dili</Text>
                <Text style={styles.rowSub}>
                  {currentLang.startsWith('tr') ? 'Türkçe' : 'English'}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.subtle} />
          </TouchableOpacity>
        </View>

        {/* Veri Yönetimi */}
        <Text style={styles.sectionHeader}>VERİ YÖNETİMİ</Text>
        <View style={styles.groupedCard}>
          <TouchableOpacity style={styles.rowItem} onPress={handleClearData} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconWrap, { backgroundColor: theme.colors.coralSoft }]}>
                <Ionicons name="trash-outline" size={20} color={theme.colors.coral} />
              </View>
              <View>
                <Text style={[styles.rowLabel, { color: theme.colors.coral }]}>Kayıtları Temizle</Text>
                <Text style={styles.rowSub}>Cihazdaki tüm semptom verilerini sil</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.subtle} />
          </TouchableOpacity>
        </View>

        {/* Uygulama Bilgisi */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>{t('app.name')}</Text>
          <Text style={styles.aboutVersion}>Sürüm {t('app.version')} • Kadın Sağlığı Rehberi</Text>
          <Text style={styles.aboutDisclaimer}>
            Bu uygulama bilgilendirme ve kişisel takip amaçlıdır, tıbbi tanı ve tedavi yerine geçmez.
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
});