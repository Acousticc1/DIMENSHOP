import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { useAuthStore } from '../../application/stores/useAuthStore';
import { Button } from '../../presentation/components/ui/Button';

export default function BuyerProfile() {
  const { user, signOut } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>My Profile</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.role}>Role: {user?.role.toUpperCase()}</Text>

        <Button
          title="Sign Out"
          variant="outline"
          onPress={signOut}
          style={styles.signOutBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F11',
  },
  content: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#E5E5EA',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 40,
  },
  signOutBtn: {
    width: '80%',
  },
});
