import React from 'react';
import { TouchableOpacity, View, ViewStyle, StyleSheet } from 'react-native';
import theme from '../../styles/theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined';
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export default function Card({
  children,
  onPress,
  variant = 'elevated',
  style,
  accessibilityLabel,
}: CardProps) {
  const containerStyle = [
    styles.base,
    variant === 'elevated' && theme.shadows.md,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[containerStyle, style]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[containerStyle, style]} accessibilityLabel={accessibilityLabel}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
});
