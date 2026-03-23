import React from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Icon } from 'react-native-elements';
import theme from '../../styles/theme';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  rightIcon?: { name: 'eye' | 'eye-off'; onPress: () => void; ariaLabel?: string };
  containerStyle?: object;
}

export default function Input({
  label,
  error,
  rightIcon,
  containerStyle,
  accessibilityLabel: accessibilityLabelProp,
  ...props
}: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={styles.label}
          accessibilityLabel={label}
          accessibilityRole="text"
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputWrapper,
          error && styles.inputError,
        ]}
      >
        <TextInput
          placeholderTextColor={theme.colors.textMuted}
          style={[styles.input, rightIcon && styles.inputWithIcon]}
          {...props}
          accessibilityLabel={accessibilityLabelProp ?? label}
          accessibilityHint={error}
        />
        {rightIcon && (
          <TouchableOpacity
            onPress={rightIcon.onPress}
            style={styles.iconButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel={rightIcon.ariaLabel ?? 'Alternar visibilidade'}
          >
            <Icon
              name={rightIcon.name}
              type="ionicon"
              size={22}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text
          style={styles.error}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  },
  inputWithIcon: {
    paddingRight: theme.spacing.sm,
  },
  iconButton: {
    padding: theme.spacing.md,
    minWidth: theme.touchTarget,
    minHeight: theme.touchTarget,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.error,
    marginTop: theme.spacing.sm,
  },
});
