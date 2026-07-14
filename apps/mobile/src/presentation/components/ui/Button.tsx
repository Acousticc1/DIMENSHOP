import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  TouchableOpacityProps, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle 
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  isLoading = false,
  style,
  disabled,
  ...props
}) => {
  const buttonStyles: ViewStyle[] = [
    styles.button,
    styles[variant],
    (disabled || isLoading) ? styles.disabled : {},
    style as ViewStyle,
  ];

  const textStyles: TextStyle[] = [
    styles.text,
    variant === 'outline' || variant === 'ghost' ? styles.textDark : styles.textLight,
    variant === 'danger' ? styles.textDanger : {},
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#FFFFFF' : '#FFFFFF'} />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: '#6366F1', // Indigo primary
  },
  secondary: {
    backgroundColor: '#2C2C2E',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: '#FF453A',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  textLight: {
    color: '#FFFFFF',
  },
  textDark: {
    color: '#E5E5EA',
  },
  textDanger: {
    color: '#FFFFFF',
  },
});
