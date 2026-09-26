import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Perimenopause TR</Text>
        <Text style={styles.subtitle}>Kadin Saglik Takip</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Gunluk Semptom Takibi</Text>
          <Text style={styles.cardText}>
            Sicak dalga, ter, uyku, ruh halini kaydedin.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>HRT Korelasyonu</Text>
          <Text style={styles.cardText}>
            Hormonsuz takviyeler ve reseptiyon iliskisinizi inceleyin.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Doktor Raporu</Text>
          <Text style={styles.cardText}>
            Verilerinizi PDF olarak paylasin.
          </Text>
        </View>
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 0,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#777',
    lineHeight: 20,
  },
});
