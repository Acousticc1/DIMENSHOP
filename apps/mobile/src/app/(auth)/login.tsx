import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SignInScreen } from '../../presentation/screens/auth/SignInScreen';
import { SignUpScreen } from '../../presentation/screens/auth/SignUpScreen';

export default function LoginPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSuccess = () => {
    // Navigate back to index route to recalculate dashboard routing
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      {isRegistering ? (
        <SignUpScreen
          onNavigateToSignIn={() => setIsRegistering(false)}
          onSuccess={handleSuccess}
        />
      ) : (
        <SignInScreen
          onNavigateToSignUp={() => setIsRegistering(true)}
          onSuccess={handleSuccess}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F11',
  },
});
