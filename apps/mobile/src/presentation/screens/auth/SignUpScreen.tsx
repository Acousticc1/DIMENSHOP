import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, SignUpInput } from '../../../shared/utils/validators';
import { useAuthStore } from '../../../application/stores/useAuthStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { logger } from '../../../shared/utils/logger';

interface SignUpScreenProps {
  onNavigateToSignIn: () => void;
  onSuccess: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ 
  onNavigateToSignIn, 
  onSuccess 
}) => {
  const { signUp, isLoading, error } = useAuthStore();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: 'buyer',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: SignUpInput) => {
    try {
      logger.info('Submitting sign up form', { email: data.email, role: data.role });
      await signUp(data.email, data.password, data.fullName, data.role);
      onSuccess();
    } catch (err) {
      // Error is stored in Zustand and displayed
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>DIMENSHOP</Text>
          <Text style={styles.subtitle}>Create your profile to start exploring or selling 3D products.</Text>
        </View>

        <View style={styles.formCard}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Full Name"
                placeholder="John Doe"
                autoCapitalize="words"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.fullName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email Address"
                placeholder="email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="••••••"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
              />
            )}
          />

          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>I want to:</Text>
            <View style={styles.roleToggleGroup}>
              <TouchableOpacity
                style={[
                  styles.roleToggleOption,
                  selectedRole === 'buyer' ? styles.roleSelected : null,
                ]}
                onPress={() => setValue('role', 'buyer')}
              >
                <Text style={[
                  styles.roleToggleText,
                  selectedRole === 'buyer' ? styles.roleTextSelected : null,
                ]}>Buy Products</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleToggleOption,
                  selectedRole === 'seller' ? styles.roleSelected : null,
                ]}
                onPress={() => setValue('role', 'seller')}
              >
                <Text style={[
                  styles.roleToggleText,
                  selectedRole === 'seller' ? styles.roleTextSelected : null,
                ]}>Sell Products</Text>
              </TouchableOpacity>
            </View>
            {errors.role?.message && <Text style={styles.roleErrorText}>{errors.role.message}</Text>}
          </View>

          <Button
            title="Create Account"
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoading}
            style={styles.submitBtn}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={onNavigateToSignIn}>
            <Text style={styles.linkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F11',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  submitBtn: {
    marginTop: 8,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.3)',
  },
  errorText: {
    color: '#FF453A',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  roleContainer: {
    marginBottom: 20,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5E5EA',
    marginBottom: 8,
  },
  roleToggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    padding: 4,
  },
  roleToggleOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  roleSelected: {
    backgroundColor: '#6366F1',
  },
  roleToggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  roleTextSelected: {
    color: '#FFFFFF',
  },
  roleErrorText: {
    color: '#FF453A',
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#8E8E93',
    fontSize: 14,
  },
  linkText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '600',
  },
});
