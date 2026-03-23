import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import theme from '../../styles/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const VARIANT_STYLES: Record<ButtonVariant, { bg: string; text: string; border?: string }> = {
  primary: { bg: theme.colors.primary, text: theme.colors.white },
  secondary: { bg: theme.colors.secondary, text: theme.colors.white },
  outline: { bg: 'transparent', text: theme.colors.primary, border: theme.colors.primary },
  ghost: { bg: 'transparent', text: theme.colors.primary },
  destructive: { bg: theme.colors.error, text: theme.colors.white },
};

export default function Button({
  onPress,
  children,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) {
  const config = VARIANT_STYLES[variant];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.base,
        {
          backgroundColor: config.bg,
          borderWidth: config.border ? 2 : 0,
          borderColor: config.border,
          opacity: isDisabled ? 0.6 : 1,
          width: fullWidth ? '100%' : undefined,
          minHeight: theme.touchTarget,
        },
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityLabel={accessibilityLabel ?? (typeof children === 'string' ? children : undefined)}
      accessibilityHint={accessibilityHint}
    >
      {loading ? (
        <ActivityIndicator color={config.text} size="small" />
      ) : (
        <Text style={[styles.text, { color: config.text }, textStyle]}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
  },
  text: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
});
