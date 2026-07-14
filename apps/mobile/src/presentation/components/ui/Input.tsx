import React, { forwardRef } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, style, ...props }, ref) => {
    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            error ? styles.inputError : null,
            style,
          ]}
          placeholderTextColor="#636366"
          {...props}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5E5EA',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  inputError: {
    borderColor: '#FF453A',
  },
  errorText: {
    color: '#FF453A',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
