import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input, ScreenLayout } from '../components/ui';
import theme from '../styles/theme';
import type { RootStackParamList } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      // Navegação automática via troca de stack
    } else {
      setError(result.error || 'Erro ao fazer login');
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <ScreenLayout scroll keyboardAvoiding>
      <View style={{ marginTop: theme.spacing.lg, marginBottom: theme.spacing.xl }}>
        <Text
          style={{
            fontSize: theme.typography.h1.fontSize,
            fontWeight: '700',
            color: theme.colors.primary,
            marginBottom: theme.spacing.sm,
          }}
          accessibilityRole="header"
        >
          HealthConnect
        </Text>
        <Text
          style={{
            fontSize: theme.typography.body.fontSize,
            color: theme.colors.textMuted,
          }}
        >
          Agendamento de consultas médicas
        </Text>
      </View>

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
        autoCorrect={false}
        accessibilityLabel="Campo de email"
      />

      <Input
        label="Senha"
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
          <Icon name="alert-circle" type="ionicon" size={18} color={theme.colors.error} style={{ marginRight: 8 }} />
          <Text style={{ color: theme.colors.error, fontSize: theme.typography.caption.fontSize, flex: 1 }}>
            {error}
          </Text>
        </View>
      ) : null}

      <Button
        onPress={handleLogin}
        loading={loading}
        fullWidth
        style={{ marginTop: theme.spacing.lg }}
        accessibilityLabel="Entrar na conta"
      >
        Entrar
      </Button>

      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        style={{
          alignItems: 'center',
          marginTop: theme.spacing.md,
          padding: theme.spacing.md,
          minHeight: theme.touchTarget,
          justifyContent: 'center',
        }}
        accessibilityRole="button"
        accessibilityLabel="Ir para cadastro"
      >
        <Text style={{ color: theme.colors.primary, fontSize: theme.typography.body.fontSize, fontWeight: '500' }}>
          Não tem conta? Cadastre-se
        </Text>
      </TouchableOpacity>

      <View
        style={{
          marginTop: theme.spacing.xl * 1.5,
          paddingTop: theme.spacing.lg,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
        }}
      >
        <Text
          style={{
            fontSize: theme.typography.caption.fontSize,
            color: theme.colors.textMuted,
            marginBottom: theme.spacing.md,
          }}
        >
          Contas de demonstração
        </Text>
        <TouchableOpacity
          onPress={() => handleDemoLogin('teste@paciente.com', '123456')}
          style={{ paddingVertical: theme.spacing.sm, minHeight: theme.touchTarget, justifyContent: 'center' }}
          accessibilityRole="button"
          accessibilityLabel="Usar conta do paciente João Teste"
        >
          <Text style={{ color: theme.colors.primary, fontSize: theme.typography.body.fontSize }}>
            Paciente (João Teste)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDemoLogin('joao@example.com', '123456')}
          style={{ paddingVertical: theme.spacing.sm, minHeight: theme.touchTarget, justifyContent: 'center' }}
          accessibilityRole="button"
          accessibilityLabel="Usar conta do médico Dr. João Silva"
        >
          <Text style={{ color: theme.colors.primary, fontSize: theme.typography.body.fontSize }}>
            Médico (Dr. João Silva)
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
};

export default LoginScreen;
