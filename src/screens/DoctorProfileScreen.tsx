import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { ScreenHeader } from '../components/ui';
import theme from '../styles/theme';
import type { RootStackParamList } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type DoctorProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DoctorProfile'>;
};

const DoctorProfileScreen: React.FC<DoctorProfileScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  return (
    <View style={styles.container}>
      {showLogoutConfirm && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Sair da conta?</Text>
            <Text style={styles.modalText}>
              Deseja realmente sair? Você precisará fazer login novamente.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setShowLogoutConfirm(false)}
                style={styles.cancelButton}
                accessibilityRole="button"
                accessibilityLabel="Cancelar e permanecer logado"
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmLogout}
                style={styles.confirmButton}
                accessibilityRole="button"
                accessibilityLabel="Confirmar saída da conta"
              >
                <Text style={styles.confirmButtonText}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <ScreenHeader
        title="Meu Perfil"
        variant="primary"
        onBack={() => navigation.goBack()}
        accessibilityLabel="Tela de perfil do médico"
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: Math.max(insets.left, insets.right, theme.spacing.md),
          paddingBottom: insets.bottom + 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.avatarSection, theme.shadows.md]}>
          <Image
            source={{ uri: user?.avatar || 'https://via.placeholder.com/150' }}
            style={styles.avatar}
            accessibilityIgnoresInvertColors
          />
          <Text style={styles.name}>{user?.name || 'Médico'}</Text>
          <Text style={styles.email}>{user?.email || ''}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>Médico</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações</Text>
          <View style={[styles.infoCard, theme.shadows.sm]}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nome</Text>
              <Text style={styles.infoValue}>{user?.name || '-'}</Text>
            </View>
            <View style={[styles.infoRow, styles.infoRowLast]}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email || '-'}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setShowLogoutConfirm(true)}
          style={styles.logoutButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Sair da conta"
        >
          <Icon name="log-out-outline" type="ionicon" size={22} color={theme.colors.error} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    margin: theme.spacing.md,
    minWidth: 280,
  },
  modalTitle: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  modalText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.border,
  },
  cancelButtonText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.text,
  },
  confirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.error,
  },
  confirmButtonText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.white,
  },
  avatarSection: {
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: theme.spacing.md,
  },
  name: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  roleBadge: {
    backgroundColor: theme.colors.primaryMuted,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: theme.radius.full,
  },
  roleBadgeText: {
    fontSize: theme.typography.small.fontSize,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  section: { marginBottom: theme.spacing.md },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoRowLast: { borderBottomWidth: 0 },
  infoLabel: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textMuted,
  },
  infoValue: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '500',
    color: theme.colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.error,
    marginTop: theme.spacing.lg,
    minHeight: theme.touchTarget,
  },
  logoutText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.error,
  },
});

export default DoctorProfileScreen;
