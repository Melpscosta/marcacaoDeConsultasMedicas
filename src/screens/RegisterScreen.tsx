import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input, ScreenLayout, ScreenHeader } from '../components/ui';
import theme from '../styles/theme';
import type { RootStackParamList } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');
    setLoading(true);
    const result = await register(name, email, password, confirmPassword);
    setLoading(false);
    if (result.success) {
      // Navegação automática via troca de stack
    } else {
      setError(result.error || 'Erro ao cadastrar');
    }
  };

  return (
    <ScreenLayout scroll keyboardAvoiding safeAreaEdges={['bottom', 'left', 'right']}>
      <ScreenHeader
        title="Cadastro"
        subtitle="Preencha os dados para criar sua conta"
        variant="transparent"
        onBack={() => navigation.goBack()}
        accessibilityLabel="Tela de cadastro"
      />

      <View style={{ paddingBottom: theme.spacing.xxl }}>
        <Input
          label="Nome completo"
          placeholder="Seu nome"
          value={name}
          onChangeText={(t) => {
            setName(t);
            setError('');
          }}
          autoCapitalize="words"
          accessibilityLabel="Campo de nome completo"
        />

        <Input
          label="Email"
          placeholder="seu@email.com"
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            setError('');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          accessibilityLabel="Campo de email"
        />

        <Input
          label="Senha (mínimo 6 caracteres)"
          placeholder="••••••••"
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            setError('');
          }}
          secureTextEntry={!showPassword}
          rightIcon={{
            name: showPassword ? 'eye-off' : 'eye',
            onPress: () => setShowPassword(!showPassword),
            ariaLabel: showPassword ? 'Ocultar senha' : 'Mostrar senha',
          }}
          accessibilityLabel="Campo de senha"
        />

        <Input
          label="Confirmar senha"
          placeholder="••••••••"
          value={confirmPassword}
          onChangeText={(t) => {
            setConfirmPassword(t);
            setError('');
          }}
          secureTextEntry
          accessibilityLabel="Campo de confirmação de senha"
        />

        {error ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: theme.spacing.sm,
              padding: theme.spacing.sm,
              backgroundColor: theme.colors.errorMuted,
              borderRadius: theme.radius.sm,
            }}
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
          >
            <Text style={{ color: theme.colors.error, fontSize: theme.typography.caption.fontSize, flex: 1 }}>
              {error}
            </Text>
          </View>
        ) : null}

        <Button
          onPress={handleRegister}
          loading={loading}
          fullWidth
          style={{ marginTop: theme.spacing.lg }}
          accessibilityLabel="Cadastrar conta"
        >
          Cadastrar
        </Button>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            alignItems: 'center',
            marginTop: theme.spacing.md,
            padding: theme.spacing.md,
            minHeight: theme.touchTarget,
            justifyContent: 'center',
          }}
          accessibilityRole="button"
          accessibilityLabel="Voltar para login"
        >
          <Text style={{ color: theme.colors.primary, fontSize: theme.typography.body.fontSize, fontWeight: '500' }}>
            Já tem conta? Faça login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            alignItems: 'center',
            marginTop: theme.spacing.sm,
            padding: theme.spacing.sm,
            minHeight: theme.touchTarget,
            justifyContent: 'center',
          }}
          accessibilityRole="button"
          accessibilityLabel="Usar conta de demonstração"
        >
          <Text style={{ color: theme.colors.textMuted, fontSize: theme.typography.caption.fontSize }}>
            Usar conta de demonstração
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
};

export default RegisterScreen;
