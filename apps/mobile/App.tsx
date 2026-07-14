import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.card}>
        <Text style={styles.title}>DIMENSHOP</Text>
        <Text style={styles.subtitle}>Role-Based 3D E-Commerce</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Phase 3: Environment Setup</Text>
        </View>
        <Text style={styles.desc}>
          Clean architecture, Supabase integration, and photogrammetry pipeline are being initialized.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F11',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#18181C',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A32',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#8A8A93',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  badge: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    marginBottom: 20,
  },
  badgeText: {
    color: '#818CF8',
    fontSize: 12,
    fontWeight: '600',
  },
  desc: {
    fontSize: 14,
    color: '#D1D1D6',
    textAlign: 'center',
    lineHeight: 20,
  },
});
