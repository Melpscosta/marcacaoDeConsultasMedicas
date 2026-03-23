import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from 'react-native-elements';
import theme from '../../styles/theme';

type HeaderVariant = 'primary' | 'transparent';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  variant?: HeaderVariant;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  accessibilityLabel?: string;
}

export default function ScreenHeader({
  title,
  subtitle,
  variant = 'primary',
  onBack,
  rightAction,
  accessibilityLabel,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const isPrimary = variant === 'primary';
  const textColor = isPrimary ? theme.colors.white : theme.colors.text;

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: insets.top + theme.spacing.sm,
          paddingBottom: theme.spacing.md,
          paddingHorizontal: theme.spacing.md,
          backgroundColor: isPrimary ? theme.colors.primary : 'transparent',
        },
      ]}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole="header"
    >
      <View style={styles.row}>
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={styles.iconButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Icon name="arrow-back" type="ionicon" size={24} color={textColor} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconButton} />
        )}

        <View style={styles.center}>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                { color: isPrimary ? 'rgba(255,255,255,0.85)' : theme.colors.textMuted },
              ]}
            >
              {subtitle}
            </Text>
          )}
          <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {rightAction ?? <View style={styles.iconButton} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: theme.touchTarget,
    height: theme.touchTarget,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    marginHorizontal: theme.spacing.sm,
    justifyContent: 'center',
    minWidth: 0,
  },
  subtitle: {
    fontSize: theme.typography.small.fontSize,
    marginBottom: 2,
  },
  title: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: '600',
  },
});
