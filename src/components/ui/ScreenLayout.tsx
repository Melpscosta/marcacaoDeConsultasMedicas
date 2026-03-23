import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  ScrollViewProps,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import theme from '../../styles/theme';

type SafeAreaEdge = 'top' | 'bottom' | 'left' | 'right';

interface ScreenLayoutProps {
  children: React.ReactNode;
  scroll?: boolean;
  keyboardAvoiding?: boolean;
  contentStyle?: ViewStyle;
  scrollContentStyle?: ViewStyle;
  scrollProps?: Omit<ScrollViewProps, 'style' | 'contentContainerStyle'>;
  /** Edges to apply safe area insets. Default: all. Use ['bottom','left','right'] when header handles top. */
  safeAreaEdges?: SafeAreaEdge[];
}

export function useScreenInsets() {
  return useSafeAreaInsets();
}

export default function ScreenLayout({
  children,
  scroll = false,
  keyboardAvoiding = false,
  contentStyle,
  scrollContentStyle,
  scrollProps,
  safeAreaEdges = ['top', 'bottom', 'left', 'right'],
}: ScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const paddingTop = safeAreaEdges.includes('top') ? insets.top : 0;
  const paddingBottom = Math.max(
    safeAreaEdges.includes('bottom') ? insets.bottom : 0,
    theme.spacing.lg
  );
  const paddingHorizontal = Math.max(
    safeAreaEdges.includes('left') ? insets.left : 0,
    safeAreaEdges.includes('right') ? insets.right : 0,
    theme.spacing.md
  );

  const content = (
    <View
      style={[
        styles.content,
        {
          paddingTop,
          paddingBottom,
          paddingHorizontal,
        },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  if (scroll) {
    const scrollContent = (
      <ScrollView
        style={styles.fill}
        contentContainerStyle={[{ flexGrow: 1, paddingBottom: 40 }, scrollContentStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        {...scrollProps}
      >
        {content}
      </ScrollView>
    );

    if (keyboardAvoiding) {
      return (
        <View style={styles.fill}>
          <KeyboardAvoidingView
            style={styles.fill}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={0}
          >
            {scrollContent}
          </KeyboardAvoidingView>
        </View>
      );
    }

    return <View style={styles.fill}>{scrollContent}</View>;
  }

  return (
    <View style={[styles.fill, styles.bg]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  bg: {
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
});
